# 🔧 JARVIS Voice Activation - Debugging & Troubleshooting

## Problem: "JARVIS reagiert nicht auf Wakeword"

Wenn JARVIS nicht auf das Wakeword reagiert und keine Mikrofon-Berechtigung abgefragt wird, folge diesen Schritten:

---

## ✅ Schritt 1: Browser-Konsole öffnen (F12)

```
1. Browser öffnen → F12 drücken
2. TAB: Console
3. Nach Meldungen suchen:
   ✅ "[Voice Activation] ✅ Voice Activation Engine initialized"
   ✅ "[Voice Activation] 🎤 Listening for wakeword: "JARVIS""
```

Wenn diese Meldungen NICHT erscheinen → **Schritt 2**

---

## ✅ Schritt 2: Reload-Test

```
1. Browser-Tab neuladen: Ctrl+F5 (Hard Reload)
2. Warte 2-3 Sekunden
3. Konsole prüfen
4. Sollte Meldung erscheinen: "✅ Voice Activation Engine initialized"
```

Wenn immer noch nichts → **Schritt 3**

---

## ✅ Schritt 3: Mikrofon-Berechtigung prüfen

### Chrome:
```
1. 🔒 Schloss-Symbol links oben
2. "Berechtigungen" oder "Site settings"
3. "Mikrofon" → "Zulassen"
4. Tab neuladen (F5)
```

### Firefox:
```
1. Klick auf Adressleiste
2. ℹ️ Info-Symbol
3. "Berechtigungen" → "Mikrofon" → "Zulassen"
4. Tab neuladen (F5)
```

### Edge:
```
1. ⋯ Menü (rechts oben)
2. "Einstellungen" → "Datenschutz"
3. "Berechtigungen" → "Mikrofon"
4. Website hinzufügen und auf "Zulassen" setzen
```

---

## ✅ Schritt 4: Browser-Kompatibilität testen

### Überprüfe die Konsole auf Meldung:
```
❌ "Web Speech API not supported in this browser"
```

**Falls ja:** Nutze einen anderen Browser:
- ✅ Chrome (Beste Unterstützung)
- ✅ Firefox (Gut)
- ✅ Edge (Gut)
- ❌ Safari (Eingeschränkt)

---

## ✅ Schritt 5: Detailliertes Debugging aktivieren

```
1. Browser-Konsole
2. Folgendes eingeben:
   window.VoiceActivation.toggleDebug();
3. Status der Seite zurücksetzen: F5
4. Jetzt sollte Debug-Output erscheinen
```

Beispiel Output:
```
[Voice Activation] ✅ Voice Activation Engine initialized
[Voice Activation] 🎤 Listening for wakeword: "JARVIS"
[Voice Activation] Transcript: hello
[Voice Activation] Transcript: hello jarvis
[Voice Activation] 🎯 Wakeword detected: "hello jarvis"
[Voice Activation] 🔴 RECORDING - Listening for command...
```

---

## ✅ Schritt 6: Manuelle Tests

Öffne Browser-Konsole und teste:

```javascript
// Test 1: Ist voiceActivation.js geladen?
window.VoiceActivation
// Sollte ein Object sein mit: init, start, stop, etc.

// Test 2: Ist es initialisiert?
window.voiceActivationReady
// Sollte 'true' sein

// Test 3: Manuell starten
window.VoiceActivation.start();
// Sollte im Status angezeigt werden: "LISTENING FOR: JARVIS"

// Test 4: Konfiguration anschauen
window.VoiceActivation.getConfig();
// Sollte zeigen: { wakeword: "jarvis", language: "en-US", ... }

// Test 5: Wakeword testen
window.VoiceActivation.setWakeword('hello');
// Jetzt auf "hello" hören statt "jarvis"
```

---

## 🐛 Häufige Fehler & Lösungen

### Fehler 1: "voiceActivation.js:1 Uncaught SyntaxError"
**Ursache:** JavaScript-Syntaxfehler  
**Lösung:**
```bash
# Prüfe Syntax
node --check src/main/resources/static/voiceActivation.js

# Falls Fehler: Datei erneut erstellen
# Kopiere von GITHUB/Dokumentation
```

---

### Fehler 2: "window.VoiceActivation is undefined"
**Ursache:** voiceActivation.js wurde nicht geladen  
**Lösung:**
```
1. Prüfe: Ist <script src="voiceActivation.js"></script> in index.html?
2. Prüfe: Wird voiceActivation.js in target/classes/static/ deployiert?
3. Browser Cache: Ctrl+F5
4. Maven Rebuild: mvn clean package
```

---

### Fehler 3: "NotAllowedError: Permission denied"
**Ursache:** Benutzer hat Mikrofon-Zugriff verweigert  
**Lösung:**
```
1. Browser-Berechtigungen zurücksetzen
2. Website neu laden
3. "Zulassen" beim Dialog klicken
4. Falls "Remember" - zuerst diese Einstellung ändern
```

---

### Fehler 4: "NotFoundError: Requested device not found"
**Ursache:** Kein Mikrofon vorhanden  
**Lösung:**
```
1. Hardware-Test: Ist Mikrofon angeschlossen?
2. Windows: Systemeinstellungen → Datenschutz → Mikrofon
3. Linux: alsamixer oder pavucontrol prüfen
4. macOS: Systemeinstellungen → Sicherheit → Mikrofon
```

---

### Fehler 5: "Network error"
**Ursache:** Verbindung zu Speech-Recognition-Server  
**Lösung:**
```
1. Stabile Internet-Verbindung prüfen
2. VPN deaktivieren (falls aktiv)
3. DNS Probleme? Nutze 8.8.8.8 oder 1.1.1.1
4. Firewall-Einstellungen prüfen
```

---

## 📊 Debugging-Checklist

- [ ] Browser ist Chrome/Chromium/Firefox/Edge
- [ ] Tab neuladen mit Ctrl+F5
- [ ] Mikrofon ist angeschlossen und funktioniert
- [ ] Mikrofon-Berechtigung ist erteilt
- [ ] Konsole zeigt "Voice Activation Engine initialized"
- [ ] Status zeigt "LISTENING FOR: JARVIS" (grün)
- [ ] Sprechtest: "JARVIS" deutlich aussprechen
- [ ] Debug Mode aktiviert für Details
- [ ] Keine Fehler in der Konsole

---

## 🎙️ Mikrofon-Test

Falls Voice Recognition nicht funktioniert:

### Test 1: System-Mikrofon
```
Windows:
→ Systemeinstellungen
→ Datenschutz & Sicherheit
→ Mikrofon
→ Prüfe ob angeschlossen und Zugriff erlaubt

macOS:
→ Systemeinstellungen
→ Sicherheit & Datenschutz
→ Datenschutz Tab
→ Mikrofon
→ Browser hinzufügen wenn nötig

Linux:
alsamixer        # Prüfe Lautstärke
pavucontrol      # Prüfe Geräte
```

### Test 2: Browser-Test
```
Öffne: https://www.google.com/intl/en/chrome/demos/speech.html
Klick auf Mikrofon
Spreche: "Hello"
Falls funktioniert → Browser OK
Falls nicht → Browser Problem
```

### Test 3: Voice-Berechtigungen
```
Chrome: Adressleiste → Schloss → Berechtigungen
Firefox: Adressleiste → Info → Berechtigungen
Edge: Menü → Einstellungen → Datenschutz → Website-Berechtigungen
```

---

## 📱 Mobile/Tablet

Falls du Mobile Test wollen:

**Android Chrome:**
```
1. Chrome öffnen
2. Menü → Einstellungen → Website-Einstellungen
3. Mikrofon → Zulassen
4. Seite neuladen
```

**iPhone Safari:**
```
1. Einstellungen → Safari → Datenschutz → Mikrofon
2. jarvis.local (oder deine URL) auf Zulassen setzen
3. Safari neuladen
```

---

## 🔍 Erweiterte Diagnostik

Falls alles obige nicht hilft, nutze folgendes Script:

```javascript
// In Browser-Konsole eingeben:

// 1. Web Speech API Check
console.log('Web Speech API verfügbar:', !!(window.SpeechRecognition || window.webkitSpeechRecognition));

// 2. GetUserMedia Check
console.log('getUserMedia verfügbar:', !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));

// 3. voiceActivation Status
console.log('VoiceActivation geladen:', typeof window.VoiceActivation);
console.log('VoiceActivation bereit:', window.voiceActivationReady);

// 4. Recognizer Status
if (window.VoiceActivation) {
    console.log('Listening:', window.VoiceActivation.isListening());
    console.log('Processing:', window.VoiceActivation.isProcessing());
    console.log('Config:', window.VoiceActivation.getConfig());
}

// 5. Starte manuell
if (window.VoiceActivation) {
    window.VoiceActivation.init();
    window.VoiceActivation.start();
    console.log('Manuell gestartet');
}
```

---

## 📞 Wenn nichts hilft

1. **Browser-Cache löschen**
   ```
   Ctrl+Shift+Delete → Clear browsing data → All time
   ```

2. **Maven Rebuild**
   ```bash
   mvn clean package
   ```

3. **Docker Rebuild** (falls Docker)
   ```bash
   docker-compose down -v
   docker-compose up --build
   ```

4. **Browser neustarten**
   - Alle Tabs schließen
   - Browser komplett beenden
   - Neu öffnen

5. **System neustart**
   - Computer neustarten
   - Alle Services/Container neustarten

6. **Browser wechseln**
   - Teste mit Chrome/Firefox/Edge
   - Ausschließen ob es Browser-spezifisch ist

---

## ✅ Erfolgs-Indikatoren

Alles funktioniert wenn:

```
✅ Konsole zeigt: "[Voice Activation] ✅ Voice Activation Engine initialized"
✅ Status Text: "LISTENING FOR: JARVIS" (grün)
✅ Du "JARVIS" sprichst → Status wird rot: "RECORDING COMMAND..."
✅ Browser erkennt deine Stimme
✅ Text wird zu JARVIS gesendet
✅ JARVIS antwortet
```

---

## 🎉 Feedback & Verbesserungen

Falls du eine bessere Lösung findest oder weitere Debugging-Tipps hast, teile sie mit!

**Viel Erfolg beim Debuggen!** 🔧🎤

