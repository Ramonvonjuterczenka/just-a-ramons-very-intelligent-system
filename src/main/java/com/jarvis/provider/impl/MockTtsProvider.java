package com.jarvis.provider.impl;

import com.jarvis.provider.TtsProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
@ConditionalOnProperty(name = "jarvis.providers.tts", havingValue = "mock", matchIfMissing = true)
public class MockTtsProvider implements TtsProvider {

    @Override
    public byte[] synthesize(String text) {
        // Return UTF-8 string bytes as a mock for an actual audio file (e.g., MP3/WAV)
        // Ensure web client knows this is just mock text, not a real audio blob,
        // or we can generate a small dummy WAV byte array if required.
        // For simplicity, returning a simple byte array representing the text.
        return ("MOCK_AUDIO_PAYLOAD:" + text).getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public String getProviderName() {
        return "mock";
    }
}
