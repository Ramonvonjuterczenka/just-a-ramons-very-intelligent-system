# 🎯 JARVIS Settings Persistence - Benutzerhandbuch

## Was ist neu? 🆕

JARVIS speichert jetzt **automatisch** alle deine Einstellungen! 

Wenn du JARVIS heute konfigurierst:
- ✅ Wakeword ("Jarvis", "Alexa", etc.)
- ✅ Sprache ("Englisch", "Deutsch", etc.)
- ✅ Dein Mikrophon
- ✅ Deine bevorzugte Stimme
- ✅ Voice Parameter (Geschwindigkeit, Tonhöhe, Lautstärke)

...dann hat JARVIS **morgen** noch die gleiche Konfiguration! 🚀

---

## Wie funktioniert es?

```
1. Du öffnest JARVIS
   ↓
2. JARVIS lädt deine gespeicherten Einstellungen
   ↓
3. JARVIS ist sofort mit DEINEN Einstellungen bereit ✅
   ↓
4. Du stellst neue Einstellungen ein
   ↓
5. Du klickst "Save Settings"
   ↓
6. JARVIS speichert deine Einstellungen lokal
   ↓
7. Nächster Start → Gleiche Einstellungen ✅
```

---

## Was wird gespeichert?

| Einstellung | Beispiel | Speichert bei | Lädt bei |
|---|---|---|---|
| 🎙️ **Wakeword** | "jarvis" | Settings speichern | App-Start |
| 🌍 **Sprache** | "Deutsch (de-DE)" | Settings speichern | App-Start |
| 🎧 **Mikrophon** | "USB Headset" | Settings speichern | App-Start |
| 🗣️ **Voice** | "Google Englisch" | Settings speichern | Settings öffnen |
| ⚡ **Rate** | 0.85x (Normal) | Settings speichern | App-Start |
| 🎵 **Pitch** | 1.1x (Hoch) | Settings speichern | App-Start |
| 🔊 **Volume** | 0.9 (Laut) | Settings speichern | App-Start |
| 🤖 **LLM** | "Gemini" | Settings speichern | Server |
| 📢 **TTS** | "Browser" | Settings speichern | Server |

---

## Erste Verwendung

### Schritt 1️⃣ - Settings öffnen
Klick auf den **⚙️ Settings** Button oben rechts

### Schritt 2️⃣ - Einstellungen konfigurieren

**Voice Aktivation:**
- Wakeword: Welches Wort JARVIS hören soll um zu starten (z.B. "jarvis")
- Sprache: Welche Sprache du sprichst (z.B. "English US")
- Mikrophon: Welches Mikrophon zu verwenden (dein Headset?)

**Voice Parameter:**
- **Rate**: Wie schnell JARVIS spricht
  - 0.5 = Sehr langsam 🐢
  - 1.0 = Normal ⏱️
  - 1.5 = Schnell 🏃
- **Pitch**: Tonhöhe der Stimme
  - 0.5 = Sehr tief 🔊
  - 1.0 = Normal 🎙️
  - 1.5 = Sehr hoch 🎵
- **Volume**: Lautstärke
  - 0.5 = Leise 🤫
  - 1.0 = Laut 🔊

**KI & Text-zu-Sprache:**
- LLM Provider: Welche KI-Engine (Gemini, Ollama, etc.)
- TTS Provider: Wie JARVIS spricht (Browser, Google Cloud, etc.)
- Model: Welches KI-Modell

### Schritt 3️⃣ - Test-Sprache anhören
Klick auf **🔊 Test Voice** um die neue Stimme zu hören

### Schritt 4️⃣ - Speichern
Klick auf **💾 Save Settings** unten

**Fertig!** ✅ JARVIS hat deine Einstellungen gespeichert

---

## Verwendung nach dem Speichern

Beim nächsten Start:
1. Browser öffnen
2. JARVIS Seite laden
3. Warten bis "SYSTEM ONLINE" angezeigt wird
4. JARVIS hat automatisch deine Einstellungen geladen
5. Du kannst sofort mit deinem Wakeword sprechen ✅

---

## Tipps & Tricks 💡

### Schneller Neustart
Falls JARVIS mal nicht reagiert:
1. Öffne Settings
2. Überprüfe deine Einstellungen
3. Klick "Save Settings"
4. JARVIS startet mit deinen Einstellungen neu ✅

### Verschiedene Sprachen
Wenn du mehrsprachig bist:
1. Ändere Sprache zu "Deutsch"
2. Speichern
3. JARVIS hört jetzt auf Deutsch 🇩🇪
4. Später: Ändere zu "Englisch"
5. JARVIS hört jetzt auf Englisch 🇬🇧

### Test-Voice Funktion
Möchte eine andere Stimme?
1. Klick Stimmen-Dropdown
2. Wähle neue Stimme
3. Klick "Test Voice" um zu hören
4. Wenn dir gefällt: "Save Settings" ✅

### Voice Parameter tunen
JARVIS spricht zu schnell? 🏃
1. Senke **Rate** auf 0.7
2. Klick "Test Voice"
3. Spar dir die Ohren 👂
4. "Save Settings"

---

## Häufige Fragen

### F: Wo werden meine Einstellungen gespeichert?
**A:** Im Browser, lokal auf deinem Computer. Nicht auf einem Server. 🔒

### F: Was passiert bei Browser-Wechsel?
**A:** Jeder Browser speichert eigene Einstellungen. Chrome ≠ Firefox.

### F: Kann ich meine Einstellungen sichern?
**A:** Ja! Öffne DevTools (F12) → Application → Local Storage → Kopiere die Werte

### F: Funktioniert das auch im Inkognito-Modus?
**A:** Nein, aber JARVIS funktioniert trotzdem mit Standard-Einstellungen.

### F: Was wenn ich meine Einstellungen löschen möchte?
**A:** Ganz einfach - Browser Cache/Cookies löschen. Oder siehe Troubleshooting.

### F: Kann ich mehrere Profile speichern?
**A:** Noch nicht - TODO für zukünftige Versionen 📋

---

## Troubleshooting 🔧

### Problem: Einstellungen werden nicht gespeichert

**Ursache 1:** Privatmodus / Inkognito
- **Lösung:** Nutze normales Browser-Fenster

**Ursache 2:** localStorage ist deaktiviert
- **Lösung:** Aktiviere Cookies in Browser-Einstellungen
  - Chrome: Settings → Privacy → Site Settings → Cookies
  - Firefox: Settings → Privacy → Cookies → Allow

**Ursache 3:** Speicher ist voll
- **Lösung:** Browser Cache leeren und versuchen wieder

### Problem: Einstellungen werden beim Reload nicht geladen

**Überprüfung:**
1. Öffne DevTools (F12)
2. Gehe zu Application / Storage → Local Storage
3. Suchst du nach "jarvis_user_preferences"?
   - **Ja:** Müssten geladen werden, check Console logs
   - **Nein:** Noch nicht gespeichert oder gelöscht

**Lösung:**
1. Settings neu öffnen
2. Alles neu einstellen
3. "Save Settings" klicken
4. Browser reload

### Problem: Nur manche Einstellungen werden geladen

**Überprüfung:**
1. DevTools öffnen (F12)
2. Console Tab
3. Suche nach "[SettingsState]" Meldungen
4. Fehler sollten dort angezeigt sein

**Lösung:**
- Browser Cache löschen
- Settings noch einmal speichern
- Neuer Versuch

---

## Was passiert im Hintergrund?

### Speichern 💾
```
User klickt "Save Settings"
        ↓
JARVIS sendet Einstellungen an Server
        ↓
JARVIS speichert auch lokal im Browser
        ↓
Bestätigung angezeigt ✅
```

### Laden 📂
```
Browser öffnet JARVIS
        ↓
App startet
        ↓
Lädt Voice Parameter aus lokalem Speicher
        ↓
Aktiviert Voice Recognition
        ↓
Lädt Wakeword & Sprache
        ↓
JARVIS ist bereit! ✅
```

---

## Datenschutz & Sicherheit 🔒

### Was speichert JARVIS lokal?
- ✅ Deine Einstellungen (Wakeword, Sprache, etc.)
- ✅ Voice Parameter (Rate, Pitch, Volume)

### Was speichert JARVIS NICHT lokal?
- ❌ Deine Sprach-Aufnahmen
- ❌ Server Anmelde-Daten
- ❌ (Optional: API Keys - sollten verschlüsselt sein)

### Sicherheit
- Einstellungen sind im Browser speichert (nicht verschlüsselt)
- Dein Computer muss also geschützt sein
- Teile deine Eingaben nicht mit anderen! 🙈

---

## Support 📞

**Falls etwas nicht funktioniert:**

1. **Überprüfe Browser Console** (F12 → Console)
   - Suche nach Fehlermeldungen
   - Kopiere Fehler und poste ihn

2. **Browser Cache löschen**
   - Chrome: Strg+Shift+Del
   - Firefox: Strg+Shift+Del
   - Safari: Cmd+Y

3. **JARVIS neustarten**
   - Seite reload (F5)
   - Oder Browser vollständig neu öffnen

4. **Kontaktiere den Support**
   - GitHub Issues
   - Email an Entwickler

---

## Weitere Ressourcen 📚

- **Technische Details:** [SETTINGS_PERSISTENCE_GUIDE.md](./SETTINGS_PERSISTENCE_GUIDE.md)
- **Test Guide:** [SETTINGS_TEST_GUIDE.md](./SETTINGS_TEST_GUIDE.md)
- **Implementierung:** [SETTINGS_IMPLEMENTATION_SUMMARY.md](./SETTINGS_IMPLEMENTATION_SUMMARY.md)

---

## Zusammenfassung ✨

**Die gute Nachricht:**
- ✅ Deine Einstellungen werden gespeichert
- ✅ Sie werden beim nächsten Start automatisch geladen
- ✅ Du musst nichts extra tun
- ✅ Es funktioniert auch ohne Internet (lokal)

**Probiere es jetzt aus:**
1. Öffne Settings
2. Ändere etwas (z.B. Wakeword)
3. Speichern
4. Browser reload
5. Deine Änderung ist noch da! 🚀

**Viel Spaß mit JARVIS!** 🎤✨

