package com.jarvis.provider.impl;

import com.jarvis.provider.LlmProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@ConditionalOnProperty(name = "jarvis.providers.llm", havingValue = "ollama")
public class OllamaLlmProvider implements LlmProvider {

    private final WebClient webClient;
    private String model;
    private final String systemPrompt;

    public OllamaLlmProvider(
            WebClient.Builder webClientBuilder,
            @Value("${jarvis.ollama.url:http://localhost:11434}") String ollamaUrl,
            @Value("${jarvis.ollama.model:llama3.1}") String model,
            @Value("${jarvis.system.prompt:}") String systemPrompt) {
        this.webClient = webClientBuilder.clone().baseUrl(ollamaUrl).build();
        this.model = model;
        this.systemPrompt = systemPrompt;
    }

    @Override
    public String generateResponse(String prompt) {
        System.out.println("Processing prompt with Ollama (" + model + ")...");
        try {
            Map<String, Object> requestBody = new java.util.HashMap<>(Map.of(
                    "model", model,
                    "prompt", prompt,
                    "stream", false));

            if (systemPrompt != null && !systemPrompt.trim().isEmpty()) {
                requestBody.put("system", systemPrompt);
            }

            Map response = webClient.post()
                    .uri("/api/generate")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && response.containsKey("response")) {
                return (String) response.get("response");
            }
            return "Error: Unexpected response format from Ollama.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error communicating with Ollama: " + e.getMessage();
        }
    }

    @Override
    public String getProviderName() {
        return "ollama";
    }

    @Override
    public String getActiveModel() {
        return model;
    }

    @Override
    public void setModel(String model) {
        this.model = model;
    }

    @Override
    public java.util.List<String> getAvailableModels() {
        try {
            Map response = webClient.get()
                    .uri("/api/tags")
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && response.containsKey("models")) {
                java.util.List<Map<String, Object>> models = (java.util.List<Map<String, Object>>) response
                        .get("models");
                return models.stream()
                        .map(m -> (String) m.get("name"))
                        .collect(java.util.stream.Collectors.toList());
            }
        } catch (Exception e) {
            System.err.println("Could not fetch Ollama models via /api/tags: " + e.getMessage());
        }

        // Fallback: try /api/models which some Ollama versions expose
        try {
            Map response2 = webClient.get()
                    .uri("/api/models")
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response2 != null && response2.containsKey("models")) {
                java.util.List<Map<String, Object>> models = (java.util.List<Map<String, Object>>) response2
                        .get("models");
                return models.stream()
                        .map(m -> (String) m.getOrDefault("name", m.get("id")))
                        .collect(java.util.stream.Collectors.toList());
            }
        } catch (Exception e) {
            System.err.println("Could not fetch Ollama models via /api/models: " + e.getMessage());
        }

        // Last resort: return configured model as single option
        return java.util.Collections.singletonList(model);
    }
}
