package com.jarvis.provider;

/**
 * Interface for Speech-To-Text processing.
 */
public interface SttProvider {
    /**
     * Converts an audio byte array into text.
     * @param audioData The audio data to process.
     * @return The transcription text.
     */
    String transcribe(byte[] audioData);
    
    /**
     * @return The name/identifier of this provider (e.g., "openai", "mock").
     */
    String getProviderName();
}
