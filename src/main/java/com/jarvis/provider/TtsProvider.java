package com.jarvis.provider;

import java.util.List;
import java.util.Collections;

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

    /**
     * @return List of available voice names/IDs for this provider.
     */
    default List<String> getAvailableVoices() {
        return Collections.emptyList();
    }

    /**
     * Sets the active voice for synthesis.
     * @param voiceName The name/ID of the voice to use.
     */
    default void setVoice(String voiceName) {
        // Optional implementation
    }

    /**
     * @return The currently active voice name/ID.
     */
    default String getActiveVoice() {
        return null;
    }
}
