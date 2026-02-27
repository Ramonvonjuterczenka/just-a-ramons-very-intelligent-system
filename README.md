# J.A.R.V.I.S. Voice Assistant

A modular, platform-independent Voice Assistant built with Java (Spring Boot) and Docker. It features a standalone browser-based web client with a glowing, JARVIS-inspired UI.

## Features
- **Platform Independent:** Runs entirely in a Docker container (Windows/Linux/Mac).
- **Web-Client GUI:** A JARVIS-style dark mode interface with interactive "Arc Reactor" animations.
- **WebSocket Streaming:** Real-time bidirectional audio/text communication.
- **Modular Archictecture:** Clear `SttProvider`, `TtsProvider`, and `LlmProvider` interfaces.
- **Configuration Engine:** Easily swap AI providers via environment variables or `application.yml`.

## Architecture Overview
1. **Frontend**: HTML/CSS/JS web client connecting via WebSockets (`/jarvis-ws`).
2. **Backend Engine**: `JarvisService` receives audio/text, passes to STT, then LLM, then returns TTS audio.
3. **Providers**: Interfaces encapsulating external API connections (currently using `MockProviders` for rapid testing).

## Quick Start (Docker)
1. Make sure you have [Docker](https://www.docker.com/) installed and running.
2. Open a terminal in this project directory.
3. Run:
   ```bash
   docker-compose up --build
   ```
   This will start two containers:
   - `jarvis-server` (the application, port 8080)
   - `jarvis-ollama` (Ollama LLM server, port 11434)

4. **First Run:** The Ollama container will automatically download and set up the `tinyllama` model (~638 MB). This happens on startup and may take a few minutes depending on your internet speed.

5. Open your browser and navigate to: `http://localhost:8080`

6. The app is now **fully configured** and ready to use. Click the Arc Reactor (Microphone) button to start speaking or use the text console below it.

## Configuration
- Default LLM provider: **Ollama** (with `tinyllama` model)
- Default STT provider: **Mock** (text input only)
- Default TTS provider: **Mock** (text-only responses)

To use a different Ollama model, either:
- Change `JARVIS_OLLAMA_MODEL` in `docker-compose.yml` (before starting)
- Use the Settings modal in the UI to switch models (if the model is available in Ollama)

To use a different LLM provider (e.g., Gemini, OpenAI), set the environment variables in `docker-compose.yml` and restart the containers.

## Extending the Providers
To integrate OpenAI or another AI:
1. Create a new class implementing `LlmProvider` (e.g., `OpenAiLlmProvider`).
2. Give it a specific condition in Spring (e.g., `@ConditionalOnProperty(name="jarvis.providers.llm", havingValue="openai")`).
3. Add the required dependencies to `pom.xml`.
4. Update `docker-compose.yml` environment variables to `JARVIS_LLM_PROVIDER=openai` and provide any necessary keys e.g., `JARVIS_OPENAI_KEY`.
