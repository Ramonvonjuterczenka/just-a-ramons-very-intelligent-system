# 🤖 JARVIS - Voice Activated AI Assistant

> **Ein vollständig sprachgesteuerter AI-Assistent im Iron Man JARVIS Stil**

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.2-green)

---

## ✨ Features

### 🎤 Voice Activation
- ✅ Kontinuierliches Zuhören auf Wakeword "JARVIS"
- ✅ Automatische Sprachbefehl-Erfassung
- ✅ Browser-basierte Speech Recognition (Web Speech API)
- ✅ Konfigurierbare Wakewords (z.B. "AI", "Hey", "Friday")
- ✅ Multi-Language Support (Englisch, Deutsch, Französisch, etc.)

### 🎙️ Hochwertige Sprachausgabe
- ✅ **Coqui TTS** - Open Source, hochwertig, lokal
- ✅ **Google Cloud TTS** - Professional, Cloud-basiert
- ✅ **Browser TTS** - Fallback, sofort verfügbar
- ✅ JARVIS-charakteristische Stimmen-Parameter (langsam, elegant)
- ✅ Voice Parameter Slider (Sprechtempo, Tonhöhe, Lautstärke)

### 🧠 Intelligente Antworten
- ✅ **Ollama** - Lokale LLMs, datenschutzfreundlich
- ✅ **Mistral** - Hochwertiges Default-Modell
- ✅ **Gemini API** - Cloud-basierte Alternative
- ✅ Sarkastisch-eleganter Sprachstil (Tony Stark Mode 😎)

### 🔧 Konfigurierbar
- ✅ Multiple TTS/STT Provider wählbar
- ✅ LLM Model austauschbar
- ✅ Voice Parameters anpassbar
- ✅ Debug Mode für Entwicklung
- ✅ Settings persistieren

### 🐳 Docker Ready
- ✅ Full Docker Compose Setup
- ✅ Ollama + Mistral vorinstalliert
- ✅ Out-of-the-Box Einsatzbereitschaft
- ✅ Persistent Volumes für Models

---

## 🚀 Quick Start (3 Minuten)

### Option A: Lokal (ohne Docker)

**1. Java 21 installieren**
```bash
java -version  # Muss 21+ sein
```

**2. Python Dependencies (für Coqui TTS)**
```bash
pip install TTS
```

**3. JARVIS bauen & starten**
```bash
mvn clean package
java -jar target/jarvis-0.0.1-SNAPSHOT.jar
```

**4. Browser öffnen**
```
http://localhost:8080
```

**5. Sprechen**
```
"JARVIS, guten Morgen!"
```

✅ **Fertig!**

### Option B: Mit Docker (Empfohlen)

**1. Docker installieren**
- Windows/macOS: [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Linux: `sudo apt-get install docker.io docker-compose`

**2. JARVIS starten**
```bash
cd jarvis
docker-compose up --build
```

**3. Browser öffnen**
```
http://localhost:8080
```

✅ **Fertig! Ollama + Mistral werden automatisch installiert.**

---

## 🎤 Verwendung

### Sprachbefehl geben

```
"JARVIS, wie spät ist es?"
"JARVIS, guten Morgen!"
"JARVIS, was ist die Hauptstadt von Frankreich?"
"JARVIS, sag mir einen Witz"
"JARVIS, wie ist das Wetter?"
```

### Settings anpassen

1. Klick auf **SETTINGS** Button
2. Wähle TTS-Provider (Coqui empfohlen ⭐)
3. Passe Voice Parameters an
4. Wähle Wakeword & Sprache
5. Klick **SAVE & REBOOT**

---

## 📁 Projekt-Struktur

```
jarvis/
├── src/main/
│   ├── java/com/jarvis/
│   │   ├── JarvisApplication.java
│   │   ├── controller/
│   │   │   ├── ConfigController.java
│   │   │   └── JarvisWebSocketHandler.java
│   │   ├── provider/
│   │   │   ├── LlmProvider.java
│   │   │   ├── SttProvider.java
│   │   │   ├── TtsProvider.java
│   │   │   └── impl/
│   │   │       ├── OllamaLlmProvider.java
│   │   │       ├── GeminiLlmProvider.java
│   │   │       ├── CoquiTtsProvider.java ⭐ NEW
│   │   │       ├── GoogleCloudTtsProvider.java ⭐ NEW
│   │   │       ├── BrowserSttProvider.java ⭐ NEW
│   │   │       └── ...
│   │   └── service/
│   │       ├── JarvisService.java
│   │       └── ProviderManager.java
│   └── resources/
│       ├── application.yml
│       ├── static/
│       │   ├── index.html
│       │   ├── app.js
│       │   ├── voiceActivation.js ⭐ NEW
│       │   ├── settingsUi.js
│       │   ├── style.css
│       │   └── ...
│       └── ...
├── Dockerfile
├── Dockerfile.ollama
├── docker-compose.yml
├── ollama-init.sh
├── pom.xml
└── README.md (dieses File)
```

---

## 📚 Dokumentation

| Datei | Inhalt |
|-------|--------|
| **VOICE_ACTIVATION_QUICKSTART.md** | 3-Schritte Voice Activation Start |
| **VOICE_ACTIVATION_GUIDE.md** | Detailliertes Voice Activation Manual |
| **VOICE_ACTIVATION_IMPLEMENTATION.md** | Technische Details & API |
| **JARVIS_TTS_SETUP.md** | TTS Provider Setup & Konfiguration |
| **JARVIS_BETTER_VOICE_QUICKSTART.md** | Bessere JARVIS-Stimme |
| **DOCKER_OLLAMA_GUIDE.md** | Docker & Ollama Setup |
| **IMPLEMENTATION_SUMMARY.md** | Vollständige Implementation Summary |

---

## 🔧 Konfiguration

### application.yml

```yaml
jarvis:
  providers:
    stt: browser          # Speech-to-Text
    tts: coqui           # Text-to-Speech
    llm: ollama          # Language Model
    
  ollama:
    url: http://ollama:11434
    model: mistral
    
  coqui:
    enabled: true
    model: tts_models/en/ljspeech/glow-tts
```

### Environment Variables (Docker)

```bash
JARVIS_STT_PROVIDER=browser
JARVIS_TTS_PROVIDER=coqui
JARVIS_LLM_PROVIDER=ollama
JARVIS_OLLAMA_MODEL=mistral
JARVIS_COQUI_ENABLED=true
```

---

## 🤖 Supported LLM Models

| Model | Größe | Qualität | Schnelligkeit | RAM |
|-------|-------|----------|---------------|-----|
| **Mistral** ⭐ | 7B | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 8GB |
| Neural Chat | 7B | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 8GB |
| Llama2 | 7B | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 8GB |
| TinyLlama | 1B | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 4GB |
| Dolphin Mixtral | 26B | ⭐⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 32GB |

---

## 🎙️ TTS Provider Vergleich

| Provider | Qualität | Offline | Setup | Empfohlen |
|----------|----------|---------|-------|-----------|
| **Coqui** ⭐ | ⭐⭐⭐⭐⭐ | ✅ | `pip install TTS` | ✅ |
| Google Cloud | ⭐⭐⭐⭐⭐ | ❌ | API Key | ✅ |
| Browser | ⭐⭐⭐ | ✅ | Keine | Fallback |
| Mock | ❌ | ✅ | Keine | Testing |

---

## 🐛 Troubleshooting

### "Browser STT nicht verfügbar"
- Nutze Chrome/Chromium (beste Unterstützung)
- Überprüfe Mikrofon-Berechtigung
- Siehe: `VOICE_ACTIVATION_GUIDE.md` → Troubleshooting

### "JARVIS-Stimme klingt nicht gut"
- Installiere Coqui TTS: `pip install TTS`
- Settings → TTS Provider: COQUI wählen
- Voice Parameters anpassen
- Siehe: `JARVIS_TTS_SETUP.md`

### "Docker Build fehlgeschlagen"
- Überprüfe Docker-Installation: `docker --version`
- Rebuild: `docker-compose down -v && docker-compose up --build`
- Siehe: `DOCKER_OLLAMA_GUIDE.md` → Troubleshooting

### "Ollama/Mistral zu groß"
- Wechsle zu kleineren Modell: `tinyllama` oder `neural-chat`
- Siehe: `DOCKER_OLLAMA_GUIDE.md` → Model Auswahl

---

## 📊 System-Anforderungen

### Minimum (TinyLlama)
- CPU: 2 Cores
- RAM: 4GB
- Disk: 5GB
- Internet: ~500MB für Model Download

### Empfohlen (Mistral)
- CPU: 4 Cores
- RAM: 8GB
- Disk: 10GB
- Internet: ~4GB für Model Download

### Optimal (Dolphin Mixtral)
- CPU: 8+ Cores
- RAM: 32GB
- Disk: 30GB
- GPU: NVIDIA (optional, für 10x Speedup)

---

## 🎯 Use Cases

### Smart Home Control
```
"JARVIS, schalte das Licht aus"
"JARVIS, stelle Heizung auf 22 Grad"
"JARVIS, spieliere Musik ab"
```

### Information Retrieval
```
"JARVIS, wie ist das Wetter?"
"JARVIS, was sind die Nachrichten?"
"JARVIS, wie spät ist es?"
```

### Hands-Free Assistant
```
"JARVIS, stelle Timer auf 10 Minuten"
"JARVIS, was ist 42 * 17?"
"JARVIS, sag mir einen Witz"
```

---

## 🔐 Sicherheit & Datenschutz

✅ **Lokal & Privat**
- Audio wird im Browser verarbeitet
- Nur erkannter Text wird übertragen
- Keine Cloud-Abhängigkeit (ausser Gemini)
- Daten bleiben bei dir

✅ **Standards-Konform**
- Web Speech API (Browser-Standard)
- HTTPS-ready
- GDPR-konform

---

## 🚀 Deployment

### Lokal Entwicklung
```bash
mvn clean package
java -jar target/jarvis-0.0.1-SNAPSHOT.jar
```

### Docker (Single Machine)
```bash
docker-compose up --build
```

### Docker Swarm (Multi-Node)
```bash
docker swarm init
docker stack deploy -c docker-compose.yml jarvis
```

### Kubernetes (Enterprise)
```bash
# Generiere K8s Manifests aus Docker Compose
kompose convert -f docker-compose.yml -o k8s/
kubectl apply -f k8s/
```

---

## 🤝 Contributing

Contributions sind willkommen! 

```bash
# 1. Fork the repo
# 2. Create feature branch
git checkout -b feature/my-feature

# 3. Commit changes
git commit -am 'Add my feature'

# 4. Push to branch
git push origin feature/my-feature

# 5. Open Pull Request
```

---

## 📄 Lizenz

MIT License - siehe LICENSE file

---

## 💬 Support & Feedback

- 📖 Dokumentation: Siehe `*.md` Files im Root
- 🐛 Issues: GitHub Issues
- 💡 Suggestions: GitHub Discussions

---

## 🙏 Credits

- **Ollama**: https://ollama.ai - Lokale LLM Infrastructure
- **Coqui TTS**: https://github.com/coqui-ai/TTS - Sprachsynthese
- **Spring Boot**: https://spring.io/projects/spring-boot - Backend Framework
- **Web Speech API**: Mozilla/Google - Browser-basierte Spracherkennung

---

## 🎉 Das Ergebnis

```
┌──────────────────────────────────┐
│        JARVIS Web Interface      │
│  "LISTENING FOR: JARVIS" (🟢)    │
└──────────┬───────────────────────┘
           │
           ↓ Voice Input
       ┌─────────────┐
       │   Browser   │ Web Speech API
       │   Speech    │ ↓
       │ Recognition │ voiceActivation.js
       └─────────────┘
           │
           ↓ "wie spät ist es?"
       ┌──────────────────────┐
       │  WebSocket Message   │
       │  JSON → JARVIS API   │
       └──────┬───────────────┘
              │
              ↓
       ┌──────────────────────────────┐
       │    JARVIS Server (Java)      │
       │  ┌────────────────────────┐  │
       │  │   Ollama LLM API       │  │
       │  │  Mistral 7B Model      │  │
       │  │  "Es ist 14:32 Uhr"    │  │
       │  └────────────────────────┘  │
       │  ↓                            │
       │  ┌────────────────────────┐  │
       │  │   Coqui TTS Provider   │  │
       │  │   Audio Synthesis      │  │
       │  │   MP3 Output           │  │
       │  └────────────────────────┘  │
       └──────┬───────────────────────┘
              │
              ↓ Audio Stream
       ┌──────────────────────┐
       │  Browser Speaker     │
       │  🔊 "Es ist 14:32    │
       │     Uhr, Sir!"       │
       └──────────────────────┘
              │
              ↓ (Back to Listening)
       🎤 "LISTENING FOR: JARVIS" (🟢)
```

---

## 📞 Quick Links

| Link | Beschreibung |
|------|-------------|
| http://localhost:8080 | Web Interface |
| http://localhost:11434 | Ollama API |
| VOICE_ACTIVATION_QUICKSTART.md | 3-Schritte Voice Start |
| DOCKER_OLLAMA_GUIDE.md | Docker Setup |
| JARVIS_TTS_SETUP.md | TTS Konfiguration |

---

**🎉 Viel Spaß mit JARVIS - Dein persönlicher AI-Assistant im Iron Man Stil! 🤖**

```
     /\_/\
    ( o.o )
     > ^ <
    /|   |\
   (_|   |_)
   
   JARVIS - Always at your service, Sir.
```

