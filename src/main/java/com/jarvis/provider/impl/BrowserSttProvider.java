package com.jarvis.provider.impl;

import com.jarvis.provider.SttProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

/**
 * Browser-based Speech-to-Text using Web Speech API (JavaScript)
 *
 * This provider works on the frontend using the native browser
 * Web Speech API. The actual transcription happens in app.js
 * and is sent to the backend via WebSocket.
 *
 * This service is mainly for documentation purposes and validation.
 */
@Service
@ConditionalOnProperty(name = "jarvis.providers.stt", havingValue = "browser", matchIfMissing = false)
public class BrowserSttProvider implements SttProvider {

    @Override
    public String transcribe(byte[] audioData) {
        // The actual transcription happens on the browser side
        // This method should not be called for browser-based STT
        // Audio is processed by browser's Web Speech API and sent as text via WebSocket
        return "Browser STT: Transcription happens on client-side";
    }

    @Override
    public String getProviderName() {
        return "browser";
    }
}

