package com.jarvis.controller;

import com.jarvis.service.JarvisService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

@Component
public class JarvisWebSocketHandler extends AbstractWebSocketHandler {

    private final JarvisService jarvisService;

    public JarvisWebSocketHandler(JarvisService jarvisService) {
        this.jarvisService = jarvisService;
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();

        // Text chat path
        String response = jarvisService.processText(payload);
        session.sendMessage(new TextMessage("TEXT:" + response));

        // Also send audio payload so browser can speak it
        byte[] audioData = jarvisService.synthesizeText(response);
        session.sendMessage(new BinaryMessage(audioData));
    }

    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) throws Exception {
        byte[] audioData = message.getPayload().array();

        // 1. Audio in -> STT Text
        String userInput = jarvisService.transcribeAudio(audioData);

        // 2. LLM Text
        String response = jarvisService.processText(userInput);

        // 3. Send generated text back to browser UI
        session.sendMessage(new TextMessage("TEXT:" + response));

        // 4. Send TTS Audio back to browser UI
        byte[] responseAudio = jarvisService.synthesizeText(response);
        session.sendMessage(new BinaryMessage(responseAudio));
    }
}
