# 🧪 COMPLETE SETTINGS - Quick Test

## In 5 Minuten testen

### Step 1: Browser Cache leeren
```
Strg+Shift+Del (oder Cmd+Shift+Del auf Mac)
→ Cache & Cookies löschen
→ Browser reload (F5)
```

### Step 2: Settings öffnen
```
Klick: ⚙️ SETTINGS Button
Warte: Modal wird angezeigt
```

### Step 3: Mehrere Einstellungen ändern
```
✓ Wakeword: "jarvis" → "computer"
✓ Language: "en-US" → "de-DE"  
✓ Rate: 0.85 → 1.2
✓ Pitch: 1.1 → 0.9
✓ TTS: "mock" → "browser"
```

### Step 4: Speichern
```
Klick: "SAVE & REBOOT" Button
Warte: Modal schließt sich
Überprüfe Console (F12):
  ✅ [SettingsState] ✅ Complete settings saved
  ✅ [SettingsUi] ✅ ALL settings saved
```

### Step 5: Überprüfe localStorage
```
F12 → Application → Local Storage → [Your Domain]

Suche nach: jarvis_complete_settings

Sollte enthalten:
{
  "wakeword": "computer",
  "language": "de-DE",
  "voiceRate": 1.2,
  "voicePitch": 0.9,
  "tts": "browser",
  ...
}

✅ Alle Werte sollten deine Änderungen enthalten!
```

### Step 6: Teste Restore beim Modal öffnen
```
Klick: ⚙️ SETTINGS Button (wieder)
Überprüfe: Sind alle Werte noch da?
  ✓ Wakeword: "computer" ✅
  ✓ Language: "de-DE" ✅
  ✓ Rate: 1.2 ✅
  ✓ Pitch: 0.9 ✅

Console sollte zeigen:
  ✅ [SettingsUi] ✅ Restoring ALL settings
```

### Step 7: Browser reload
```
F5 (Reload)
Warte: App lädt neu
Überprüfe Console:
  ✅ [APP] ✅ Complete settings loaded
  ✅ [VA] ✅ Loaded COMPLETE preferences
```

### Step 8: Teste Voice
```
Sage: "Computer test"  (mit neuem Wakeword!)
Sollte: Erkannt werden ✅

Höre: JARVIS Response
Sollte: Mit neuer Geschwindigkeit/Tonhöhe sprechen ✅
```

---

## Schnelle Console Tests

### Test 1: Complete Settings anzeigen
```javascript
// F12 Console eingeben:
console.log(
  window.SettingsState.loadCompleteSettings()
)

// Sollte zeigen: { wakeword, language, voiceRate, ... }
```

### Test 2: Alle localStorage Keys anzeigen
```javascript
console.log('=== ALL STORAGE KEYS ===');
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.includes('jarvis')) {
        console.log(key, ':', localStorage.getItem(key));
    }
}
```

### Test 3: Einstellungen manuell speichern
```javascript
window.SettingsState.saveCompleteSettings({
    wakeword: 'alexa',
    language: 'fr-FR',
    voiceRate: 0.9,
    voicePitch: 1.0,
    voiceVolume: 0.8,
    tts: 'mock',
    llm: 'ollama',
    model: 'custom',
    geminiKey: '',
    microphoneId: '',
    voiceId: '',
    voiceDebug: true,
    savedAt: new Date().toISOString(),
    version: '2.0'
});

// Dann reload und überprüfen
```

### Test 4: Einstellungen löschen
```javascript
window.SettingsState.clearPreferences();
console.log('✅ Settings gelöscht');

// Seite reload - sollte mit Defaults starten
```

---

## Erwartete Console Logs

### Nach "SAVE & REBOOT"
```
[SettingsState] ✅ Complete settings saved to LocalStorage: {...}
[SettingsUi] ✅ ALL settings saved to localStorage: {...}
[APP] Configuration saved. LLM: GEMINI
```

### Nach Modal öffnen
```
[SettingsUi] ✅ Restoring ALL settings from localStorage: {...}
[SettingsUi] ✅ ALL settings restored successfully
```

### Nach Browser reload
```
[APP] ✅ Complete settings loaded from storage
[APP] ✅ Voice parameters applied: {rate: 1.2, pitch: 0.9, volume: 0.9}
[VA] ✅ Loaded COMPLETE preferences from localStorage: {...}
```

---

## Troubleshooting

### Einstellungen werden nicht gespeichert
```
Überprüfe:
1. Browser Console auf Fehler
2. localStorage.length > 0?
3. Sind die Werte im localStorage?
   → F12 → Application → Local Storage
4. Sollte jarvis_complete_settings Key existieren
```

### Einstellungen werden nicht geladen
```
Überprüfe:
1. Existiert jarvis_complete_settings im localStorage?
2. Browser Console auf Parse-Fehler
3. Sind die Werte nach reload noch da?
4. Versuche: Seite mit Strg+Shift+Del reload
```

### Alte Einstellungen werden geladen
```
Das ist OK - Backward Compatibility!
Die alte Daten werden beim nächsten Speichern
zur neuen Format migriert.

Um sofort zu aktualisieren:
1. Ändere eine Einstellung
2. Klick "SAVE & REBOOT"
3. Neue Format wird erstellt
```

---

## Checkliste

- [ ] Complete settings werden gespeichert (Console check)
- [ ] localStorage hat jarvis_complete_settings Key
- [ ] Alle Felder werden in JSON gespeichert
- [ ] Nach Modal öffnen sind Werte wiederhergestellt
- [ ] Nach Browser reload sind Werte noch vorhanden
- [ ] Voice spricht mit gespeicherten Parametern
- [ ] Wakeword wird mit gespeichertem Wort erkannt
- [ ] Keine Console Fehler vorhanden

---

## Status

Alle Settings werden JETZT vollständig gespeichert und geladen! ✅

