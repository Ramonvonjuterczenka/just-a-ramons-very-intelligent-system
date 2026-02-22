package com.jarvis.provider;

/**
 * Interface for Large Language Model processing.
 */
public interface LlmProvider {
    /**
     * Generates a response based on the input text.
     * 
     * @param prompt The user's input text.
     * @return The AI's response text.
     */
    String generateResponse(String prompt);

    /**
     * @return The name/identifier of this provider.
     */
    String getProviderName();

    /**
     * @return The currently active model name.
     */
    String getActiveModel();

    /**
     * @return A list of available models for this provider.
     */
    java.util.List<String> getAvailableModels();

    /**
     * Sets the active model for this provider.
     * 
     * @param model The name of the model to activate.
     */
    void setModel(String model);
}
