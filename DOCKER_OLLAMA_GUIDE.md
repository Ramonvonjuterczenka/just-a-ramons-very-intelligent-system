# 🐳 JARVIS Docker + Ollama Setup Guide

## 📋 Überblick

JARVIS kann jetzt **vollständig mit Docker** deployed werden und funktioniert **out-of-the-box** mit:

✅ **Ollama** - Lokales LLM (Sprachmodell)  
✅ **Mistral** - Hochwertiges Default-Modell  
✅ **Coqui TTS** - Hochwertige Sprachausgabe  
✅ **Browser STT** - Spracherkennung im Browser  
✅ **Voice Activation** - Kontinuierliches Zuhören  

---

## 🚀 Quickstart mit Docker

### 1. Docker & Docker Compose installieren

**Windows:**
```bash
# Installiere Docker Desktop
https://www.docker.com/products/docker-desktop
```

**Linux:**
```bash
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER
```

**macOS:**
```bash
brew install docker docker-compose
# oder Docker Desktop installieren
```

### 2. Projekt klonen/öffnen
```bash
cd C:\GIT\jarvis  # oder dein Projekt-Pfad
```

### 3. Docker Container starten
```bash
docker-compose up --build
```

Das ist alles! 🎉

### 4. Browser öffnen
```
http://localhost:8080
```

### 5. Mikrofon erlauben & sprechen
```
"JARVIS, guten Morgen!"
```

✅ **JARVIS antwortet mit Coqui TTS in hoher Qualität!**

---

## 📊 Was wird installiert

### Service: Ollama
```
Docker Image: ollama/ollama:latest
Port: 11434 (intern) → nicht sichtbar
Volume: jarvis_ollama_data (persistent)
Model: Mistral (7B, ~4GB)
```

### Service: JARVIS Server
```
Docker Image: Gebaut aus Dockerfile (Java + Spring Boot)
Port: 8080 → http://localhost:8080
Environment:
  - STT: browser (Web Speech API)
  - TTS: coqui (hochwertige Synthese)
  - LLM: ollama (Mistral 7B)
```

---

## 🤖 Ollama Models Auswahl

### ⭐ Standard: Mistral (EMPFOHLEN)
```
Größe: ~4GB
Qualität: ⭐⭐⭐⭐⭐
Geschwindigkeit: ⭐⭐⭐⭐
RAM: 8GB empfohlen
Anwendung: Allgemein, sehr gut
```

**Mistral ist perfekt für JARVIS!**

### Alternativen (optional zum Austauschen)

#### Neural Chat
```
Größe: ~4GB
Qualität: ⭐⭐⭐⭐⭐
Geschwindigkeit: ⭐⭐⭐⭐
Spezialisierung: Conversation/Chat
```

#### Dolphin Mixtral
```
Größe: ~26GB
Qualität: ⭐⭐⭐⭐⭐⭐
Geschwindigkeit: ⭐⭐⭐
RAM: 32GB empfohlen
Spezialisierung: Hochwertig, vielseitig
```

#### TinyLlama
```
Größe: ~600MB
Qualität: ⭐⭐⭐
Geschwindigkeit: ⭐⭐⭐⭐⭐
RAM: 4GB
Spezialisierung: Schnell & leicht
```

#### Llama2
```
Größe: ~4GB
Qualität: ⭐⭐⭐⭐
Geschwindigkeit: ⭐⭐⭐⭐
RAM: 8GB
Spezialisierung: Allgemein, zuverlässig
```

---

## 🔧 Ollama Model wechseln

### Option 1: Vor dem Start (einfachste)
Bearbeite `docker-compose.yml`:

```yaml
ollama:
  environment:
    - OLLAMA_DEFAULT_MODEL=mistral  # ← Hier ändern
```

Beispiele:
```yaml
- OLLAMA_DEFAULT_MODEL=neural-chat
- OLLAMA_DEFAULT_MODEL=dolphin-mixtral
- OLLAMA_DEFAULT_MODEL=tinyllama
- OLLAMA_DEFAULT_MODEL=llama2
```

Starte dann:
```bash
docker-compose up --build
```

### Option 2: Nach dem Start (while running)
```bash
# Container-ID oder -Name anzeigen
docker ps | grep ollama

# In den Container gehen
docker exec -it jarvis-ollama bash

# Neues Modell pullen
ollama pull neural-chat

# Settings ändern
docker-compose.yml anpassen
docker-compose restart jarvis-server
```

### Option 3: Dynamisch via API
```bash
# Checke welche Modelle verfügbar sind
curl http://localhost:11434/api/tags

# Pullt neues Modell
curl -X POST http://localhost:11434/api/pull \
  -d '{"name": "neural-chat"}'
```

---

## 💾 Persistent Storage

Ollama-Daten werden in einem Docker Volume gespeichert:

```bash
# Volume anzeigen
docker volume ls | grep jarvis

# Volume inspizieren
docker volume inspect jarvis_ollama_data

# Modelle sehen
docker exec jarvis-ollama ollama list
```

**Die heruntergeladenen Modelle bleiben zwischen Reboots erhalten!**

---

## 🔍 Logs & Debugging

### Logs anzeigen
```bash
# Alle Services
docker-compose logs

# Nur Ollama
docker-compose logs ollama

# Nur JARVIS
docker-compose logs jarvis-server

# Live-Logs (follow)
docker-compose logs -f jarvis-server
```

### Container-Shell
```bash
# JARVIS Container
docker exec -it jarvis-server bash

# Ollama Container
docker exec -it jarvis-ollama bash
```

### Modelle prüfen
```bash
docker exec jarvis-ollama ollama list
```

---

## 🛑 Stoppen & Neustarten

### Alle Container stoppen
```bash
docker-compose down
```

### Alle Container stoppen & Volumes löschen
```bash
docker-compose down -v
```

### Neustart
```bash
docker-compose restart
```

### Rebuild (bei Code-Änderungen)
```bash
docker-compose up --build
```

---

## 🐛 Troubleshooting

### Problem: "ollama: connection refused"
**Ursache:** Ollama nicht verfügbar  
**Lösung:**
```bash
docker ps  # Ist ollama am Laufen?
docker logs jarvis-ollama  # Logs prüfen
docker-compose up ollama  # Ollama einzeln starten
```

### Problem: "No space left on device"
**Ursache:** Docker hat nicht genug Platz  
**Lösung:**
```bash
# Alte Images löschen
docker image prune -a

# Alte Volumes löschen
docker volume prune

# Oder: Mehr Disk Space freigeben
```

### Problem: "Port 8080 already in use"
**Ursache:** Port 8080 wird bereits genutzt  
**Lösung:**
```yaml
# docker-compose.yml anpassen
jarvis-server:
  ports:
    - "8081:8080"  # Neuer Port 8081
```

### Problem: "Mistral model zu groß" (OOM)
**Ursache:** Nicht genug RAM (Mistral braucht ~8GB)  
**Lösung:**
```yaml
ollama:
  environment:
    - OLLAMA_DEFAULT_MODEL=tinyllama  # Kleineres Modell
```

### Problem: "Docker Build fehlgeschlagen"
**Lösung:**
```bash
# Dockerfile überprüfen
cat Dockerfile

# Einzelne Layer debuggen
docker build --no-cache -t jarvis-test .

# Oder kompletter Rebuild
docker-compose down -v
docker-compose up --build
```

---

## 📈 Performance Optimierung

### 1. GPU-Unterstützung aktivieren

**NVIDIA GPU (falls vorhanden):**
```yaml
ollama:
  runtime: nvidia
  # oder
  deploy:
    resources:
      reservations:
        devices:
          - driver: nvidia
            count: 1
            capabilities: [gpu]
```

Installiere zuerst:
```bash
# NVIDIA Docker Runtime
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | \
  sudo tee /etc/apt/sources.list.d/nvidia-docker.list
sudo apt-get update && sudo apt-get install -y nvidia-docker2
sudo systemctl restart docker
```

### 2. Memory Limits

```yaml
jarvis-server:
  deploy:
    resources:
      limits:
        memory: 1G
      reservations:
        memory: 512M

ollama:
  deploy:
    resources:
      limits:
        memory: 8G
      reservations:
        memory: 6G
```

### 3. CPU Limits

```yaml
ollama:
  deploy:
    resources:
      limits:
        cpus: '4'
```

---

## 🌐 Multi-Node Deployment

Falls du auf mehreren Maschinen deployen möchtest:

```bash
# Docker Swarm initialisieren
docker swarm init

# Andere Maschinen joinen
docker swarm join --token <token> <ip>:2377

# Deploy als Stack
docker stack deploy -c docker-compose.yml jarvis
```

---

## 📊 Ressourcen-Anforderungen

| Service | CPU | RAM | Disk |
|---------|-----|-----|------|
| Ollama (Mistral) | 2+ | 8GB | 10GB |
| JARVIS Server | 1 | 1GB | 100MB |
| **Gesamt** | **3+** | **9GB** | **10GB** |

---

## ✅ Checkliste für Production

- [ ] `docker-compose.yml` für Umgebung konfiguriert
- [ ] `ollama-init.sh` Shell-Script hat Execute-Permissions
- [ ] `Dockerfile` funktioniert (test mit `docker build`)
- [ ] `Dockerfile.ollama` funktioniert
- [ ] Logs konfiguriert (nicht zu verbose)
- [ ] Memory Limits gesetzt
- [ ] Restart-Policy: `unless-stopped`
- [ ] Volumes persistent & gesichert
- [ ] Ports korrekt mapped
- [ ] Environment-Variables sicher gespeichert
- [ ] Backups von Docker Volumes

---

## 🚀 Beispiel: Komplett aus Scratch

```bash
# 1. Repo klonen
git clone https://github.com/yourusername/jarvis.git
cd jarvis

# 2. Docker Compose starten
docker-compose up --build

# Warte bis beide Services online sind:
# ✓ jarvis-ollama: "Listening on 0.0.0.0:11434"
# ✓ jarvis-server: "Tomcat started on port 8080"

# 3. Browser öffnen
open http://localhost:8080

# 4. Mikrofon erlauben & testen
# "JARVIS, wie heißt du?"

# 5. Fertig! 🎉
```

---

## 🔄 Continuous Deployment (CI/CD)

### GitHub Actions Example:

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: docker/setup-buildx-action@v1
      - uses: docker/build-push-action@v2
        with:
          context: .
          push: true
          tags: yourusername/jarvis:latest
```

---

## 📞 Support

### Schnelle Hilfe:
```bash
docker-compose logs -f  # Live Logs
docker ps              # Running Containers
docker images          # Verfügbare Images
```

### Detailliert:
Siehe `VOICE_ACTIVATION_GUIDE.md` und `JARVIS_TTS_SETUP.md`

---

## 🎉 Ergebnis

**JARVIS läuft jetzt vollständig in Docker!**

```
┌─────────────┐
│   Browser   │ ← http://localhost:8080
└──────┬──────┘
       │ WebSocket
       ↓
┌──────────────────────┐
│   JARVIS Server      │
│  (Java/Spring Boot)  │
└──────────┬───────────┘
           │ REST/gRPC
           ↓
┌──────────────────────┐
│    Ollama + Mistral  │ ← port 11434
│     (LLM Backend)    │
└──────────────────────┘
```

---

**Viel Erfolg mit deinem JARVIS Docker Deployment! 🐳🤖**

