package com.jarvis.provider.impl;

import com.jarvis.provider.LlmProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeminiLlmProvider implements LlmProvider {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String baseUrl;
    private final String systemPrompt;

    // Allow mutable state for dynamic configuration updates
    private String apiKey;
    private String model;

    public GeminiLlmProvider(
            @Value("${jarvis.gemini.url:https://generativelanguage.googleapis.com}") String baseUrl,
            @Value("${jarvis.gemini.key:}") String apiKey,
            @Value("${jarvis.gemini.model:gemini-1.5-flash}") String model,
            @Value("${jarvis.system.prompt:}") String systemPrompt) {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.model = model;
        this.systemPrompt = systemPrompt;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
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
    public List<String> getAvailableModels() {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            // Return default/active model if no key is set yet
            return java.util.Collections.singletonList(model);
        }

        try {
            String url = baseUrl + "/v1beta/models?key=" + apiKey;
            HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                    .GET()
                    .build();

            HttpResponse<String> httpResponse = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (httpResponse.statusCode() < 400) {
                Map response = objectMapper.readValue(httpResponse.body(), Map.class);
                if (response != null && response.containsKey("models")) {
                    List<Map<String, Object>> models = (List<Map<String, Object>>) response.get("models");
                    return models.stream()
                            .map(m -> ((String) m.get("name")).replace("models/", ""))
                            .filter(name -> name.startsWith("gemini"))
                            .collect(java.util.stream.Collectors.toList());
                }
            } else {
                System.err.println("Gemini Models API Error: " + httpResponse.statusCode());
            }
        } catch (Exception e) {
            System.err.println("Could not fetch Gemini models: " + e.getMessage());
        }
        return java.util.Collections.singletonList(model);
    }

    @Override
    public String generateResponse(String prompt) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return "Error: Gemini API Key is missing. Please configure it in the Settings.";
        }

        System.out.println("Processing prompt with Google Gemini (" + model + ")...");
        try {
            // Build the Gemini API Request Body
            Map<String, Object> requestBody = new java.util.HashMap<>();
            requestBody.put("contents", List.of(
                    Map.of("parts", List.of(
                            Map.of("text", prompt)))));

            if (systemPrompt != null && !systemPrompt.trim().isEmpty()) {
                // Correct JSON field name for Gemini API is 'systemInstruction' (camelCase)
                requestBody.put("systemInstruction", Map.of(
                        "parts", List.of(
                                Map.of("text", systemPrompt))));
            }

            String url = baseUrl + "/v1beta/models/" + model + ":generateContent?key=" + apiKey;

            String jsonBody = objectMapper.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .header("Content-Type", "application/json")
                    .build();

            HttpResponse<String> httpResponse = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (httpResponse.statusCode() >= 400) {
                return "Error communicating with Google Gemini: " + httpResponse.statusCode() + " "
                        + httpResponse.body();
            }

            Map response = objectMapper.readValue(httpResponse.body(), Map.class);

            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);
                    if (candidate.containsKey("content")) {
                        Map<String, Object> content = (Map<String, Object>) candidate.get("content");
                        if (content.containsKey("parts")) {
                            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                            if (!parts.isEmpty() && parts.get(0).containsKey("text")) {
                                return (String) parts.get(0).get("text");
                            }
                        }
                    }
                }
            }
            return "Error: Unexpected response format from Google Gemini: " + httpResponse.body();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error communicating with Google Gemini: " + e.getMessage();
        }
    }

    @Override
    public String getProviderName() {
        return "gemini";
    }
}
