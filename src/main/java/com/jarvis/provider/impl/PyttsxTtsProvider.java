package com.jarvis.provider.impl;

import com.jarvis.provider.TtsProvider;
import org.springframework.stereotype.Service;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

/**
 * TTS Provider using pyttsx3 (Python offline TTS engine)
 * Provides more natural and JARVIS-like voice quality than browser TTS.
 */
@Service
public class PyttsxTtsProvider implements TtsProvider {

    @Override
    public byte[] synthesize(String text) {
        try {
            // Create temporary output file for audio
            Path tempAudioFile = Files.createTempFile("jarvis-tts-", ".mp3");

            // Python script to use pyttsx3 for TTS
            String pythonScript = String.format(
                "import pyttsx3\n" +
                "engine = pyttsx3.init()\n" +
                "engine.setProperty('rate', 150)\n" +  // Slower speech rate (JARVIS style)
                "engine.setProperty('volume', 0.9)\n" +
                "# Try to use a male voice for JARVIS feel\n" +
                "voices = engine.getProperty('voices')\n" +
                "for voice in voices:\n" +
                "    if 'male' in voice.name.lower():\n" +
                "        engine.setProperty('voice', voice.id)\n" +
                "        break\n" +
                "engine.save_to_file('%s', '%s')\n" +
                "engine.runAndWait()\n",
                text.replace("'", "\\'"),
                tempAudioFile.toAbsolutePath().toString().replace("\\", "\\\\")
            );

            // Write and execute Python script
            Path scriptFile = Files.createTempFile("jarvis-tts-", ".py");
            Files.writeString(scriptFile, pythonScript);

            ProcessBuilder pb = new ProcessBuilder("python", scriptFile.toAbsolutePath().toString());
            pb.redirectErrorStream(true);
            Process process = pb.start();

            boolean completed = process.waitFor(10, TimeUnit.SECONDS);
            if (!completed) {
                process.destroyForcibly();
                throw new IOException("pyttsx3 synthesis timeout");
            }

            int exitCode = process.exitValue();
            if (exitCode != 0) {
                // Fallback: pyttsx3 not available, return special marker
                return ("PYTTSX3_UNAVAILABLE:" + text).getBytes();
            }

            // Read synthesized audio
            byte[] audioData = Files.readAllBytes(tempAudioFile);

            // Cleanup
            Files.delete(tempAudioFile);
            Files.delete(scriptFile);

            return audioData;

        } catch (Exception e) {
            // Fallback to browser TTS if pyttsx3 fails
            System.err.println("pyttsx3 TTS failed: " + e.getMessage());
            return ("BROWSER_TTS_PAYLOAD:" + text).getBytes();
        }
    }

    @Override
    public String getProviderName() {
        return "pyttsx3";
    }
}

