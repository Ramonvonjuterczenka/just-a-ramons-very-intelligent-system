# JARVIS Voice Activation - Continuous Listening with Wakeword Detection

## 📋 Überblick

Die Voice Activation Engine ermöglicht es dem Browser, **kontinuierlich auf das Wakeword "JARVIS" zu lauschen** und dann automatisch Sprachbefehle zu akzeptieren und zu verarbeiten.

Dies funktioniert vollständig im Browser über die **Web Speech API** - ohne zusätzliche Backend-Anforderungen.

---

## 🎯 Wie es funktioniert

### Ablauf:

1. **Kontinuierliches Zuhören** 🎤
   - Browser wartet auf das Wakeword "JARVIS"
   - Status zeigt: `LISTENING FOR: "JARVIS"`
   - Grüne Farbe = aktiv und bereit

2. **Wakeword erkannt** 🎯
   - Benutzer sagt: "JARVIS, wie spät ist es?"
   - Engine erkennt "JARVIS" und startet **Recording Mode**
   - Status wechselt zu rot: `RECORDING COMMAND...`
   - Arc Reactor blinkt rot (Aufnahme aktiv)

3. **Befehl aufnehmen** 🔴
   - Browser nimmt den Rest des Satzes auf
   - "wie spät ist es?" wird erkannt
   - Nach Stille (3 Sekunden) oder Timeout (30 Sekunden) stoppt die Aufnahme

4. **Befehl verarbeiten** ⚙️
   - Erkannte Text wird zu JARVIS gesendet
   - JARVIS antwortet
   - Engine geht zurück zu Schritt 1 (kontinuierliches Zuhören)

---

## ✅ Features

### ✅ Kontinuierliches Zuhören
- Browser läuft immer im Hintergrund und hört zu
- Automatischer Restart nach Timeout
- Intelligente Fehlerbehandlung

### ✅ Wakeword-Erkennung
- Erkennt "JARVIS" in beliebigem Kontext
- Wakeword wird aus dem Befehl herausgefiltert
- Case-insensitive (großschreibung spielt keine Rolle)

### ✅ Automatische Aufnahmeverarbeitung
- Stoppt automatisch nach Stille
- Oder nach maximaler Aufnahmezeit (30 Sekunden)
- Intelligent: "ähs" und Pausen werden ignoriert

### ✅ UI-Feedback
- Live-Status Updates
- Arc Reactor Animationen
- Status-Text mit klaren Meldungen
- Visuelle Hinweise (Farben: grün = lauscht, rot = aufnimmt)

### ✅ Konfigurierbar
- **Wakeword ändern**: In Settings eingeben (z.B. "AI" statt "JARVIS")
- **Sprache wählen**: en-US, en-GB, de-DE, fr-FR, es-ES
- **Debug Mode**: Sieht Zwischenresultate in Real-Time

---

## 🎮 Verwendung

### Automatisches Starten
- Browser öffnen → Voice Activation startet automatisch
- Status: `LISTENING FOR: "JARVIS"`
- Arc Reactor ist **grün**

### Mit Mikrofon aktivieren:

**Option 1: Einfach sprechen**
```
Benutzer: "JARVIS, wie ist das Wetter?"
JARVIS:   "Das Wetter ist sonnig mit 22 Grad."
```

**Option 2: Mic-Button klicken zum Aktivieren/Deaktivieren**
- Klick auf Arc Reactor = Toggle Voice Activation
- An: `LISTENING FOR: "JARVIS"` (grün)
- Aus: `VOICE ACTIVATION DISABLED` (rot)

### Sprachbefehl-Beispiele:

```
"JARVIS, wer bin ich?"
"JARVIS, welche Zeit ist es?"
"JARVIS, starte Musik ab"
"JARVIS, schalte das Licht aus"
"JARVIS, wie lauten die Nachrichten?"
```

Das Wakeword wird automatisch entfernt, sodass JARVIS nur den eigentlichen Befehl erhält.

---

## ⚙️ Konfiguration

### In den Settings (UI):

#### 1. Wakeword ändern
- Feld: `Wakeword`
- Standard: `jarvis`
- Beispiel: "AI", "Assistant", "Hey", etc.

**Hinweis:** Nutze kurze, deutliche Wörter für beste Erkennung

#### 2. Sprache auswählen
- Dropdown: `Language`
- Optionen:
  - English (US) - `en-US`
  - English (UK) - `en-GB`
  - German - `de-DE`
  - French - `fr-FR`
  - Spanish - `es-ES`

**Hinweis:** Wähle deine Sprache für bessere Erkennung

#### 3. Debug Mode
- Checkbox: `🔍 Debug Mode`
- Zeigt Zwischen-Ergebnisse in Echtzeit
- Hilfreich für Troubleshooting

---

## 📁 Technische Implementierung

### Neue Datei:
```
✨ voiceActivation.js - Kern-Engine für kontinuierliches Zuhören
```

### Modifizierte Dateien:
```
📝 app.js - Integration von Voice Activation
📝 index.html - Voice Activation Settings hinzugefügt
📝 settingsUi.js - Verwaltung der Voice Activation Einstellungen
```

### JavaScript-API (für Entwickler):

```javascript
// Initialisieren
window.VoiceActivation.init();

// Starten (zuhören)
window.VoiceActivation.start();

// Stoppen
window.VoiceActivation.stop();

// Wakeword ändern
window.VoiceActivation.setWakeword('hello');

// Sprache ändern
window.VoiceActivation.setLanguage('de-DE');

// Debug Mode ein/aus
window.VoiceActivation.toggleDebug();

// Status abfragen
window.VoiceActivation.isListening();      // true/false
window.VoiceActivation.isProcessing();     // true/false
window.VoiceActivation.getConfig();        // Aktuelle Konfiguration
```

---

## 🔧 Technische Details

### Browser-Anforderungen
- ✅ Chrome/Chromium (beste Unterstützung)
- ✅ Firefox (gut)
- ✅ Safari (eingeschränkt - benötigt `webkitSpeechRecognition`)
- ✅ Edge (gut)

### Berechtigungen
- Browser fragt bei erstem Use: "Erlauben Sie Mikrofon-Zugriff?"
- Muss "Zulassen" sein, damit Voice Activation funktioniert

### WebSocket-Integration
- Voice-Text wird automatisch über WebSocket zu JARVIS gesendet
- Keine separaten API-Calls nötig
- Nahtlose Integration mit existiertem Chat-System

### Fehlerbehandlung
- **Netzwerkfehler**: Zeigt Warnung, versucht neu zu verbinden
- **Keine Sprache erkannt**: Sagt "No speech detected" und lauscht weiter
- **Permission Denied**: Zeigt klar, dass Mikrofon-Zugriff fehlt
- **Browser nicht unterstützt**: Fallback auf manuelle Text-Eingabe

---

## 🎨 UI-Status Übersicht

| Status | Farbe | Bedeutung |
|--------|-------|-----------|
| `LISTENING FOR: "JARVIS"` | 🟢 Grün | Zuhört aktiv auf Wakeword |
| `RECORDING COMMAND...` | 🔴 Rot | Nimmt Befehl auf |
| `PROCESSING...` | 🟠 Orange | Verarbeitet Befehl |
| `VOICE ACTIVATION DISABLED` | 🔴 Rot | Zuhören deaktiviert |
| `MICROPHONE ACCESS DENIED` | 🔴 Rot | Keine Mikrofon-Berechtigung |
| `SYSTEM ONLINE` | ⚪ Weiß | Normal/Bereit |

---

## 🐛 Troubleshooting

### Problem: "No speech detected" oder "Browser STT nicht verfügbar"
**Lösung:**
1. Überprüfe, dass Mikrofon angeschlossen ist
2. In Browser-Einstellungen: Mikrofon-Zugriff erlauben
3. Teste mit Eingabefeld (ohne Voice)

### Problem: "Erkennt 'JARVIS' nicht"
**Lösung:**
1. Spreche deutlich und langsam
2. Reduziere Hintergrundgeräusche
3. Ändere Sprache in Settings (z.B. en-GB statt en-US)
4. Aktiviere Debug Mode um zu sehen, was erkannt wird

### Problem: "Nimmt Befehle nicht auf"
**Lösung:**
1. Warte bis Status auf "RECORDING COMMAND..." wechselt
2. Stimmebilität-Optimierung: Spreche deutlicher
3. Überprüfe in Debug Mode, was erkannt wird

### Problem: "Browser Voice Recognition nicht unterstützt"
**Lösung:**
1. Nutze Chrome/Chromium (beste Unterstützung)
2. Firefox sollte auch funktionieren
3. Safari: Benötigt spezielle Einstellungen
4. Fallback: Nutze Textfeld zum Eingeben

### Problem: "Zu viele False Positives" (startet zu oft)
**Lösung:**
1. Ändere Wakeword zu etwas Eindeutigerem
2. Aktiviere Debug Mode um zu sehen, was erkannt wird
3. Reduziere Hintergrundgeräusche

---

## 🚀 Best Practices

### 1. **Optimale Umgebung**
- Ruhiger Raum (wenig Hintergrundgeräusche)
- Gutes Mikrofon (integierte Mikrofone funktionieren auch)
- Stabile Internet-Verbindung

### 2. **Effektive Sprachbefehle**
✅ Gut:
- "JARVIS, stelle den Timer auf 5 Minuten"
- "JARVIS, was ist die Hauptstadt von Frankreich?"
- "JARVIS, spiele klassische Musik"

❌ Schlecht:
- "Äh... JARVIS... äh... was ist..." (zu viele Pausen)
- "JARVIS JARVIS JARVIS" (Wakeword wiederholen)
- "Du da" (zu ähnlich, nicht eindeutig)

### 3. **Wakeword Auswahl**
✅ Gute Wakewords:
- "JARVIS" (Original)
- "FRIDAY" (Iron Man Theme)
- "ECHO" (Amazon Inspiration)
- "ALEX" (kurz & deutlich)

❌ Schlechte Wakewords:
- "The" (zu ähnlich wie andere Wörter)
- "Hello" (wird oft gehört)
- "Ä" oder "Ö" (schwer zu erkennen)

---

## 📊 Performance

| Aktion | Zeit |
|--------|------|
| Wakeword-Erkennung | 1-3 Sekunden |
| Befehl-Recording | 2-10 Sekunden (abhängig vom Befehl) |
| Gesamtlatenz bis Antwort | 3-15 Sekunden (abhängig von LLM) |

---

## 🔐 Datenschutz

✅ **Vollständig im Browser**
- Keine Sprachdaten werden zum Server gesendet
- Nur der erkannte **Text** wird zu JARVIS gesendet
- Audio wird lokal verarbeitet und nicht gespeichert

---

## 🎓 Erweiterte Konfiguration

Falls du die `voiceActivation.js` editieren möchtest:

```javascript
const CONFIG = {
    wakeword: 'jarvis',              // Wakeword
    language: 'en-US',               // Sprache
    interimResultsTimeout: 3000,     // Timeout für Stille (ms)
    maxListeningTime: 30000,         // Max Aufnahmezeit (ms)
    autoRestart: true,               // Auto-Restart nach Fehler
    debugMode: false                 // Debug-Logging
};
```

---

## 🎉 Ergebnis

**JARVIS lauscht jetzt kontinuierlich und wartet auf deine Stimme!**

Starten Sie JARVIS und sagen Sie einfach:
```
"JARVIS, guten Morgen!"
```

JARVIS antwortet automatisch mit hochwertiger Sprache 🎤

---

## 📞 Support & Feedback

Bei Problemen:
1. Überprüfe Settings → Voice Activation Settings
2. Aktiviere Debug Mode um zu sehen, was erkannt wird
3. Überprüfe Browser-Konsole (F12) auf Fehler
4. Teste Mikrofon mit anderem Tool (z.B. Voice Memo)

---

**Ready to talk to JARVIS! 🎤🤖**

