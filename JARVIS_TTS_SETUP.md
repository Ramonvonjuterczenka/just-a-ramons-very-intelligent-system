# JARVIS Text-to-Speech (TTS) Setup Guide

## Überblick

Die JARVIS-Anwendung unterstützt jetzt mehrere hochwertige Text-to-Speech-Provider für eine authentischere JARVIS-ähnliche Stimme.

## Verfügbare TTS-Provider

### 1. **BROWSER** (Web Speech API) - Standard
- **Qualität**: Mittelmäßig, systemabhängig
- **Setup**: Keine zusätzliche Installation
- **Vorteile**: Funktioniert sofort, plattformunabhängig
- **Nachteile**: Eingeschränkte Stimmenqualität und -auswahl
- **Beste Verwendung**: Schnelle Tests, Fallback-Option

### 2. **COQUI** ⭐ EMPFOHLEN für JARVIS-Sound
- **Qualität**: Sehr hoch, professionell (ähnlich JARVIS)
- **Setup**: Python + pip Installation
- **Vorteile**: 
  - Vollständig lokal und offline
  - Hochwertige, natürliche Stimmen
  - Kostenlos und Open Source
  - Können GPU nutzen für schnellere Synthese
- **Nachteile**: Benötigt mehr Ressourcen (RAM, Disk Space), erste Synthese dauert länger

### 3. **GOOGLE CLOUD** - Professional Quality
- **Qualität**: Ausgezeichnet, professionell
- **Setup**: Google Cloud Account + API Key
- **Vorteile**: 
  - Neural2 Stimmen klingen sehr natürlich
  - Schnelle Synthese
  - Zuverlässig und stabil
- **Nachteile**: Kostenlos nur mit $300 Trial, danach bezahlpflichtig

### 4. **MOCK** (Text Only)
- **Qualität**: Keine Audio
- **Setup**: Keine Installation
- **Verwendung**: Debugging, Text-only Mode

---

## Installation und Setup

### Option A: COQUI TTS (EMPFOHLEN für lokal)

#### 1. Python und pip installieren
```bash
# Windows
python --version  # Muss Python 3.8+ sein
pip --version
```

#### 2. Coqui TTS installieren
```bash
pip install TTS
# Optional: für GPU-Unterstützung (NVIDIA CUDA)
pip install TTS[gpu]
```

#### 3. Modelle voraus-laden (optional, spart Zeit beim ersten Start)
```bash
# Das Modell wird beim ersten Use heruntergeladen, aber du kannst es voraus-laden:
python -c "from TTS.api import TTS; TTS(model_name='tts_models/en/ljspeech/glow-tts', gpu=False)"
```

#### 4. In application.yml aktivieren
```yaml
jarvis:
  coqui:
    enabled: true
    model: tts_models/en/ljspeech/glow-tts
    speaker: default
  providers:
    tts: coqui  # Setze auf 'coqui' als Standard-Provider
```

#### 5. Docker compose update (falls du Docker nutzt)
```yaml
jarvis-server:
  build: .
  environment:
    - JARVIS_TTS_PROVIDER=coqui
    # ... andere Variablen
```

---

### Option B: Google Cloud TTS

#### 1. Google Cloud Account erstellen
- Gehe zu [Google Cloud Console](https://console.cloud.google.com/)
- Erstelle ein neues Projekt
- Aktiviere die "Text-to-Speech API"

#### 2. Service Account erstellen und API Key generieren
```bash
# Google Cloud CLI installieren und authentifizieren
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

#### 3. In application.yml konfigurieren
```yaml
jarvis:
  google:
    tts:
      enabled: true
      api-key: YOUR_API_KEY_HERE
      voice: en-US-Neural2-C  # oder andere Neural2-Stimmen
  providers:
    tts: google-cloud
```

#### 4. Environment Variable setzen
```bash
export JARVIS_GOOGLE_TTS_ENABLED=true
export JARVIS_GOOGLE_TTS_KEY=your_api_key_here
```

---

## Verwendung in der UI

1. **Öffne Settings** (Klick auf "SETTINGS"-Button)
2. **Wähle TTS-Provider**:
   - Für JARVIS-Sound: **COQUI (High-Quality Open Source)** ⭐
   - Für Professional Sound: **GOOGLE CLOUD (Professional Neural)**
   - Für schnelle Tests: **BROWSER (Speech API)**
3. **Wähle Voice** (bei BROWSER TTS)
4. **Passe Voice Parameter an** (Sprechtempo, Tonhöhe, Lautstärke)
5. **Klicke "TEST VOICE"** um die Einstellung zu testen
6. **Speichere mit "SAVE & REBOOT"**

---

## Konfiguration der Coqui-Stimmen

### Verfügbare Modelle

Die besten Modelle für JARVIS-ähnliche Qualität:

```yaml
# GlowTTS - Schnell, hohe Qualität
tts_models/en/ljspeech/glow-tts

# Glow-TTS mit WaveGlow - Noch bessere Qualität
tts_models/en/ljspeech/glow-tts

# TacotronGST - Ausdrucksstarke Synthese
tts_models/en/ljspeech/tacotron2-DDC

# FastPitch - Balance zwischen Qualität und Geschwindigkeit
tts_models/en/ljspeech/fastpitch
```

### Modell ändern
```yaml
jarvis:
  coqui:
    model: tts_models/en/ljspeech/glow-tts  # ändere hier
```

---

## Performance Tipps

### Für schnellere Synthese:

1. **GPU aktivieren** (falls NVIDIA GPU vorhanden)
   ```bash
   pip install TTS[gpu]
   # In application.yml kann GPU-Support hinzugefügt werden
   ```

2. **Kleinere Modelle nutzen**
   - `glow-tts` ist schneller als `tacotron2`

3. **Synthese Caching** (in Zukunft)
   - Häufig wiederholte Sätze könnten gecacht werden

### Für bessere Qualität:

1. **Höherwertige Modelle wählen**
   - `tacotron2-DDC` statt `glow-tts`

2. **Google Cloud TTS** für professionelle Stimmen verwenden

3. **Output-Format** auf MP3 oder WAV optimieren

---

## Troubleshooting

### Problem: "pyttsx3/coqui command not found"
```bash
# Stelle sicher, dass Python im PATH ist
python --version
pip install TTS
```

### Problem: "JARVIS spricht nicht"
1. Überprüfe in den Settings, welcher TTS-Provider aktiv ist
2. Klicke "TEST VOICE" um zu testen
3. Überprüfe die Browser-Konsole (F12) auf Fehler
4. Versuche einen anderen TTS-Provider

### Problem: "Erste Synthese dauert sehr lange"
- Das ist normal mit Coqui TTS (Modell wird geladen/initialisiert)
- Nachfolgende Synthesen sind schneller
- Voraus-Laden des Modells hilft: `python -c "from TTS.api import TTS; TTS(...)"`

### Problem: Google Cloud API Key funktioniert nicht
1. Überprüfe, dass Text-to-Speech API im Google Cloud Projekt aktiviert ist
2. Überprüfe den API Key (muss gültig sein)
3. Stelle sicher, dass dein Projekt genügend Quota hat

---

## JARVIS-Stimmen Empfehlungen

### Für authentische JARVIS (Iron Man) Stimme:

1. **Mit Coqui TTS:**
   ```yaml
   jarvis:
     coqui:
       enabled: true
       model: tts_models/en/ljspeech/glow-tts
   ```
   - Dann im UI: COQUI + Browser Voice (männliche englische Stimme)

2. **Mit Google Cloud TTS:**
   ```yaml
   jarvis:
     google:
       tts:
         enabled: true
         voice: en-US-Neural2-C  # Männliche Stimme
   ```

3. **Voice Parameter optimieren:**
   - Speech Rate: 0.8 - 0.9 (langsam, präzise wie JARVIS)
   - Pitch: 1.0 - 1.2 (normal bis leicht erhöht)
   - Volume: 0.8 - 1.0 (klar und selbstbewusst)

---

## Docker Deployment

Wenn du Docker nutzt und Coqui TTS verwenden möchtest:

### Dockerfile anpassen:
```dockerfile
FROM openjdk:21-slim

# Python und pip installieren
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && pip install TTS \
    && rm -rf /var/lib/apt/lists/*

# ... Rest des Dockerfiles
```

### docker-compose.yml anpassen:
```yaml
jarvis-server:
  build: .
  environment:
    - JARVIS_TTS_PROVIDER=coqui
    - JARVIS_COQUI_ENABLED=true
```

---

## Lizenz & Attributionen

- **Coqui TTS**: Mozilla Public License 2.0 (Open Source)
- **Google Cloud TTS**: Google Cloud Lizenzbestimmungen
- **Browser Speech API**: Eingebaut in Browser

---

## Weitere Ressourcen

- [Coqui TTS GitHub](https://github.com/coqui-ai/TTS)
- [Google Cloud Text-to-Speech](https://cloud.google.com/text-to-speech)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

