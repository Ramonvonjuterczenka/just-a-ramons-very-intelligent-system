/**
 * JARVIS Voice Activation Engine
 * Simplified version - focus on reliability over features
 */

(function() {
    'use strict';

    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.error('❌ Web Speech API NOT supported in this browser');
        window.voiceActivationReady = false;
        return;
    }

    console.log('✅ Web Speech API supported');

    // State
    let recognizer = null;
    let isListening = false;
    let isProcessing = false;
    const CONFIG = {
        wakeword: 'jarvis',
        language: 'en-US',
        continuous: true,
        interimResults: true,
        microphoneId: localStorage.getItem('jarvis_microphone_id') || ''
    };

    let finalTranscript = '';
    let interimTranscript = '';

    /**
     * Load saved preferences from localStorage
     */
    function loadSavedPreferences() {
        try {
            if (window.SettingsState && window.SettingsState.loadPreferences) {
                const prefs = window.SettingsState.loadPreferences();
                if (prefs) {
                    if (prefs.wakeword) CONFIG.wakeword = prefs.wakeword;
                    if (prefs.language) CONFIG.language = prefs.language;
                    if (prefs.microphoneId) CONFIG.microphoneId = prefs.microphoneId;
                    console.log('[VA] 📦 Loaded preferences from localStorage:', { wakeword: CONFIG.wakeword, language: CONFIG.language, microphoneId: CONFIG.microphoneId });
                }
            }
        } catch (e) {
            console.error('[VA] Error loading saved preferences:', e.message);
        }
    }

    /**
     * Initialize recognizer
     */
    function initializeVoiceActivation() {
        try {
            // Load saved preferences first
            loadSavedPreferences();

            recognizer = new SpeechRecognition();
            recognizer.continuous = CONFIG.continuous;
            recognizer.interimResults = CONFIG.interimResults;
            recognizer.language = CONFIG.language;

            recognizer.onstart = () => {
                console.log('[VA] Recognition started with language:', CONFIG.language);
                isListening = true;
            };

            recognizer.onresult = (event) => {
                // Only clear on first result of this recognition session
                if (event.resultIndex === 0) {
                    finalTranscript = '';
                    interimTranscript = '';
                }

                console.log('[VA] 📡 onresult event fired - resultIndex:', event.resultIndex, 'total results:', event.results.length);

                // Get all results from resultIndex onwards
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    const isFinal = result.isFinal;

                    // SpeechRecognitionResult is an array of alternatives
                    const transcript = result[0] ? result[0].transcript : '';
                    const confidence = result[0] ? result[0].confidence : 0;

                    console.log('[VA] Result[' + i + '] isFinal=' + isFinal + ' confidence=' + confidence.toFixed(2) + ' transcript="' + transcript + '"');

                    if (isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                const fullTranscript = (finalTranscript + interimTranscript).trim().toLowerCase();
                console.log('[VA] 🎤 FULL TRANSCRIPT: "' + fullTranscript + '"');
                console.log('[VA] 🌍 LANGUAGE CONFIG: ' + CONFIG.language);
                console.log('[VA] ✔️ RECOGNIZER LANGUAGE: ' + recognizer.language);

                // Check for wakeword if not processing
                if (!isProcessing && fullTranscript.includes(CONFIG.wakeword)) {
                    console.log('[VA] ✅ WAKEWORD DETECTED:', fullTranscript);
                    // Extract command (text after wakeword)
                    const commandText = fullTranscript.substring(fullTranscript.indexOf(CONFIG.wakeword) + CONFIG.wakeword.length).trim();

                    if (commandText) {
                        // Send command immediately (same as text input)
                        sendVoiceCommand(commandText);
                    } else {
                        // If only wakeword, start recording for command
                        startRecording();
                    }
                }

                // If processing, show transcript
                if (isProcessing) {
                    updateStatusText(fullTranscript);
                }
            };

            recognizer.onerror = (event) => {
                console.error('[VA] ❌ Recognition error:', event.error);
                console.log('[VA] Current language setting:', CONFIG.language);

                if (event.error === 'permission-denied' || event.error === 'not-allowed') {
                    console.error('[VA] ❌ Microphone permission denied');
                    updateStatusText('MICROPHONE BLOCKED - Check browser settings');
                    showMicButton();
                } else if (event.error === 'network') {
                    console.error('[VA] Network error - check internet connection');
                    updateStatusText('NETWORK ERROR - Check internet');
                } else if (event.error === 'no-speech') {
                    console.log('[VA] No speech detected - continuing to listen');
                }

                // Restart listening unless we're processing
                if (!isProcessing && CONFIG.continuous) {
                    setTimeout(() => {
                        try {
                            console.log('[VA] Attempting to restart listening after error');
                            recognizer.start();
                            console.log('[VA] ✅ Listening restarted');
                        } catch (e) {
                            console.error('[VA] Cannot restart listening:', e.message);
                        }
                    }, 1000);
                }
            };

            recognizer.onend = () => {
                console.log('[VA] Recognition ended - isProcessing:', isProcessing);
                isListening = false;
                
                // Restart if not processing and continuous mode
                if (!isProcessing && CONFIG.continuous) {
                    setTimeout(() => {
                        try {
                            console.log('[VA] Attempting to restart listening after onend');
                            recognizer.start();
                            console.log('[VA] ✅ Restarted listening');
                            isListening = true;
                        } catch (e) {
                            console.error('[VA] Cannot restart - ' + e.name + ':', e.message);
                            // Will retry after next interval
                        }
                    }, 500);
                }
            };

            window.voiceActivationReady = true;
            console.log('✅ Voice Activation initialized');
            return true;
        } catch (e) {
            console.error('❌ Failed to initialize Voice Activation:', e);
            window.voiceActivationReady = false;
            return false;
        }
    }

    /**
     * Request microphone permission and start listening
     */
    function requestMicrophoneAndStart() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error('[VA] getUserMedia not supported');
            return;
        }

        console.log('[VA] Requesting microphone permission with language:', CONFIG.language);
        console.log('[VA] Using microphone ID:', CONFIG.microphoneId || 'default');

        // Build audio constraints based on selected microphone
        const audioConstraints = CONFIG.microphoneId
            ? { deviceId: { exact: CONFIG.microphoneId } }
            : true;

        navigator.mediaDevices.getUserMedia({ audio: audioConstraints })
            .then((stream) => {
                // Stop the stream - we only needed permission
                stream.getTracks().forEach(track => track.stop());
                console.log('✅ [VA] Microphone permission GRANTED');
                console.log('[VA] 🎤 Ready to listen with language:', CONFIG.language);
                hideMicButton();
                
                // Start listening
                setTimeout(() => {
                    console.log('[VA] ▶️ Starting listening mode...');
                    startListening();
                }, 100);
            })
            .catch((error) => {
                console.error('[VA] ❌ Microphone error:', error.name, error.message);
                updateStatusText('MICROPHONE ERROR - ' + error.name);
                showMicButton();
            });
    }

    /**
     * Show "Enable Microphone" button
     */
    function showMicButton() {
        let btn = document.getElementById('enable-mic-button');
        if (btn) return; // Already shown

        btn = document.createElement('button');
        btn.id = 'enable-mic-button';
        btn.innerHTML = '🎤 Enable Microphone';
        btn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            padding: 12px 20px;
            background: #0a0a0a;
            color: #0ff;
            border: 2px solid #0ff;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            z-index: 10000;
            font-family: Orbitron, monospace;
        `;
        
        btn.addEventListener('click', () => {
            console.log('[VA] Mic button clicked');
            requestMicrophoneAndStart();
        });

        document.body.appendChild(btn);
        console.log('[VA] Mic button shown');
    }

    /**
     * Hide "Enable Microphone" button
     */
    function hideMicButton() {
        const btn = document.getElementById('enable-mic-button');
        if (btn) {
            btn.remove();
            console.log('[VA] Mic button hidden');
        }
    }

    /**
     * Start listening for wakeword
     */
    function startListening() {
        if (isListening) {
            console.log('[VA] ⚠️ Already listening, skipping...');
            return;
        }

        try {
            console.log('[VA] ▶️ Starting to listen for "' + CONFIG.wakeword.toUpperCase() + '"');
            console.log('[VA] 🌍 Language: ' + CONFIG.language);
            console.log('[VA] 🎙️ Recognizer language:', recognizer.language);
            console.log('[VA] Continuous mode:', CONFIG.continuous);

            isListening = true;
            isProcessing = false;
            finalTranscript = '';
            interimTranscript = '';
            
            updateStatusText('LISTENING FOR: "JARVIS"');
            recognizer.start();
            console.log('[VA] ✅ recognizer.start() called');
        } catch (e) {
            console.error('[VA] ❌ Error starting listening:', e.message);
            console.error('[VA] Stack:', e.stack);
            isListening = false;
        }
    }

    /**
     * Send voice command to server (same as text input)
     */
    function sendVoiceCommand(command) {
        console.log('[VA] 📤 Sending voice command to server:', command);
        console.log('[VA] Current WS state:', window.ws ? window.ws.readyState : 'undefined');

        isProcessing = true;

        // Stop current recognition session
        if (recognizer) {
            try {
                recognizer.stop();
                console.log('[VA] ⏹️ Recognizer stopped for command send');
            } catch (e) {
                console.error('[VA] Error stopping recognizer:', e.message);
            }
        }

        // Log to chat (same as app.js does)
        if (window.logMessage) {
            window.logMessage('USER (Voice)', command);
        }

        // Ensure WebSocket is connected before sending
        if (window.ws && window.ws.readyState === WebSocket.OPEN) {
            window.ws.send(command);
            if (window.startThinking) {
                window.startThinking();
            }
            console.log('[VA] ✅ Command sent to server immediately');

            // Restart listening for next command
            setTimeout(() => {
                isListening = false;
                isProcessing = false;
                startListening();
            }, 1000);
        } else {
            console.log('[VA] ⚠️ WebSocket not ready (state:', window.ws ? window.ws.readyState : 'null', '), establishing connection...');

            // First, ensure WebSocket is connecting
            if (window.connectWebSocket) {
                console.log('[VA] 🔗 Calling connectWebSocket()');
                window.connectWebSocket();
            } else {
                console.error('[VA] ❌ connectWebSocket() not available!');
            }

            if (window.fetchConfig) {
                console.log('[VA] ⚙️ Calling fetchConfig()');
                window.fetchConfig();
            }

            // Retry sending with much longer timeout (up to 30 seconds)
            const maxRetries = 60;  // 60 * 500ms = 30 seconds
            let retries = 0;
            let sent = false;

            const retryInterval = setInterval(() => {
                if (sent) {
                    clearInterval(retryInterval);
                    return;
                }

                const wsState = window.ws ? window.ws.readyState : 'undefined';
                console.log(`[VA] Retry ${retries + 1}/${maxRetries} - WS state: ${wsState} (CONNECTING=0, OPEN=1, CLOSING=2, CLOSED=3)`);

                if (window.ws && window.ws.readyState === WebSocket.OPEN) {
                    console.log('[VA] 📨 WebSocket connected! Sending command now...');
                    window.ws.send(command);
                    if (window.startThinking) {
                        window.startThinking();
                    }
                    console.log('[VA] ✅ Command sent to server (after retry)');
                    sent = true;
                    clearInterval(retryInterval);

                    // Restart listening
                    setTimeout(() => {
                        isListening = false;
                        isProcessing = false;
                        startListening();
                    }, 1000);
                } else if (retries >= maxRetries) {
                    console.error('[VA] ❌ WebSocket connection timeout after 30 seconds');
                    clearInterval(retryInterval);
                    sent = true;

                    // Still try to restart listening
                    isProcessing = false;
                    setTimeout(() => {
                        isListening = false;
                        startListening();
                    }, 1000);
                }
                retries++;
            }, 500);
        }
    }

    /**
     * Start recording mode (after wakeword detected with no command)
     */
    function startRecording() {
        isProcessing = true;
        finalTranscript = '';
        interimTranscript = '';

        console.log('[VA] 🔴 RECORDING - Listening for command');
        updateStatusText('RECORDING COMMAND...');

        // Activate arc reactor animation
        const arcReactor = document.querySelector('.arc-reactor');
        if (arcReactor) {
            arcReactor.classList.add('active');
            arcReactor.style.boxShadow = "0 0 60px #ff3333, inset 0 0 60px #ff3333";
        }

        // Auto-stop after 10 seconds of inactivity
        setTimeout(() => {
            if (isProcessing) {
                console.log('[VA] ⏱️ Recording timeout - auto-stopping');
                stopRecording();
            }
        }, 10000);
    }

    /**
     * Stop recording mode and send command to server
     */
    function stopRecording() {
        console.log('[VA] ⏹️ Recording stopped');
        updateStatusText('PROCESSING...');

        // Stop recognizer
        if (recognizer) {
            try {
                recognizer.stop();
                console.log('[VA] ⏹️ Recognizer stopped');
            } catch (e) {
                console.error('[VA] Error stopping recognizer in stopRecording:', e.message);
            }
        }

        // Reset arc reactor
        const arcReactor = document.querySelector('.arc-reactor');
        if (arcReactor) {
            arcReactor.classList.remove('active');
            arcReactor.style.boxShadow = '';
        }

        // Send command if we have text
        if (finalTranscript.trim()) {
            const command = finalTranscript.trim();
            isProcessing = false;
            sendVoiceCommand(command);
        } else {
            console.log('[VA] ⚠️ No command captured, resuming listening');
            isProcessing = false;
            // Resume listening after a moment
            setTimeout(() => {
                isListening = false;
                startListening();
            }, 500);
        }
    }

    /**
     * Update status text in UI
     */
    function updateStatusText(text) {
        const statusText = document.getElementById('status-text');
        if (statusText) {
            if (text.includes('LISTENING')) {
                statusText.style.color = '#33ff33';
            } else if (text.includes('RECORDING')) {
                statusText.style.color = '#ff3333';
            } else if (text.includes('PROCESSING')) {
                statusText.style.color = '#ffaa00';
            } else if (text.includes('MICROPHONE') || text.includes('ERROR')) {
                statusText.style.color = '#ff3333';
            } else {
                statusText.style.color = '#0ff';
            }
            statusText.innerText = text;
        }
    }

    /**
     * Public API
     */
    window.VoiceActivation = {
        init: initializeVoiceActivation,
        start: startListening,
        stop: () => {
            isListening = false;
            if (recognizer) recognizer.stop();
        },
        requestPermission: requestMicrophoneAndStart,
        setWakeword: (word) => {
            CONFIG.wakeword = word.toLowerCase();
            console.log('[VA] Wakeword changed to:', CONFIG.wakeword);
        },
        setLanguage: (lang) => {
            CONFIG.language = lang;
            if (recognizer) recognizer.language = lang;
            console.log('[VA] Language changed to:', CONFIG.language);
        },
        setMicrophone: (micId) => {
            CONFIG.microphoneId = micId || '';
            if (micId) {
                localStorage.setItem('jarvis_microphone_id', micId);
            } else {
                localStorage.removeItem('jarvis_microphone_id');
            }
            console.log('[VA] Microphone changed to:', micId || 'default');

            // Restart listening with new microphone
            if (isListening) {
                console.log('[VA] Restarting listening with new microphone...');
                if (recognizer) recognizer.stop();
                setTimeout(() => startListening(), 500);
            }
        },
        toggleDebug: () => { console.log('[VA] Debug mode'); },
        isListening: () => isListening,
        getConfig: () => ({ ...CONFIG })
    };

    // Auto-init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('[VA] DOMContentLoaded - initializing with language:', CONFIG.language);
            setTimeout(() => {
                initializeVoiceActivation();
                
                // Try to start listening after a delay
                setTimeout(() => {
                    console.log('[VA] Starting listening with language:', CONFIG.language);
                    requestMicrophoneAndStart();
                }, 500);
            }, 100);
        });
    } else {
        console.log('[VA] DOM already loaded - initializing with language:', CONFIG.language);
        setTimeout(() => {
            initializeVoiceActivation();
            setTimeout(() => {
                console.log('[VA] Starting listening with language:', CONFIG.language);
                requestMicrophoneAndStart();
            }, 500);
        }, 100);
    }
})();

