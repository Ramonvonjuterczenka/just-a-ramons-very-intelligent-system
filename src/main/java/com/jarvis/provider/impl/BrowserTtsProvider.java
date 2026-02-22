package com.jarvis.provider.impl;

import com.jarvis.provider.TtsProvider;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class BrowserTtsProvider implements TtsProvider {

    @Override
    public byte[] synthesize(String text) {
        // Instead of generating an MP3/WAV, we return a special command string
        // that tells the frontend (app.js) to use the native browser SpeechSynthesis
        // API.
        return ("BROWSER_TTS_PAYLOAD:" + text).getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public String getProviderName() {
        return "browser";
    }
}
