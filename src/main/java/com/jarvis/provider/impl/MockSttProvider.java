package com.jarvis.provider.impl;

import com.jarvis.provider.SttProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "jarvis.providers.stt", havingValue = "mock", matchIfMissing = true)
public class MockSttProvider implements SttProvider {

    @Override
    public String transcribe(byte[] audioData) {
        // Return a mock transcription for testing without a real API
        return "This is a simulated transcription from JARVIS audio input.";
    }

    @Override
    public String getProviderName() {
        return "mock";
    }
}
