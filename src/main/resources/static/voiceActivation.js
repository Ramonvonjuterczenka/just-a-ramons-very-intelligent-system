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
        interimResults: true
    };

    let finalTranscript = '';
    let interimTranscript = '';

    /**
     * Initialize recognizer
     */
    function initializeVoiceActivation() {
        try {
            recognizer = new SpeechRecognition();
            recognizer.continuous = CONFIG.continuous;
            recognizer.interimResults = CONFIG.interimResults;
            recognizer.language = CONFIG.language;

            recognizer.onstart = () => {
                console.log('[VA] Recognition started');
                isListening = true;
            };

            recognizer.onresult = (event) => {
                finalTranscript = '';
                interimTranscript = '';

                // Get all results
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                const fullTranscript = (finalTranscript + interimTranscript).trim().toLowerCase();
                console.log('[VA] Heard:', fullTranscript);

                // Check for wakeword if not processing
                if (!isProcessing && fullTranscript.includes(CONFIG.wakeword)) {
                    console.log('[VA] ✅ WAKEWORD DETECTED:', fullTranscript);
                    startRecording();
                }

                // If processing, show transcript
                if (isProcessing) {
                    updateStatusText(fullTranscript);
                }
            };

            recognizer.onerror = (event) => {
                console.error('[VA] Recognition error:', event.error);
                
                if (event.error === 'permission-denied' || event.error === 'not-allowed') {
                    console.error('[VA] ❌ Microphone permission denied');
                    updateStatusText('MICROPHONE BLOCKED - Check browser settings');
                    showMicButton();
                }

                // Restart listening unless we're processing
                if (!isProcessing && CONFIG.continuous) {
                    setTimeout(() => {
                        try {
                            recognizer.start();
                        } catch (e) {
                            console.log('[VA] Restart listening:', e.message);
                        }
                    }, 1000);
                }
            };

            recognizer.onend = () => {
                console.log('[VA] Recognition ended');
                isListening = false;
                
                // Restart if not processing and continuous mode
                if (!isProcessing && CONFIG.continuous) {
                    setTimeout(() => {
                        try {
                            recognizer.start();
                            console.log('[VA] Restarted listening');
                        } catch (e) {
                            console.log('[VA] Cannot restart:', e.message);
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

        console.log('[VA] Requesting microphone permission...');
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                // Stop the stream - we only needed permission
                stream.getTracks().forEach(track => track.stop());
                console.log('✅ Microphone permission GRANTED');
                hideMicButton();
                
                // Start listening
                setTimeout(() => startListening(), 100);
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
        if (isListening) return;

        try {
            console.log('[VA] 🎤 Starting to listen for "' + CONFIG.wakeword.toUpperCase() + '"');
            isListening = true;
            isProcessing = false;
            finalTranscript = '';
            interimTranscript = '';
            
            updateStatusText('LISTENING FOR: "JARVIS"');
            recognizer.start();
        } catch (e) {
            console.error('[VA] Error starting listening:', e.message);
            isListening = false;
        }
    }

    /**
     * Start recording mode (after wakeword detected)
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

        // Auto-stop after 10 seconds
        setTimeout(() => {
            if (isProcessing) {
                stopRecording();
            }
        }, 10000);
    }

    /**
     * Stop recording and send to JARVIS
     */
    function stopRecording() {
        isProcessing = false;

        console.log('[VA] ⏹️ Recording stopped');
        updateStatusText('PROCESSING...');

        // Reset arc reactor
        const arcReactor = document.querySelector('.arc-reactor');
        if (arcReactor) {
            arcReactor.classList.remove('active');
            arcReactor.style.boxShadow = '';
        }

        // Send command if we have text
        if (finalTranscript.trim()) {
            const command = finalTranscript.trim();
            console.log('[VA] 📤 Sending to JARVIS:', command);
            
            // Log to chat
            if (window.logMessage) {
                window.logMessage('USER (Voice)', command);
            }

            // Send via WebSocket
            if (window.ws && window.ws.readyState === WebSocket.OPEN) {
                window.ws.send(command);
                
                // Start thinking
                if (window.startThinking) {
                    window.startThinking();
                }
            } else {
                console.error('[VA] WebSocket not connected');
            }
        }

        // Resume listening after a moment
        setTimeout(() => {
            isListening = false;
            startListening();
        }, 500);
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
        setWakeword: (word) => { CONFIG.wakeword = word.toLowerCase(); },
        setLanguage: (lang) => { CONFIG.language = lang; if (recognizer) recognizer.language = lang; },
        toggleDebug: () => { console.log('[VA] Debug mode'); },
        isListening: () => isListening,
        getConfig: () => ({ ...CONFIG })
    };

    // Auto-init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('[VA] DOMContentLoaded - initializing');
            setTimeout(() => {
                initializeVoiceActivation();
                
                // Try to start listening after a delay
                setTimeout(() => {
                    requestMicrophoneAndStart();
                }, 500);
            }, 100);
        });
    } else {
        console.log('[VA] DOM already loaded - initializing');
        setTimeout(() => {
            initializeVoiceActivation();
            setTimeout(() => {
                requestMicrophoneAndStart();
            }, 500);
        }, 100);
    }
})();

