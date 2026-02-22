package com.jarvis.provider;

/**
 * Interface for Text-To-Speech processing.
 */
public interface TtsProvider {
    /**
     * Converts text into an audio byte array.
     * @param text The text to convert.
     * @return The resulting audio data.
     */
    byte[] synthesize(String text);
    
    /**
     * @return The name/identifier of this provider.
     */
    String getProviderName();
}
