package com.jarvis.service;

import com.jarvis.provider.LlmProvider;
import com.jarvis.provider.SttProvider;
import com.jarvis.provider.TtsProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ProviderManager {

    private final Map<String, LlmProvider> llmProviders;
    private final Map<String, SttProvider> sttProviders;
    private final Map<String, TtsProvider> ttsProviders;

    private String activeLlm;
    private String activeStt;
    private String activeTts;

    public ProviderManager(
            List<LlmProvider> llms,
            List<SttProvider> stts,
            List<TtsProvider> ttss,
            @Value("${jarvis.providers.llm:mock}") String defaultLlm,
            @Value("${jarvis.providers.stt:mock}") String defaultStt,
            @Value("${jarvis.providers.tts:mock}") String defaultTts) {

        // Map providers by their name
        this.llmProviders = llms.stream().collect(Collectors.toMap(LlmProvider::getProviderName, Function.identity()));
        this.sttProviders = stts.stream().collect(Collectors.toMap(SttProvider::getProviderName, Function.identity()));
        this.ttsProviders = ttss.stream().collect(Collectors.toMap(TtsProvider::getProviderName, Function.identity()));

        this.activeLlm = defaultLlm;
        this.activeStt = defaultStt;
        this.activeTts = defaultTts;
    }

    public LlmProvider getActiveLlmProvider() {
        return llmProviders.getOrDefault(activeLlm, llmProviders.get("mock"));
    }

    public SttProvider getActiveSttProvider() {
        return sttProviders.getOrDefault(activeStt, sttProviders.get("mock"));
    }

    public TtsProvider getActiveTtsProvider() {
        return ttsProviders.getOrDefault(activeTts, ttsProviders.get("mock"));
    }

    public void setActiveLlm(String llmName) {
        if (llmProviders.containsKey(llmName)) {
            this.activeLlm = llmName;
        }
    }

    public void setActiveStt(String sttName) {
        if (sttProviders.containsKey(sttName)) {
            this.activeStt = sttName;
        }
    }

    public void setActiveTts(String ttsName) {
        if (ttsProviders.containsKey(ttsName)) {
            this.activeTts = ttsName;
        }
    }

    public String getActiveLlm() {
        return activeLlm;
    }

    public String getActiveStt() {
        return activeStt;
    }

    public String getActiveTts() {
        return activeTts;
    }

    public LlmProvider getLlmProvider(String name) {
        return llmProviders.get(name);
    }

    public TtsProvider getTtsProvider(String name) {
        return ttsProviders.get(name);
    }
}
