package com.jarvis.provider.impl;

import com.jarvis.provider.TtsProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

/**
 * High-quality TTS Provider using Google Cloud Text-to-Speech
 * Produces JARVIS-like voice with professional quality.
 *
 * Configuration needed in application.yml:
 * jarvis:
 *   google:
 *     tts:
 *       api-key: YOUR_GOOGLE_CLOUD_API_KEY
 *       voice: en-US-Neural2-C (male voice)
 */
@Service
public class GoogleCloudTtsProvider implements TtsProvider {

    @Value("${jarvis.google.tts.api-key:}")
    private String apiKey;

    @Value("${jarvis.google.tts.voice:en-US-Neural2-C}")
    private String voice;

    @Value("${jarvis.google.tts.enabled:false}")
    private boolean enabled;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public byte[] synthesize(String text) {
        if (!enabled || apiKey == null || apiKey.isEmpty()) {
            // Fallback to browser TTS if not configured
            return ("BROWSER_TTS_PAYLOAD:" + text).getBytes();
        }

        try {
            String url = "https://texttospeech.googleapis.com/v1/text:synthesize?key=" + apiKey;

            // Build request body for JARVIS-style voice
            Map<String, Object> input = new HashMap<>();
            input.put("text", text);

            Map<String, Object> voice_obj = new HashMap<>();
            voice_obj.put("languageCode", "en-US");
            voice_obj.put("name", voice);  // Neural voice for natural quality

            Map<String, Object> audioConfig = new HashMap<>();
            audioConfig.put("audioEncoding", "MP3");
            audioConfig.put("pitch", 0.0);  // Neutral pitch
            audioConfig.put("speakingRate", 0.85);  // Slower, more articulate (JARVIS style)

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("input", input);
            requestBody.put("voice", voice_obj);
            requestBody.put("audioConfig", audioConfig);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            String response = restTemplate.postForObject(url, request, String.class);

            if (response != null) {
                JsonNode jsonResponse = objectMapper.readTree(response);
                String audioContent = jsonResponse.get("audioContent").asText();
                return Base64.getDecoder().decode(audioContent);
            }

            return ("BROWSER_TTS_PAYLOAD:" + text).getBytes();

        } catch (Exception e) {
            System.err.println("Google Cloud TTS error: " + e.getMessage());
            // Fallback to browser TTS
            return ("BROWSER_TTS_PAYLOAD:" + text).getBytes();
        }
    }

    @Override
    public String getProviderName() {
        return "google-cloud";
    }
}

