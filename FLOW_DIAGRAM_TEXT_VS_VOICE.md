# 📊 JARVIS Ablaufdiagramm - Text Input vs Voice Activation

## 1️⃣ TEXT INPUT Ablauf

```
┌─────────────────────────────────────────────────────────────────┐
│ USER öffnet JARVIS und tippt Text                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │ DOMContentLoaded Event            │
        │ - connectWebSocket()              │
        │ - fetchConfig()                   │
        │ - loadVoiceParamsFromStorage()    │
        └──────────────────────┬───────────┘
                               │
                               ▼
        ┌──────────────────────────────────┐
        │ app.js                           │
        │ window.ws = null (initialisiert) │
        │ window.ws = ws (bei connect)     │
        └──────────────────────┬───────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────┐
        │ User tippt Text in Input-Feld           │
        │ "hallo welt"                            │
        └──────────────────────┬───────────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────┐
        │ User klickt "Send" Button                │
        │ sendBtn.addEventListener('click', () => │
        └──────────────────────┬───────────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────┐
        │ IF (text && window.ws &&                 │
        │     window.ws.readyState === OPEN)       │
        │                                          │
        │ TRUE: ✅                                 │
        │ - logMessage('USER', text)               │
        │ - window.ws.send(text)                   │
        │ - textInput.value = ''                   │
        │ - startThinking()                        │
        │                                          │
        │ FALSE: ❌                                │
        │ - Nichts passiert                        │
        │ - Error in Console                       │
        └──────────────────────┬───────────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────┐
        │ WebSocket send                           │
        │ window.ws.send("hallo welt")             │
        └──────────────────────┬───────────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────┐
        │ Server empfängt Text-Befehl             │
        │ Verarbeitet und antwortet               │
        └──────────────────────┬───────────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────┐
        │ ws.onmessage                             │
        │ - logMessage('JARVIS', response)         │
        │ - stopThinking()                         │
        │ - speakText(response) oder playAudio()   │
        └──────────────────────┬───────────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────┐
        │ Chat zeigt:                              │
        │ USER: hallo welt                         │
        │ JARVIS: [Response]                       │
        └──────────────────────────────────────────┘
```

---

## 2️⃣ VOICE ACTIVATION Ablauf

```
┌─────────────────────────────────────────────────────────────────┐
│ USER öffnet JARVIS und spricht                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │ voiceActivation.js Auto-Init         │
        │ DOMContentLoaded Event                │
        │ - initializeVoiceActivation()         │
        │ - loadSavedPreferences()              │
        │ - recognizer.start()                  │
        └──────────────────────┬────────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────┐
        │ User fordert Mikrophon-Berechtigung │
        │ - requestMicrophoneAndStart()        │
        │ - showMicButton() oder               │
        │ - startListening()                   │
        └──────────────────────┬────────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────┐
        │ Voice Recognition lauscht              │
        │ recognizer.onresult = (event) => {      │
        │   IF (event.resultIndex === 0)          │
        │     - finalTranscript = ''              │
        │     - interimTranscript = ''            │
        └──────────────────────┬───────────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────┐
        │ User spricht: "Hey Jarvis hallo welt"   │
        │                                         │
        │ FOR loop über results:                  │
        │   IF (isFinal)                          │
        │     finalTranscript += transcript       │
        │   ELSE                                  │
        │     interimTranscript += transcript     │
        └──────────────────────┬───────────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────┐
        │ fullTranscript = finalTranscript +       │
        │                  interimTranscript       │
        │ fullTranscript = "hey jarvis hallo       │
        │                   welt" (lowercase)      │
        │                                          │
        │ IF (!isProcessing &&                     │
        │     fullTranscript.includes(             │
        │     CONFIG.wakeword))                    │
        │                                          │
        │ TRUE: ✅ WAKEWORD ERKANNT               │
        │                                          │
        │ FALSE: ❌ Warte auf Wakeword            │
        └──────────────────────┬───────────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────┐
        │ Extrahiere Command nach Wakeword        │
        │                                          │
        │ commandText =                            │
        │   fullTranscript.substring(              │
        │   fullTranscript.indexOf(CONFIG.wakeword)│
        │   + CONFIG.wakeword.length).trim()       │
        │                                          │
        │ commandText = "hallo welt"               │
        │                                          │
        │ IF (commandText)                         │
        │   - sendVoiceCommand(commandText)        │
        │ ELSE                                     │
        │   - startRecording()                     │
        └──────────────────────┬───────────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────┐
        │ sendVoiceCommand("hallo welt")           │
        │                                          │
        │ isProcessing = true                      │
        │ recognizer.stop()                        │
        │ window.logMessage('USER (Voice)',        │
        │   command)                               │
        └──────────────────────┬───────────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────┐
        │ WebSocket Status Check:                  │
        │                                          │
        │ IF (window.ws &&                         │
        │     window.ws.readyState ===             │
        │     WebSocket.OPEN)                      │
        │                                          │
        │ TRUE: ✅ SOFORT SENDEN                  │
        │ - window.ws.send(command)                │
        │ - window.startThinking()                 │
        │ - Log: ✅ Command sent immediately      │
        │ - setTimeout: restart listening          │
        │                                          │
        │ FALSE: ⚠️ WS NICHT READY               │
        │ - Rufe connectWebSocket() auf            │
        │ - Rufe fetchConfig() auf                 │
        │ - Starte Retry Loop                      │
        └──────────────────────┬───────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
        ┌───────▼─────────┐         ┌────────▼────────┐
        │ TRUE PATH       │         │ FALSE PATH      │
        │ WS READY        │         │ WS NOT READY    │
        └───────┬─────────┘         └────────┬────────┘
                │                           │
                ▼                           ▼
        ┌──────────────────┐     ┌─────────────────────────┐
        │ INSTANT SEND     │     │ RETRY LOOP              │
        │ < 100ms          │     │ maxRetries = 60         │
        │                  │     │ interval = 500ms        │
        │ ws.send() ✅     │     │ timeout = 30s           │
        │                  │     │                         │
        │ ✅ COMPLETE      │     │ IF (window.ws &&        │
        │                  │     │     readyState===OPEN)  │
        │ restart listen.  │     │   - ws.send() ✅        │
        │ in 1s            │     │   - break retry         │
        └──────────────────┘     │                         │
                                 │ ELSE IF (retries>=60)   │
                                 │   - Timeout Error ❌    │
                                 │   - stop retry          │
                                 │                         │
                                 │ ELSE                    │
                                 │   - Warte 500ms         │
                                 │   - Retry nächste Runde │
                                 │   - Log: Retry X/60     │
                                 └────────────┬────────────┘
                                              │
                                              ▼
                ┌─────────────────────────────────────────┐
                │ Server empfängt Voice-Befehl           │
                │ Verarbeitet und antwortet              │
                └─────────────────────────┬───────────────┘
                                          │
                                          ▼
                ┌─────────────────────────────────────────┐
                │ ws.onmessage                            │
                │ - logMessage('JARVIS', response)        │
                │ - stopThinking()                        │
                │ - speakText(response)                   │
                └─────────────────────────┬───────────────┘
                                          │
                                          ▼
                ┌─────────────────────────────────────────┐
                │ Chat zeigt:                             │
                │ USER (Voice): hallo welt                │
                │ JARVIS: [Response]                      │
                │ JARVIS spricht Response laut            │
                └─────────────────────────────────────────┘
```

---

## 3️⃣ VERGLEICH: Text vs Voice

```
┌─────────────────────┬──────────────────────────────────────────┐
│ PUNKT               │ TEXT INPUT      │ VOICE ACTIVATION       │
├─────────────────────┼─────────────────┼────────────────────────┤
│ Eingabe             │ Keyboard/Typing │ Mikrophon/Sprechen    │
│ Initiator           │ Click Button    │ Wakeword erkennen     │
│ Initial IF          │ WS ready?       │ Wakeword im Text?     │
│ IF TRUE             │ Sofort send()   │ Command extrahieren   │
│ IF FALSE            │ Ignoriert       │ Conditional send()    │
│ Retry Logic         │ Nein            │ Ja (bis 30s)          │
│ Recognizer Status   │ N/A             │ start/stop/restart    │
│ Response Handling   │ Chat + Audio    │ Chat + Audio (sofort) │
│ User Flow           │ Schnell         │ Natürlicher           │
└─────────────────────┴─────────────────┴────────────────────────┘
```

---

## 4️⃣ IF-BEDINGUNGEN ÜBERSICHT

### Text Input (app.js)
```javascript
IF (text && window.ws && window.ws.readyState === WebSocket.OPEN) {
    // ✅ EXECUTE
    logMessage('USER', text);
    window.ws.send(text);
    textInput.value = '';
    startThinking();
} ELSE {
    // ❌ DO NOTHING
}
```

### Voice: Wakeword Detection (voiceActivation.js)
```javascript
IF (!isProcessing && 
    fullTranscript.includes(CONFIG.wakeword)) {
    // ✅ WAKEWORD FOUND
    
    commandText = extract_text_after_wakeword();
    
    IF (commandText) {
        // ✅ SEND IMMEDIATELY
        sendVoiceCommand(commandText);
    } ELSE {
        // ✅ WAIT FOR MORE INPUT
        startRecording();
    }
} ELSE {
    // ❌ NO WAKEWORD - CONTINUE LISTENING
}
```

### Voice: Send Command (voiceActivation.js)
```javascript
IF (window.ws && 
    window.ws.readyState === WebSocket.OPEN) {
    // ✅ SEND IMMEDIATELY (< 100ms)
    window.ws.send(command);
    window.startThinking();
    console.log('✅ Command sent immediately');
    
    // Restart listening in 1s
    setTimeout(() => {
        startListening();
    }, 1000);
    
} ELSE {
    // ⚠️ WS NOT READY - RETRY
    console.log('⚠️ WebSocket not ready, retrying...');
    
    IF (window.connectWebSocket) {
        window.connectWebSocket();
    }
    
    IF (window.fetchConfig) {
        window.fetchConfig();
    }
    
    // Retry Loop
    const maxRetries = 60;
    let retries = 0;
    let sent = false;
    
    setInterval(() => {
        IF (sent) {
            clearInterval(retryInterval);
            return;
        }
        
        IF (window.ws && 
            window.ws.readyState === WebSocket.OPEN) {
            // ✅ NOW SEND
            window.ws.send(command);
            sent = true;
            console.log('✅ Command sent (after retry)');
            
            // Restart listening
            startListening();
            
        } ELSE IF (retries >= maxRetries) {
            // ❌ TIMEOUT AFTER 30s
            console.error('❌ Timeout');
            sent = true;
            startListening(); // Resume anyway
            
        } ELSE {
            // ⏳ WAIT & RETRY
            retries++;
            // Loop continues...
        }
    }, 500);
}
```

---

## 5️⃣ STATE MACHINE

```
TEXT INPUT STATE:
──────────────────

[IDLE]
  │
  └─→ User tippt Text
      │
      └─→ [CHECKING_WS]
          │
          ├─ IF WS OPEN ──→ [SENDING] ──→ [THINKING] ──→ [WAITING_RESPONSE] ──→ [IDLE]
          │
          └─ IF WS CLOSED ──→ [IDLE] (nothing happens)


VOICE ACTIVATION STATE:
───────────────────────

[LISTENING] 
  │
  ├─→ User speaks without wakeword
  │   │
  │   └─→ Continue [LISTENING]
  │
  └─→ User speaks with wakeword
      │
      ├─ IF command after wakeword ──→ [PROCESSING]
      │                               │
      │                               └─→ [CHECKING_WS]
      │                                   │
      │                                   ├─ IF WS OPEN ──→ [SENDING] ──→ [THINKING] ──→ [WAITING_RESPONSE] ──→ [LISTENING]
      │                                   │
      │                                   └─ IF WS CLOSED ──→ [RETRYING] ──→ (after max 30s) ──→ [LISTENING]
      │
      └─ IF only wakeword ──→ [RECORDING]
                             │
                             └─→ [TIMEOUT/READY]
                                 │
                                 └─→ [SENDING] ──→ [THINKING] ──→ [LISTENING]
```

---

## 6️⃣ KRITISCHE IF-BEDINGUNGEN

| Bedingung | Ort | Folge wenn TRUE | Folge wenn FALSE |
|-----------|-----|-----------------|------------------|
| `text && window.ws && readyState===OPEN` | app.js | Text wird gesendet | Nichts |
| `!isProcessing && fullTranscript.includes(wakeword)` | VA | Command wird extrahiert | Weiter hören |
| `commandText` (nach Wakeword) | VA | Sofort senden | Recording starten |
| `window.ws && readyState===OPEN` (Voice) | VA | Sofort senden | Retry starten |
| `window.ws && readyState===OPEN` (Retry) | VA | Sofort senden | Continue retry |
| `retries >= maxRetries` (Retry) | VA | Timeout & stop | Continue retry |

---

## 7️⃣ FEHLERSZENARIEN

```
SZENARIO 1: WebSocket nicht verbunden bei Text-Input
─────────────────────────────────────────────────────
User tippt "test"
  │
  └─→ IF (text && window.ws && readyState===OPEN)
      │
      └─→ FALSE (ws ist null/closed)
          │
          └─→ ❌ Text wird NICHT gesendet
          └─→ ❌ Kein Feedback für User

SZENARIO 2: WebSocket verbindet sich während Voice-Input
──────────────────────────────────────────────────────────
User spricht "Hey Jarvis test"
  │
  └─→ Wakeword erkannt ✅
      │
      └─→ IF (window.ws && readyState===OPEN)
          │
          └─→ FALSE (ws state = 0: CONNECTING)
              │
              └─→ Retry Loop startet
                  │
                  ├─ Retry 1: state=0 (connecting) → wait
                  ├─ Retry 2: state=0 (connecting) → wait
                  ├─ Retry 3: state=1 (OPEN) ✅
                  │   │
                  │   └─→ Command wird gesendet ✅

SZENARIO 3: WebSocket bleibt disconnected für 30s+
──────────────────────────────────────────────────
User spricht "Hey Jarvis test"
  │
  └─→ Wakeword erkannt ✅
      │
      └─→ Retry Loop startet
          │
          ├─ Retry 1-59: state=3 (CLOSED) → wait
          │
          └─ Retry 60: retries >= maxRetries
              │
              └─→ ❌ Timeout nach 30s
              └─→ Resume listening anyway
              └─→ User kann erneut sprechen
```

---

## 8️⃣ ZUSAMMENFASSUNG

### Text Path (Einfach & Direkt)
```
Klick → Check WS → IF OPEN: Send | ELSE: Nothing
```

### Voice Path (Komplex & Robust)
```
Listen → Detect Wakeword → Extract Command → Check WS 
  → IF OPEN: Send 
  → ELSE: Retry bis 30s → IF Connected: Send | ELSE: Timeout
```

**Key Difference:** Voice hat Fallback-Logik, Text nicht.

