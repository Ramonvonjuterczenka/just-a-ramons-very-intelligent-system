package com.jarvis.provider.impl;

import com.jarvis.provider.LlmProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "jarvis.providers.llm", havingValue = "mock", matchIfMissing = true)
public class MockLlmProvider implements LlmProvider {

    @Override
    public String generateResponse(String prompt) {
        // Mock a JARVIS-like response
        return "Hello Sir. I heard: '" + prompt + "'. I am functioning fully but waiting for a real LLM integration.";
    }

    @Override
    public String getProviderName() {
        return "mock";
    }

    private String activeModel = "mock-model-v1";

    @Override
    public String getActiveModel() {
        return activeModel;
    }

    @Override
    public java.util.List<String> getAvailableModels() {
        return java.util.Arrays.asList("mock-model-v1", "mock-model-v2");
    }

    @Override
    public void setModel(String model) {
        this.activeModel = model;
    }
}
