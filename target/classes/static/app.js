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

// Initialize JARVIS voice parameters (Iron Man style)
window.voiceParams = {
    rate: 0.85,   // Slower, more articulate speech
    pitch: 1.1,   // Slightly higher, more sophisticated pitch
    volume: 0.9   // Clear, confident volume
};

// Web Speech API
// availableVoices removed; speakText will query speechSynthesis directly.

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
                // Read text aloud using browser TTS
                speakText(msg);
            } else if (textContent.startsWith("PYTTSX3_UNAVAILABLE:")) {
                const msg = textContent.substring(20);
                logMessage('JARVIS', msg);
                speakText(msg);  // Fallback to browser TTS
            } else {
                // Assume it's real audio data (WAV, MP3, etc.)
                logMessage('JARVIS', '[Audio Response Received]');
                playAudioData(event.data);
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

        // Notify settings module about current backend state (if available)
        if (window.SettingsState && typeof window.SettingsState.setConfig === 'function') {
            window.SettingsState.setConfig(config);
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

// Play real audio data (WAV, MP3, etc.) from high-quality TTS providers
function playAudioData(audioBuffer) {
    try {
        // Create blob from audio data
        const blob = new Blob([audioBuffer], { type: 'audio/wav' });  // or audio/mpeg for MP3
        const audioUrl = URL.createObjectURL(blob);

        // Create and play audio element
        const audio = new Audio();
        audio.src = audioUrl;

        audio.onplay = () => {
            arcReactor.classList.add('active');
            statusText.innerText = 'SPEAKING...';
        };

        audio.onended = () => {
            arcReactor.classList.remove('active');
            statusText.innerText = 'SYSTEM ONLINE';
            URL.revokeObjectURL(audioUrl);  // Cleanup
        };

        audio.onerror = (e) => {
            console.error("Audio playback error:", e);
            arcReactor.classList.remove('active');
            statusText.innerText = 'SYSTEM ONLINE';
        };

        audio.play();
    } catch (e) {
        console.error("Error playing audio:", e);
        arcReactor.classList.remove('active');
        statusText.innerText = 'SYSTEM ONLINE';
    }
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
    if (window.VoiceActivation) {
        if (window.VoiceActivation.isListening()) {
            // Stop voice activation
            window.VoiceActivation.stop();
            isRecording = false;
            arcReactor.classList.remove('active');
            arcReactor.style.boxShadow = '';
            statusText.innerText = 'VOICE ACTIVATION DISABLED';
            statusText.style.color = '#ff3333';
            logMessage('SYS', '🔇 Voice Activation Disabled');
        } else {
            // Start voice activation
            window.VoiceActivation.start();
            isRecording = true;
            statusText.innerText = 'LISTENING FOR: "JARVIS"';
            statusText.style.color = '#33ff33';
            logMessage('SYS', '🎤 Voice Activation Enabled - Say "JARVIS"');
        }
    }
});

// Voice Activation - no longer needed (handled by voiceActivation.js)
function startRecordingMode() {
    if (window.VoiceActivation) {
        window.VoiceActivation.start();
    }
}

function stopRecordingMode() {
    if (window.VoiceActivation) {
        window.VoiceActivation.stop();
    }
}

// Removed settings-related handlers and functions (moved to settingsUi.js)

// Web Speech API - Voice loading with JARVIS-style parameters
function speakText(text) {
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // JARVIS-style voice parameters (inspired by Iron Man's JARVIS)
        // Slower, more articulate speech with British sophistication
        utterance.rate = (window.voiceParams && window.voiceParams.rate) || 0.85;      // Slower speech rate
        utterance.pitch = (window.voiceParams && window.voiceParams.pitch) || 1.1;     // Slightly higher pitch
        utterance.volume = (window.voiceParams && window.voiceParams.volume) || 0.9;   // Clear, confident volume

        // Resolve selected voice by stable id (name::lang) when possible
        try {
            const vid = (document.getElementById('voice-select') || {}).value;
            const voicesList = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
            if (vid && voicesList && voicesList.length) {
                const parts = vid.split('::');
                if (parts.length === 2) {
                    const [name, lang] = parts;
                    const match = voicesList.find(v => v.name === name && v.lang === lang);
                    if (match) utterance.voice = match;
                }
            } else if (voicesList && voicesList.length) {
                // If no voice selected, try to find a sophisticated-sounding voice
                // Prefer English voices, preferably with "Google" or "Microsoft" in the name
                const preferredVoice =
                    voicesList.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
                    voicesList.find(v => v.lang.startsWith('en') && v.name.includes('Microsoft')) ||
                    voicesList.find(v => v.lang.startsWith('en-GB')) ||
                    voicesList.find(v => v.lang.startsWith('en'));
                if (preferredVoice) utterance.voice = preferredVoice;
            }
        } catch (e) {
            console.warn('Error resolving voice for speakText', e);
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

// Init
window.addEventListener('DOMContentLoaded', () => {
    connectWebSocket();
    fetchConfig();

    // Initialize voice activation (continuous listening for "JARVIS" wakeword)
    // Wait a moment to ensure voiceActivation.js is fully loaded
    setTimeout(() => {
        if (window.VoiceActivation && window.voiceActivationReady === true) {
            console.log('✅ Voice Activation module loaded successfully');
            window.VoiceActivation.init();

            // Start listening for wakeword after another short delay
            setTimeout(() => {
                if (window.voiceActivationReady) {
                    window.VoiceActivation.start();
                    logMessage('SYS', '🎤 Voice Activation Ready - Say "JARVIS" to activate');
                } else {
                    console.warn('⚠️ Voice Activation not ready - check browser compatibility');
                    logMessage('SYS', '⚠️ Voice Activation not available - check browser compatibility');
                }
            }, 300);
        } else if (window.VoiceActivation === undefined) {
            console.error('❌ Voice Activation module NOT found - voiceActivation.js may not have loaded');
            logMessage('SYS', '❌ Voice Activation module not loaded');
        } else {
            console.warn('⚠️ Voice Activation module found but not ready');
            logMessage('SYS', '⚠️ Voice Activation initializing...');
            // Try again after a delay
            setTimeout(() => {
                if (window.voiceActivationReady === true) {
                    window.VoiceActivation.start();
                    logMessage('SYS', '🎤 Voice Activation Ready');
                }
            }, 1000);
        }
    }, 200);

    // Settings UI will load voices when the modal opens; no immediate populate here.
});
