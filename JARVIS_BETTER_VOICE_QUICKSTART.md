# JARVIS - Hochwertige TTS Integration

## 🎯 Schnellstart für bessere JARVIS-Stimme

Die JARVIS-Anwendung wurde mit **professionellen Text-to-Speech-Providern** erweitert, um eine authentischere JARVIS-ähnliche Stimme (wie in Iron Man) zu erreichen.

## ⭐ Die beste Lösung: Coqui TTS

### Installation (5 Minuten):

1. **Python + TTS installieren** (Windows/Mac/Linux):
```bash
pip install TTS
```

2. **JARVIS starten** (mit Coqui TTS):
```bash
# application.yml konfigurieren oder Environment Variable setzen:
export JARVIS_TTS_PROVIDER=coqui
# oder in docker-compose.yml:
# environment:
#   - JARVIS_TTS_PROVIDER=coqui
```

3. **UI öffnen** → Settings → TTS-Provider: **COQUI (High-Quality Open Source)** → Save

### Warum Coqui TTS die beste Wahl ist:

✅ **Hochwertige Stimme** - Klingt deutlich besser als Browser TTS  
✅ **Vollständig offline** - Keine API Keys nötig  
✅ **Kostenlos & Open Source** - Mozilla Public License  
✅ **Schnell** - Nach dem ersten Start sehr schnell  
✅ **Lokal** - Funktioniert mit deinem Ollama Setup  

### Ergebnis:
🎙️ JARVIS klingt jetzt viel authentischer und präziser - näher an der Iron Man Stimme!

---

## Alternative: Google Cloud TTS (Professional)

Wenn du eine noch professionellere Stimme möchtest:

1. Google Cloud Account erstellen
2. Text-to-Speech API aktivieren
3. API Key generieren
4. In Settings: **GOOGLE CLOUD (Professional Neural)** wählen

**Kosten:** Kostenlos mit $300 Trial, dann ~$16 pro Million Zeichen

---

## Verfügbare Provider

| Provider | Qualität | Offline | Setup | Empfohlen |
|----------|----------|---------|-------|-----------|
| **COQUI** | ⭐⭐⭐⭐⭐ | ✅ | `pip install TTS` | ⭐⭐⭐ |
| **GOOGLE CLOUD** | ⭐⭐⭐⭐⭐ | ❌ | API Key | ⭐⭐ |
| **BROWSER** | ⭐⭐⭐ | ✅ | Keine | ⭐ |
| **MOCK** | ❌ | ✅ | Keine | - |

---

## Tipps für beste JARVIS-Stimme

1. **TTS-Provider wählen**: COQUI oder GOOGLE CLOUD
2. **Voice Parameter anpassen**:
   - Speech Rate: `0.85` (langsam & präzise)
   - Pitch: `1.1` (elegant & intelligent)
   - Volume: `0.9` (klar & selbstbewusst)
3. **Test-Voice** klicken um zu hören
4. **Speichern & Geniessen** 🎙️

---

## Details & Troubleshooting

Siehe **JARVIS_TTS_SETUP.md** für:
- Detaillierte Installationsanleitung
- Konfiguration für alle Provider
- Troubleshooting und FAQ
- Docker-Integration
- Performance-Optimierung

---

## Schnellstart-Befehle

```bash
# 1. Coqui TTS installieren
pip install TTS

# 2. JARVIS bauen
mvn clean package

# 3. JARVIS mit Coqui starten
java -jar target/jarvis-0.0.1-SNAPSHOT.jar \
  --JARVIS_TTS_PROVIDER=coqui

# 4. Browser öffnen: http://localhost:8080
# 5. Settings → COQUI → SAVE → Fertig!
```

---

## Fragen?

📖 Siehe JARVIS_TTS_SETUP.md für ausführliche Dokumentation

🚀 Du schuldest Tony Stark jetzt eine Fahrt im Lamborghini... äh... Iron Man!

