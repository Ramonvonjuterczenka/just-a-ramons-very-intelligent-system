package com.jarvis.service;

import org.springframework.stereotype.Service;

@Service
public class JarvisService {

    private final ProviderManager providerManager;

    public JarvisService(ProviderManager providerManager) {
        this.providerManager = providerManager;
    }

    public String transcribeAudio(byte[] audioData) {
        String textInput = providerManager.getActiveSttProvider().transcribe(audioData);
        System.out.println("User Said: " + textInput);
        return textInput;
    }

    /**
     * Synthesize string to audio bytes
     */
    public byte[] synthesizeText(String text) {
        return providerManager.getActiveTtsProvider().synthesize(text);
    }

    /**
     * Processes text data and returns text response.
     * Flow: Text -> LLM -> Text
     */
    public String processText(String textInput) {
        System.out.println("User Typed: " + textInput);
        String aiResponse = providerManager.getActiveLlmProvider().generateResponse(textInput);
        System.out.println("JARVIS Replied: " + aiResponse);
        return aiResponse;
    }

}
