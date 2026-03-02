# JARVIS Settings Persistence Guide 📦

## Übersicht

Das System speichert jetzt alle Benutzereinstellungen lokal im Browser's **localStorage** und lädt sie automatisch beim Start wieder.

## Was wird gespeichert?

### 1. **Benutzereinstellungen** (`jarvis_user_preferences`)
- **Wakeword**: z.B. "jarvis", "friday"
- **Sprache**: z.B. "en-US", "de-DE"
- **Mikrophon ID**: ID des ausgewählten Mikrophons
- **Voice ID**: Ausgewählte Sprache für Text-zu-Sprache
- **LLM Provider**: Welcher KI-Anbieter aktiv ist
- **TTS Provider**: Welcher Speech-Synthesis-Anbieter aktiv ist
- **Model**: Welches Modell ausgewählt ist
- **Gemini API Key**: (verschlüsselt optional)

### 2. **Voice Parameter** (`jarvis_voice_params`)
- **Rate**: Sprechgeschwindigkeit (0.5 - 2.0)
- **Pitch**: Tonhöhe (0.5 - 2.0)
- **Volume**: Lautstärke (0 - 1)

## Wo werden die Daten gespeichert?

- **Browser localStorage**: Lokal auf dem Anwender-Gerät
- **Keine Übertragung zum Server**: Nur lokal verwaltet
- **Persistierung**: Bleibt auch nach Browser-Neustart erhalten

## Funktionsweise

### Speichern (beim Klick auf "Save Settings")

```javascript
// Automatisch gespeichert in settingsUi.js:saveSettings()
window.SettingsState.savePreferences(voicePrefs);
window.SettingsState.saveVoiceParams(window.voiceParams);
```

### Laden beim Start

1. **App Start** (`app.js`):
   ```javascript
   window.addEventListener('DOMContentLoaded', () => {
       loadVoiceParamsFromStorage();  // Voice Parameter laden
       // ...
   });
   ```

2. **Voice Activation Init** (`voiceActivation.js`):
   ```javascript
   function initializeVoiceActivation() {
       loadSavedPreferences();  // Wakeword, Sprache, Mikrophon laden
       // ...
   }
   ```

3. **Settings Modal öffnen** (`settingsUi.js`):
   ```javascript
   if (dom.settingsBtn) {
       dom.settingsBtn.addEventListener('click', () => {
           restoreSettings();  // Alle Einstellungen in die Modal laden
           // ...
       });
   }
   ```

## API Reference

### window.SettingsState

```javascript
// Einstellungen speichern
window.SettingsState.savePreferences({
    wakeword: 'jarvis',
    language: 'en-US',
    microphoneId: 'device-123',
    voiceId: 'Google US English::en-US',
    llm: 'gemini',
    tts: 'browser',
    model: 'gemini-pro'
});

// Einstellungen laden
const prefs = window.SettingsState.loadPreferences();

// Voice Parameter speichern
window.SettingsState.saveVoiceParams({
    rate: 0.85,
    pitch: 1.1,
    volume: 0.9
});

// Voice Parameter laden
const params = window.SettingsState.loadVoiceParams();

// Alles löschen
window.SettingsState.clearPreferences();
```

## Workflow

### Anwender speichert Einstellungen

```
1. Klick auf "⚙️ Settings" Button
   ↓
2. settingsUi.js lädt alle gespeicherten Einstellungen
   (restoreSettings())
   ↓
3. Anwender ändert Einstellungen
   ↓
4. Klick auf "Save Settings" Button
   ↓
5. Einstellungen werden:
   - An Server geschickt (/api/config)
   - Im localStorage gespeichert
   ↓
6. Modal schließt sich
```

### Nächster Browser-Start

```
1. DOMContentLoaded Event
   ↓
2. loadVoiceParamsFromStorage() 
   → Sprachparameter werden laden
   ↓
3. voiceActivation.js initialisiert sich
   ↓
4. loadSavedPreferences()
   → Wakeword, Sprache, Mikrophon werden geladen
   ↓
5. JARVIS startet mit den gespeicherten Einstellungen ✅
```

## Lokale Storage Keys

```javascript
// In Browser DevTools -> Application -> Local Storage:

// Benutzereinstellungen
'jarvis_user_preferences' 
// = {
//   "wakeword": "jarvis",
//   "language": "en-US",
//   "microphoneId": "device-123",
//   "voiceId": "Google US English::en-US",
//   "llm": "gemini",
//   "tts": "browser",
//   "model": "gemini-pro",
//   "geminiKey": "***"
// }

// Voice Parameter
'jarvis_voice_params'
// = {
//   "rate": 0.85,
//   "pitch": 1.1,
//   "volume": 0.9
// }

// Mikrophon-ID (legacy, wird durch preferences ersetzt)
'jarvis_microphone_id' = 'device-123'
```

## Fehlerbehandlung

Falls Einstellungen nicht geladen werden können:

```javascript
// Manuell löschen (in Browser Console):
window.SettingsState.clearPreferences();

// Neue Einstellungen speichern
// Settings Modal öffnen und erneut speichern
```

## Troubleshooting

### Einstellungen werden nicht gespeichert

**Problem**: localStorage ist deaktiviert oder voll
**Lösung**: 
```bash
# Browser-Einstellungen prüfen
# Cookies & Site Data aktivieren
# Oder privates Browsing deaktivieren
```

### Alte Einstellungen werden nicht geladen

**Problem**: localStorage wurde gelöscht
**Lösung**: Einstellungen erneut konfigurieren und speichern

### Nur manche Einstellungen werden gespeichert

**Prüfe**:
- DevTools -> Application -> Local Storage -> Current URL
- Schaue nach `jarvis_user_preferences` und `jarvis_voice_params` Keys
- Bei Fehlern siehe Console logs `[SettingsState]` Meldungen

## Sicherheit

⚠️ **Wichtig**: 
- localStorage ist **NICHT verschlüsselt**
- Speichere **keine sensiblen Daten** wie API-Schlüssel lokal
- Gemini API Key wird nur im localStorage gespeichert (TODO: verschlüsseln)

## Entwickler-Tipps

### Alle Einstellungen in Console ansehen

```javascript
console.log(window.SettingsState.loadPreferences());
console.log(window.SettingsState.loadVoiceParams());
```

### Einstellungen testen

```javascript
// Manuelle Test-Einstellungen speichern
window.SettingsState.savePreferences({
    wakeword: 'computer',
    language: 'de-DE',
    microphoneId: 'test',
    voiceId: 'Deutsch'
});

// Danach Seite neu laden -> Einstellungen sollten geladen sein
location.reload();
```

### Console Logs aktivieren

Alle Operationen werden geloggt mit `[SettingsState]` Prefix:
```
[SettingsState] ✅ Preferences saved to LocalStorage
[SettingsState] ✅ Preferences loaded from LocalStorage
[VA] 📦 Loaded preferences from localStorage
```

