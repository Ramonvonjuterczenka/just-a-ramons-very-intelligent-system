# 🎤 JARVIS Voice Activation - Quick Start

## 🚀 Sofort Los!

### 1️⃣ Browser öffnen
```
http://localhost:8080
```

### 2️⃣ Mikrofon-Berechtigung erteilen
- Browser fragt: "Erlauben Sie Mikrofon-Zugriff?"
- Klick auf "Zulassen"

### 3️⃣ Sagen Sie "JARVIS"
```
"JARVIS, guten Morgen!"
```

✅ **Fertig!** JARVIS antwortet automatisch.

---

## 🎯 Beispiel-Befehle

```
"JARVIS, wie spät ist es?"
"JARVIS, was ist die Hauptstadt von Frankreich?"
"JARVIS, sag mir einen Witz"
"JARVIS, wie ist das Wetter?"
"JARVIS, stelle den Alarm auf 8 Uhr"
```

---

## 🎚️ Settings (Optional)

Klick auf **SETTINGS** → **Voice Activation Settings**

### Wakeword ändern
Standard: `jarvis`  
Beispiel: "AI", "Hey", "Echo"

### Sprache auswählen
- English (US) ← Standard
- English (UK)
- German
- French
- Spanish

### Debug Mode
Aktiviere um zu sehen, was erkannt wird

---

## 🔧 Mic-Button

**Klick auf Arc Reactor** um Voice Activation ein/auszuschalten:
- ✅ **An**: Status = "LISTENING FOR: JARVIS" (grün)
- ❌ **Aus**: Status = "VOICE ACTIVATION DISABLED" (rot)

---

## ⚠️ Falls es nicht funktioniert

### 1. Mikrofon-Test
- Windows: Systemeinstellungen → Datenschutz → Mikrofon
- Mac: Systemeinstellungen → Sicherheit → Mikrofon
- Linux: `alsamixer` oder `pavucontrol`

### 2. Browser-Test
- Öffne: https://www.google.com/intl/en/chrome/demos/speech.html
- Sag: "Hello"
- Falls es nicht funktioniert, nutze Chrome/Chromium

### 3. Browser-Berechtigung
- Chrome: ⋮ → Einstellungen → Datenschutz → Website-Einstellungen → Mikrofon
- Firefox: about:preferences → Datenschutz → Berechtigungen → Mikrofon

### 4. Debug Mode aktivieren
- Settings → Voice Activation Settings → ☑️ Debug Mode
- Öffne Browser-Konsole (F12)
- Du siehst dort, was erkannt wird

---

## 🎤 Tipps für beste Ergebnisse

✅ **Spreche deutlich**
```
❌ "Jarviiis... äh... wie... ist..."
✅ "JARVIS, wie ist das Wetter?"
```

✅ **Ruhiger Ort**
- Wenig Hintergrundgeräusche
- Fenster geschlossen (draußen ist zu laut)

✅ **Gutes Mikrofon**
- Externe Mikrofone besser als Laptop-Mikrofon
- Aber auch Laptop-Mikrofone funktionieren

✅ **Stabile Internet**
- Web Speech API braucht gute Verbindung
- WLAN empfohlen

---

## 🎨 Status-Farben

| Farbe | Status | Aktion |
|-------|--------|--------|
| 🟢 Grün | Lauscht auf "JARVIS" | Sprich jetzt |
| 🔴 Rot | Nimmt Befehl auf | Sag deinen Befehl |
| 🟠 Orange | Verarbeitet | Warte auf Antwort |

---

## 🎯 Workflow

```
1. Browser startet → Voice Activation lädt
2. Status: "LISTENING FOR: JARVIS" (grün)
3. Du sprichst: "JARVIS, wie spät ist es?"
4. Status: "RECORDING COMMAND..." (rot)
5. Browser erkennt Befehl
6. Status: "PROCESSING..." (orange)
7. JARVIS antwortet laut
8. Zurück zu Schritt 2
```

---

## 📱 Mobile / Tablet?

✅ **Funktioniert auch auf Mobile!**
- Android Chrome: Ja
- iPhone Safari: Bedingt (erfordert HTTPS)
- Tablet: Ja

---

## 🚀 Nächster Schritt: TTS Qualität

Falls JARVIS noch nicht gut genug klingt:

1. **Coqui TTS installieren** (Qualität ⭐⭐⭐⭐⭐)
   ```bash
   pip install TTS
   ```

2. Settings → TTS Provider → **COQUI**

3. JARVIS spricht jetzt viel professioneller! 🎤

---

## 📞 Probleme?

Siehe **VOICE_ACTIVATION_GUIDE.md** für detailliertes Troubleshooting

---

## 🎉 Fertig!

**Du kannst jetzt mit JARVIS sprechen! 🎤🤖**

Viel Spaß! 🚀

