# 🧪 Settings Persistence - Test Guide

## Schnelltest durchführen

### Test 1: Settings speichern und localStorage überprüfen

**Schritte:**
1. JARVIS im Browser öffnen
2. Klick auf "⚙️ Settings" Button
3. Ändere folgende Einstellungen:
   - **Wakeword**: von "jarvis" zu "alexa"
   - **Sprache**: von "en-US" zu "de-DE"
   - **Rate**: von 0.85 zu 1.2
   - **Pitch**: von 1.1 zu 0.9
4. Klick "Save Settings"
5. Öffne Browser DevTools:
   - **Chrome/Edge**: F12 → Application → Local Storage
   - **Firefox**: F12 → Storage → Local Storage
6. Suche nach "jarvis_user_preferences" und "jarvis_voice_params"

**Erwartetes Ergebnis:**
```json
jarvis_user_preferences: {
  "wakeword": "alexa",
  "language": "de-DE",
  "voiceId": "...",
  "microphoneId": "...",
  "llm": "...",
  "tts": "...",
  "model": "..."
}

jarvis_voice_params: {
  "rate": 1.2,
  "pitch": 0.9,
  "volume": 0.9
}
```

---

### Test 2: Browser neu laden - Einstellungen sollten geladen sein

**Schritte:**
1. Browser Reload (F5)
2. Warte, bis JARVIS geladen hat
3. Öffne Browser Console (F12 → Console)
4. Suche nach Logs:
   ```
   [APP] ✅ Voice parameters loaded from storage:
   [VA] 📦 Loaded preferences from localStorage:
   ```
5. Überprüfe CONFIG in voiceActivation:
   ```javascript
   // In Console tippen:
   window.VoiceActivation.getConfig()
   ```

**Erwartetes Ergebnis:**
```javascript
{
  wakeword: "alexa",
  language: "de-DE",
  continuous: true,
  interimResults: true,
  microphoneId: "..."
}
```

---

### Test 3: Settings Modal öffnen - Felder sollten gefüllt sein

**Schritte:**
1. Klick auf "⚙️ Settings" Button
2. Überprüfe, dass alle Felder mit deinen gespeicherten Werten gefüllt sind:
   - Wakeword Input: "alexa"
   - Sprache Select: "de-DE"
   - Rate Slider: 1.2 (mit Label "1.20x")
   - Pitch Slider: 0.9 (mit Label "0.90x")

**Erwartetes Ergebnis:**
Alle Felder haben die Werte, die du gespeichert hast ✅

---

### Test 4: Voice Parameters testen

**Schritte:**
1. Öffne Settings Modal
2. Ändere Voice Parameter:
   - Rate auf 0.5 (sehr langsam)
   - Pitch auf 2.0 (sehr hoch)
3. Teste Voice mit "Test Voice" Button
4. Höre Unterschied in Geschwindigkeit und Tonhöhe
5. Speichere Settings
6. Reload Browser
7. "Test Voice" Button wieder klicken - sollte gleich klingen

**Erwartetes Ergebnis:**
Voice klingt nach Reload gleich wie vor Reload ✅

---

### Test 5: Console Logs überprüfen

**Schritte:**
1. Öffne Browser Console (F12 → Console)
2. Reload Seite
3. Suche nach Logs mit diesen Prefixen:
   ```
   [SettingsState]
   [VA]
   [APP]
   [SettingsUi]
   ```

**Erwartetes Ergebnis:**
```
[APP] ✅ Voice parameters loaded from storage: {rate: 1.2, pitch: 0.9, volume: 0.9}
[VA] 📦 Loaded preferences from localStorage: {wakeword: "alexa", language: "de-DE", ...}
[SettingsUi] Restoring preferences from localStorage: {wakeword: "alexa", ...}
```

---

## Erweiterte Tests

### Test 6: localStorage manuell überprüfen

**In Browser Console:**
```javascript
// Alle Einstellungen anzeigen
console.log(window.SettingsState.loadPreferences());
console.log(window.SettingsState.loadVoiceParams());

// Oder direkt:
console.log(JSON.parse(localStorage.getItem('jarvis_user_preferences')));
console.log(JSON.parse(localStorage.getItem('jarvis_voice_params')));
```

---

### Test 7: Einstellungen löschen und neu speichern

**In Browser Console:**
```javascript
// Alles löschen
window.SettingsState.clearPreferences();
console.log('Gelöscht!');

// Neue Einstellungen speichern
window.SettingsState.savePreferences({
    wakeword: 'computer',
    language: 'fr-FR',
    microphoneId: 'device-123',
    voiceId: 'French Voice',
    llm: 'gemini',
    tts: 'browser',
    model: 'gemini-pro'
});

// Überprüfen
console.log(window.SettingsState.loadPreferences());
```

**Dann Browser reload und schauen ob neue Einstellungen geladen werden.**

---

### Test 8: Privates Browsing / Inkognito Fenster

**Schritte:**
1. Öffne Seite in privatem Fenster
2. Ändere Einstellungen
3. Klick "Save Settings"
4. Überprüfe Browser Console auf Errors
5. App sollte mit Default-Werten weiterlaufen

**Erwartetes Ergebnis:**
- localStorage schreibt fehl (Fehler in Console)
- App funktioniert trotzdem ✅

---

## Fehlerbehandlung Testen

### Test 9: localStorage Error Handling

**In Browser Console - localStorage blockieren:**
```javascript
// localStorage temporär deaktivieren
const originalSetItem = localStorage.setItem;
localStorage.setItem = function() { 
    throw new Error('Storage quota exceeded'); 
};

// Jetzt Settings speichern versuchen
```

**Erwartetes Ergebnis:**
- Console zeigt Error Log mit `[SettingsState] ❌ Failed to save preferences:`
- App funktioniert trotzdem weiter
- Fehlerbehandlung arbeitet ✅

---

## Checkliste für QA

- [ ] Einstellungen werden in localStorage gespeichert
- [ ] localStorage Keys sind: `jarvis_user_preferences` und `jarvis_voice_params`
- [ ] Nach Browser Reload werden Einstellungen geladen
- [ ] Voice Activation nutzt gespeicherte Sprache & Wakeword
- [ ] Voice Parameter werden auf gespeicherte Werte gesetzt
- [ ] Settings Modal zeigt gespeicherte Werte beim Öffnen
- [ ] Console Logs zeigen erfolgreiche Operationen
- [ ] Private Fenster: App funktioniert mit Default-Werten
- [ ] Alte gespeicherte Einstellungen können gelöscht werden
- [ ] Fehlerbehandlung funktioniert (Logs statt Crash)

---

## Performance Überprüfung

**In Browser Console:**
```javascript
// Messe Zeit zum Laden
console.time('loadSettings');
window.SettingsState.loadPreferences();
window.SettingsState.loadVoiceParams();
console.timeEnd('loadSettings');
```

**Erwartetes Ergebnis:** < 5ms (localStorage ist sehr schnell) ✅

---

## Troubleshooting bei Tests

### "localStorage item is not defined"
**Ursache:** Private Fenster oder localStorage deaktiviert
**Lösung:** Normal - App funktioniert mit Defaults

### "Preferences laden sich nicht"
**Überprüfung:**
```javascript
// 1. Ist SettingsState geladen?
typeof window.SettingsState !== 'undefined'

// 2. Existieren localStorage Keys?
localStorage.getItem('jarvis_user_preferences')
localStorage.getItem('jarvis_voice_params')

// 3. Können Einstellungen manuell laden?
window.SettingsState.loadPreferences()
```

### "Voice Parameters sind nicht Standard"
**Überprüfung:**
```javascript
console.log(window.voiceParams);
// Sollte sein: {rate: X, pitch: Y, volume: Z}
```

---

## Resultat

Alle Tests erfolgreich? ✅

Dann ist die Settings Persistence **vollständig funktionsfähig**!

Die Anwender können jetzt:
1. Einstellungen speichern
2. Die Einstellungen bleiben über Browser-Neustarts erhalten
3. Alle Voice Parameter werden beibehalten
4. Wakeword, Sprache und Mikrophon werden beim Start korrekt gesetzt

