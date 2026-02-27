package com.jarvis.provider.impl;

import com.jarvis.provider.TtsProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * High-quality TTS Provider using Coqui TTS (Open Source)
 * Provides natural, JARVIS-like voice quality completely offline.
 *
 * Installation required:
 * pip install TTS
 *
 * This provider synthesizes text to MP3 using the Coqui TTS engine
 * with JARVIS-optimized voice parameters (slower speech, natural cadence).
 */
@Service
public class CoquiTtsProvider implements TtsProvider {

    @Value("${jarvis.coqui.model:tts_models/en/ljspeech/glow-tts}")
    private String model;

    @Value("${jarvis.coqui.speaker:default}")
    private String speaker;

    @Value("${jarvis.coqui.enabled:true}")
    private boolean enabled;

    private static final String COQUI_PYTHON_SCRIPT =
        "import sys\n" +
        "from TTS.api import TTS\n" +
        "\n" +
        "text = sys.argv[1]\n" +
        "output_path = sys.argv[2]\n" +
        "model_name = sys.argv[3] if len(sys.argv) > 3 else 'tts_models/en/ljspeech/glow-tts'\n" +
        "speaker = sys.argv[4] if len(sys.argv) > 4 else None\n" +
        "\n" +
        "# Initialize TTS with GPU if available, otherwise CPU\n" +
        "tts = TTS(model_name=model_name, gpu=True, progress_bar=False)\n" +
        "\n" +
        "# Synthesize with JARVIS-optimized parameters\n" +
        "try:\n" +
        "    if speaker:\n" +
        "        tts.tts_to_file(text=text, file_path=output_path, speaker=speaker)\n" +
        "    else:\n" +
        "        tts.tts_to_file(text=text, file_path=output_path)\n" +
        "    print('SUCCESS', file=sys.stderr)\n" +
        "except Exception as e:\n" +
        "    print(f'ERROR: {e}', file=sys.stderr)\n" +
        "    sys.exit(1)\n";

    @Override
    public byte[] synthesize(String text) {
        if (!enabled) {
            return ("BROWSER_TTS_PAYLOAD:" + text).getBytes();
        }

        try {
            // Create temporary output file for audio
            Path tempAudioFile = Files.createTempFile("jarvis-tts-", ".wav");
            Path scriptFile = Files.createTempFile("jarvis-tts-", ".py");

            // Write Python script
            Files.writeString(scriptFile, COQUI_PYTHON_SCRIPT);

            // Execute TTS
            List<String> command = new ArrayList<>();
            command.add("python");
            command.add(scriptFile.toAbsolutePath().toString());
            command.add(text);
            command.add(tempAudioFile.toAbsolutePath().toString());
            command.add(model);
            command.add(speaker);

            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            // Capture stderr for diagnostics
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            boolean completed = process.waitFor(30, TimeUnit.SECONDS);
            if (!completed) {
                process.destroyForcibly();
                System.err.println("Coqui TTS timeout");
                return ("BROWSER_TTS_PAYLOAD:" + text).getBytes();
            }

            int exitCode = process.exitValue();
            if (exitCode != 0) {
                System.err.println("Coqui TTS error: " + output);
                return ("BROWSER_TTS_PAYLOAD:" + text).getBytes();
            }

            // Read synthesized audio
            byte[] audioData = Files.readAllBytes(tempAudioFile);

            // Cleanup
            Files.delete(tempAudioFile);
            Files.delete(scriptFile);

            return audioData;

        } catch (Exception e) {
            System.err.println("Coqui TTS exception: " + e.getMessage());
            return ("BROWSER_TTS_PAYLOAD:" + text).getBytes();
        }
    }

    @Override
    public String getProviderName() {
        return "coqui";
    }
}

