let ws;
let isRecording = false;
const micBtn = document.getElementById('mic-btn');
const arcReactor = document.querySelector('.arc-reactor');
const statusText = document.getElementById('status-text');
const logContent = document.getElementById('log-content');
const textInput = document.getElementById('text-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-log');
const configStatus = document.getElementById('config-status');

// Settings Elements
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const llmSelect = document.getElementById('llm-select');
const modelSelect = document.getElementById('model-select');
const ttsSelect = document.getElementById('tts-select');
const voiceSelect = document.getElementById('voice-select');
const voiceGroup = document.getElementById('voice-group');
const testVoiceBtn = document.getElementById('test-voice-btn');
const geminiKeyGroup = document.getElementById('gemini-key-group');
const geminiKeyInput = document.getElementById('gemini-key');
const testConnBtn = document.getElementById('test-conn-btn');
const testConnResult = document.getElementById('test-conn-result');

// Web Speech API
let availableVoices = [];
let recognition; // For wake word detection

// Web Audio API context
let audioContext;
let scriptProcessor;
let mediaStream;

// Connect WebSocket
function connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/jarvis-ws`;

    ws = new WebSocket(wsUrl);
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
        logMessage('SYS', 'WebSocket Connection Established.');
        statusText.innerText = 'SYSTEM ONLINE';
    };

    ws.onmessage = async (event) => {
        if (typeof event.data === 'string') {
            // Text response
            const payload = event.data;
            if (payload.startsWith("TEXT:")) {
                const responseText = payload.substring(5);
                logMessage('JARVIS', responseText);
            } else {
                logMessage('SYS', payload);
            }
            stopThinking();
        } else {
            // Binary (Audio) response
            stopThinking();

            // In our mock, the audio payload we return might just be UTF-8 string bytes
            // representing a dummy sound. Let's try to interpret it as text first for the MOCK.
            // If it was a real WAV, we'd play it via AudioContext.
            const decoder = new TextDecoder();
            const textContent = decoder.decode(event.data);

            if (textContent.startsWith("MOCK_AUDIO_PAYLOAD:")) {
                const msg = textContent.substring(19);
                logMessage('JARVIS (Audio Response)', msg);
                // "Play" the fake audio
                simulateAudioPlayback();
            } else if (textContent.startsWith("BROWSER_TTS_PAYLOAD:")) {
                const msg = textContent.substring(20);
                // Read text aloud
                speakText(msg);
            } else {
                logMessage('JARVIS', 'Received Binary Audio Payload... (Playback requires real TTS)');
                // Here you would decode audioData and play it
                // await playAudio(event.data);
            }
        }
    };

    ws.onclose = () => {
        logMessage('SYS', 'Connection Lost. Reconnecting...');
        statusText.innerText = 'OFFLINE';
        setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = (e) => {
        console.error("WS Error", e);
    };
}

// Fetch Config
async function fetchConfig() {
    try {
        const res = await fetch('/api/config');
        const config = await res.json();
        configStatus.innerText = `STT:[${config.stt}] LLM:[${config.llm}] TTS:[${config.tts}]`;

        // Sync UI with current backend state
        llmSelect.value = config.llm || 'mock';
        ttsSelect.value = config.tts || 'mock';
        updateGeminiKeyVisibility();
        updateVoiceVisibility();
        if (config.tts && config.tts !== 'browser') {
            fetchVoicesForTts(config.tts);
        }
    } catch (e) {
        configStatus.innerText = "CONFIG: ERROR";
    }
}

// UI Helpers
function logMessage(sender, message) {
    const div = document.createElement('div');
    div.className = `log-msg ${sender === 'JARVIS' || sender.startsWith('JARVIS') ? 'jarvis' : 'user'}`;

    const time = new Date().toLocaleTimeString();
    div.innerHTML = `[${time}] <strong>${sender}:</strong> ${message}`;

    logContent.appendChild(div);
    logContent.scrollTop = logContent.scrollHeight;
}

function startThinking() {
    statusText.innerText = 'PROCESSING...';
    arcReactor.classList.add('active');
}

function stopThinking() {
    statusText.innerText = 'SYSTEM ONLINE';
    arcReactor.classList.remove('active');
}

function simulateAudioPlayback() {
    arcReactor.classList.add('active');
    setTimeout(() => {
        arcReactor.classList.remove('active');
    }, 2000); // simulate 2s playback
}


// Event Listeners
sendBtn.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (text && ws && ws.readyState === WebSocket.OPEN) {
        logMessage('USER', text);
        ws.send(text);
        textInput.value = '';
        startThinking();
    }
});

textInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});

clearBtn.addEventListener('click', () => {
    logContent.innerHTML = '';
});

micBtn.addEventListener('click', () => {
    if (!isRecording) {
        startRecordingMode();
    } else {
        stopRecordingMode();
    }
});

// Mock Recording functionality (Real recording requires getUserMedia)
function startRecordingMode() {
    // We are mocking real mic access for simplicity in the mock. 
    // Usually you'd use navigator.mediaDevices.getUserMedia({ audio: true })
    isRecording = true;
    arcReactor.classList.add('active');
    arcReactor.style.boxShadow = "0 0 60px #ff3333, inset 0 0 60px #ff3333"; // Red for recording
    statusText.innerText = 'LISTENING...';
    statusText.style.color = '#ff3333';
}

function stopRecordingMode() {
    isRecording = false;
    arcReactor.classList.remove('active');
    arcReactor.style.boxShadow = ""; // reset
    statusText.style.color = ""; // reset
    startThinking();

    // Simulate sending an audio blob to WebSocket after recording
    if (ws && ws.readyState === WebSocket.OPEN) {
        logMessage('USER (Audio)', '[Sent Voice Data]');
        // Sending a dummy byte array representing 1 sec of audio
        const dummyAudio = new Uint8Array(1024);
        ws.send(dummyAudio.buffer);
    }
}

// Settings Logic
settingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
    testConnResult.innerText = '';
    updateGeminiKeyVisibility();
    fetchModelsForLlm(llmSelect.value);
});

closeSettingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
});

llmSelect.addEventListener('change', () => {
    updateGeminiKeyVisibility();
    fetchModelsForLlm(llmSelect.value);
});

function updateGeminiKeyVisibility() {
    if (llmSelect.value === 'gemini') {
        geminiKeyGroup.style.display = 'flex';
    } else {
        geminiKeyGroup.style.display = 'none';
    }
}

ttsSelect.addEventListener('change', () => {
    updateVoiceVisibility();
    if (ttsSelect.value === 'browser') {
        populateVoices();
    } else {
        fetchVoicesForTts(ttsSelect.value);
    }
});

function updateVoiceVisibility() {
    voiceGroup.style.display = 'flex';
}

// Web Speech API - Voice loading
function populateVoices() {
    availableVoices = window.speechSynthesis.getVoices();
    voiceSelect.innerHTML = '';

    availableVoices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = index;

        if (voice.default) {
            option.selected = true;
        }
        voiceSelect.appendChild(option);
    });
}

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        const selectedVoiceIndex = voiceSelect.value;
        if (selectedVoiceIndex && availableVoices[selectedVoiceIndex]) {
            utterance.voice = availableVoices[selectedVoiceIndex];
        }

        // UI visualizer integration
        utterance.onstart = () => {
            arcReactor.classList.add('active');
            statusText.innerText = 'SPEAKING...';
        };

        utterance.onend = () => {
            arcReactor.classList.remove('active');
            statusText.innerText = 'SYSTEM ONLINE';
        };

        utterance.onerror = (e) => {
            console.error("SpeechSynthesis error", e);
            arcReactor.classList.remove('active');
            statusText.innerText = 'SYSTEM ONLINE';
        };

        window.speechSynthesis.speak(utterance);
    } else {
        console.error("Speech Synthesis not supported in this browser.");
    }
}

testVoiceBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent accidental form submission if any
    if (ttsSelect.value === 'browser') {
        const selectedVoiceIndex = voiceSelect.value;
        if (selectedVoiceIndex && availableVoices[selectedVoiceIndex]) {
            const testPhrase = `Greetings. This is a test of the ${availableVoices[selectedVoiceIndex].name} vocal subsystem.`;
            speakText(testPhrase);
        } else {
            speakText("Please select a valid voice first.");
        }
    } else {
        logMessage('SYS', `Selected Voice: ${voiceSelect.value}. Use the chat input to test audio generation.`);
    }
});

async function fetchModelsForLlm(llmName) {
    modelSelect.innerHTML = '<option value="" disabled selected>Loading models...</option>';
    modelSelect.disabled = true;
    try {
        const res = await fetch(`/api/config/models?provider=${llmName}`);
        const data = await res.json();

        modelSelect.innerHTML = '';
        if (data.availableModels && data.availableModels.length > 0) {
            data.availableModels.forEach(model => {
                const opt = document.createElement('option');
                opt.value = model;
                opt.innerText = model;
                if (model === data.activeModel) {
                    opt.selected = true;
                }
                modelSelect.appendChild(opt);
            });
            modelSelect.disabled = false;
        } else {
            modelSelect.innerHTML = '<option value="" disabled>No models found</option>';
        }
    } catch (e) {
        modelSelect.innerHTML = '<option value="" disabled>Error fetching models</option>';
    }
}

async function fetchVoicesForTts(ttsName) {
    voiceSelect.innerHTML = '<option value="" disabled selected>Loading voices...</option>';
    voiceSelect.disabled = true;
    try {
        const res = await fetch(`/api/config/voices?provider=${ttsName}`);
        const data = await res.json();

        voiceSelect.innerHTML = '';
        if (data.availableVoices && data.availableVoices.length > 0) {
            data.availableVoices.forEach(voice => {
                const opt = document.createElement('option');
                opt.value = voice;
                opt.innerText = voice;
                if (voice === data.activeVoice) {
                    opt.selected = true;
                }
                voiceSelect.appendChild(opt);
            });
            voiceSelect.disabled = false;
        } else {
            voiceSelect.innerHTML = '<option value="" disabled>No voices found</option>';
        }
    } catch (e) {
        voiceSelect.innerHTML = '<option value="" disabled>Error fetching voices</option>';
    }
}

testConnBtn.addEventListener('click', async () => {
    testConnResult.innerText = 'Testing active config... (Save first)';
    testConnResult.style.color = '#a4b5c4';
    testConnBtn.disabled = true;
    try {
        const res = await fetch('/api/config/test');
        const data = await res.json();
        if (data.success === "true") {
            testConnResult.innerText = `Success: ${data.message}`;
            testConnResult.style.color = '#33ff33';
        } else {
            testConnResult.innerText = `Failed: ${data.message}`;
            testConnResult.style.color = '#ff3333';
        }
    } catch (e) {
        testConnResult.innerText = 'Test Failed (Network Error)';
        testConnResult.style.color = '#ff3333';
    } finally {
        testConnBtn.disabled = false;
    }
});

saveSettingsBtn.addEventListener('click', async () => {
    const activeLlm = llmSelect.value;
    const activeTts = ttsSelect.value;
    const geminiKey = geminiKeyInput.value.trim();

    saveSettingsBtn.innerText = 'SAVING...';

    const updates = {
        llm: activeLlm,
        tts: activeTts,
        model: modelSelect.value,
        voice: voiceSelect.value
    };
    if (activeLlm === 'gemini' && geminiKey) {
        updates.geminiKey = geminiKey;
    }

    try {
        const res = await fetch('/api/config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });

        const newConfig = await res.json();
        configStatus.innerText = `STT:[${newConfig.stt}] LLM:[${newConfig.llm}] TTS:[${newConfig.tts}]`;
        settingsModal.classList.add('hidden');
        logMessage('SYS', `Configuration Updated. LLM: ${newConfig.llm.toUpperCase()}`);
    } catch (e) {
        logMessage('SYS', 'Failed to save configuration.');
    } finally {
        saveSettingsBtn.innerText = 'SAVE & REBOOT';
    }
});

// Wake Word / Speech Recognition
function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.warn("Speech Recognition API not supported in this browser.");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US'; // Default to English

    recognition.onstart = () => {
        console.log("Wake word listener started.");
    };

    recognition.onerror = (event) => {
        // console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
            logMessage('SYS', 'Microphone access denied.');
        }
    };

    recognition.onend = () => {
        // Auto-restart for continuous listening, unless manually stopped
        // We use a flag or check 'recognition' object validity
        if (recognition) {
            try {
                recognition.start();
            } catch (e) {
                // ignore if already started
            }
        }
    };

    recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            // We look at final results
            if (event.results[i].isFinal) {
                const transcript = event.results[i][0].transcript.trim().toLowerCase();
                // console.log("Heard:", transcript);

                if (transcript.includes("jarvis")) {
                    // Extract command part
                    // "hello jarvis what time is it" -> "what time is it"
                    // "jarvis stop" -> "stop"
                    const parts = transcript.split("jarvis");
                    // Take the last part as the command usually? Or everything after first 'jarvis'?
                    // Let's assume the user says "Jarvis, [command]"
                    const command = parts.slice(1).join("jarvis").trim();

                    handleWakeWord(command);
                }
            }
        }
    };

    try {
        recognition.start();
    } catch (e) {
        console.error("Failed to start recognition:", e);
    }
}

function handleWakeWord(command) {
    logMessage('USER', '[Wake Word Detected]');

    // Stop any ongoing TTS
    stopSpeaking();

    if (command && command.length > 0) {
        // Send the command directly
        textInput.value = command;
        sendBtn.click();
    } else {
        // Just "Jarvis" was said.
        // Start listening state visual
        startThinking();
        statusText.innerText = 'LISTENING...';
    }
}

function stopSpeaking() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    // Also stop visualizer
    stopThinking();

    // Send a message to backend to clear any audio queues if processing
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send("STOP");
    }
}

// Init
window.addEventListener('DOMContentLoaded', () => {
    connectWebSocket();
    fetchConfig();

    // In some browsers voices are loaded synchronously immediately
    populateVoices();

    // Start Wake Word Listener
    // Note: User interaction usually required first to allow mic access
    // We'll try to start it, but browser might block until a click.
    // Adding a click listener to document to ensure we can start it once.
    document.addEventListener('click', () => {
        if (!recognition) {
            initSpeechRecognition();
        }
    }, { once: true });
});
