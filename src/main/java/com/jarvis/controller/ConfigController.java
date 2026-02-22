package com.jarvis.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jarvis.service.ProviderManager;
import com.jarvis.provider.impl.GeminiLlmProvider;
import com.jarvis.provider.LlmProvider;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

    private final ProviderManager providerManager;

    public ConfigController(ProviderManager providerManager) {
        this.providerManager = providerManager;
    }

    @GetMapping
    public Map<String, String> getConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("stt", providerManager.getActiveStt());
        config.put("tts", providerManager.getActiveTts());
        config.put("llm", providerManager.getActiveLlm());
        config.put("model", providerManager.getActiveLlmProvider().getActiveModel());
        config.put("status", "System Online");
        return config;
    }

    @PostMapping
    public Map<String, String> updateConfig(@RequestBody Map<String, String> updates) {
        if (updates.containsKey("llm")) {
            providerManager.setActiveLlm(updates.get("llm"));
        }
        if (updates.containsKey("stt")) {
            providerManager.setActiveStt(updates.get("stt"));
        }
        if (updates.containsKey("tts")) {
            providerManager.setActiveTts(updates.get("tts"));
        }

        if (updates.containsKey("model")) {
            providerManager.getActiveLlmProvider().setModel(updates.get("model"));
        }

        // Dynamically update API Keys if provided (e.g., for Gemini)
        if (updates.containsKey("geminiKey")) {
            LlmProvider gemini = providerManager.getLlmProvider("gemini");
            if (gemini instanceof GeminiLlmProvider) {
                ((GeminiLlmProvider) gemini).setApiKey(updates.get("geminiKey"));
            }
        }

        return getConfig();
    }

    @GetMapping("/test")
    public Map<String, String> testLlmProvider() {
        String response = providerManager.getActiveLlmProvider().generateResponse("Reply with just 'OK'");
        Map<String, String> result = new HashMap<>();
        result.put("message", response);
        result.put("success", String.valueOf(!response.toLowerCase().contains("error")));
        return result;
    }

    @GetMapping("/models")
    public Map<String, Object> getAvailableModels(
            @org.springframework.web.bind.annotation.RequestParam(required = false) String provider) {
        LlmProvider llm = provider != null ? providerManager.getLlmProvider(provider)
                : providerManager.getActiveLlmProvider();
        if (llm == null)
            llm = providerManager.getActiveLlmProvider();
        Map<String, Object> response = new HashMap<>();
        response.put("activeProvider", llm.getProviderName());
        response.put("activeModel", llm.getActiveModel());
        response.put("availableModels", llm.getAvailableModels());
        return response;
    }
}
