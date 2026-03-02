# ⚡ JARVIS IF-Conditions Quick Reference

## ONE-PAGE CHEAT SHEET

### TEXT INPUT (app.js Zeile 199)
```javascript
IF (text && window.ws && window.ws.readyState === WebSocket.OPEN) {
    ✅ YES  → Send to server immediately
    ❌ NO   → Do nothing (silent)
}
```

**Conditions (ALL must be true):**
```
✓ text exists (not empty)
✓ window.ws object exists  
✓ WebSocket.readyState = 1 (OPEN)
```

**When FALSE:** User sees nothing, no error message

---

### VOICE DETECTION (voiceActivation.js onresult)
```javascript
IF (!isProcessing && fullTranscript.includes(CONFIG.wakeword)) {
    ✅ YES  → Extract and process command
    ❌ NO   → Keep listening
}
```

**Conditions (ALL must be true):**
```
✓ NOT currently processing
✓ "jarvis" found in speech
```

---

### VOICE COMMAND CHECK (voiceActivation.js extract)
```javascript
IF (commandText) {
    ✅ YES  → sendVoiceCommand() immediately
    ❌ NO   → startRecording() for more input
}
```

**Condition:**
```
✓ Text exists after wakeword
```

---

### VOICE SEND (voiceActivation.js sendVoiceCommand)
```javascript
IF (window.ws && window.ws.readyState === WebSocket.OPEN) {
    ✅ YES  → Send now (< 100ms)
    ❌ NO   → Start retry loop (max 30s)
}
```

**Conditions (BOTH must be true):**
```
✓ window.ws exists
✓ WebSocket.readyState = 1 (OPEN)
```

---

### VOICE RETRY (sendVoiceCommand retry loop)
```javascript
IF (window.ws && window.ws.readyState === WebSocket.OPEN) {
    ✅ YES  → Send now & break
} ELSE IF (retries >= 60) {
    ❌ TIMEOUT → Give up after 30s
} ELSE {
    ⏳ RETRY   → Wait 500ms, try again
}
```

---

## COMPARISON TABLE

| Stage | Text | Voice | If True | If False |
|-------|------|-------|---------|----------|
| **Trigger** | Click button | Wakeword | - | - |
| **Check 1** | WS ready? | Not processing? | SEND | Continue |
| **Check 2** | (N/A) | Has wakeword? | Extract | Keep listen |
| **Check 3** | (N/A) | Has command? | Send | Record |
| **Check 4** | WS ready? | WS ready? | Send now | Retry/Fail |

---

## DECISION TREE

```
TEXT INPUT
──────────
Button clicked?
  ├─ YES → Check WS
  │         ├─ Ready? → SEND ✅
  │         └─ Not ready? → Nothing ❌
  └─ NO → Wait for click


VOICE INPUT
───────────
Listening?
  └─ YES → Hear sound?
           └─ YES → Check wakeword
                    ├─ Found? → Extract command
                    │           ├─ Has text? → Check WS
                    │           │              ├─ Ready? → SEND ✅
                    │           │              └─ Not? → Retry (30s)
                    │           └─ No text? → Start recording
                    └─ Not found? → Keep listening
```

---

## STATE VALUES

### WebSocket.readyState
```
0 = CONNECTING  (trying to connect)
1 = OPEN        (connected & ready) ✅
2 = CLOSING     (closing connection)
3 = CLOSED      (disconnected)       ❌
```

### Voice States
```
isListening = true/false   (microphone active?)
isProcessing = true/false  (command being sent?)
isFinal = true/false       (word complete?)
```

---

## RETRY LOGIC

```
Condition: window.ws && readyState===OPEN
Retry: Every 500ms
Max attempts: 60
Total timeout: 30 seconds

Loop:
  Attempt 1-59:  Check → If fail → Wait 500ms → Retry
  Attempt 60:    Check → If fail → Timeout → Give up
```

---

## ERRORS & FIXES

```
PROBLEM: "Command sent" but server didn't receive
─────────────────────────────────────────────────

Cause 1: window.ws = undefined
  Before: IF (window.ws) → FALSE
  Fixed: Added window.ws = null; then window.ws = ws;

Cause 2: WebSocket state = 0 (CONNECTING)
  Before: IF (readyState===OPEN) → FALSE immediately
  Fixed: Added 30s retry loop with 500ms intervals

Cause 3: User impatient before WS connects
  Before: Timeout at 5 seconds
  Fixed: Extended to 30 seconds (60 retries × 500ms)
```

---

## MINI FLOW CHART

```
┌─────────────────────┐
│ INPUT               │
├─────────────────────┤
│ Text: Button click  │
│ Voice: Speak        │
└────────┬────────────┘
         │
         ▼
    ┌─────────────┐
    │ CHECK       │
    │ Conditions  │
    └────┬────┬───┘
         │    │
       YES   NO
         │    │
         ▼    ▼
       SEND  WAIT/RETRY
       ✅    or IGNORE ❌
```

---

## PSEUDO-CODE ALL PATHS

```
=== TEXT INPUT PATH ===
WHEN: Click send button
CONDITION: text && ws && ws.OPEN?
  YES → logMessage → ws.send(text)
  NO  → [nothing]
END

=== VOICE PATH 1: DETECTION ===
WHEN: User speaks
CONDITION: notProcessing && has(wakeword)?
  YES → extractCommand()
  NO  → continue listen
       CONDITION: has(command)?
         YES → GOTO VOICE PATH 2
         NO  → start recording (10s)
END

=== VOICE PATH 2: SEND ===
CONDITION: ws && ws.OPEN?
  YES → ws.send(command)
  NO  → RETRY LOOP:
        FOR i = 0 TO 60:
          CONDITION: ws && ws.OPEN?
            YES → ws.send(command) → BREAK
            NO  → WAIT 500ms → i++
        END FOR
        IF i >= 60: TIMEOUT
END
```

---

## IF-CONDITION STATISTICS

```
Total IF conditions: 6
  Text input: 1
  Voice wakeword: 2
  Voice extraction: 1
  Voice send: 3 (direct + 2 in retry)

Critical conditions: 3
  ✓ window.ws && readyState===OPEN (appears 2x)
  ✓ !isProcessing && includes(wakeword)
  ✓ commandText (not empty)

Most common: WebSocket ready check
Most complex: Voice retry loop
Simplest: Command extraction check
```

---

## KEY POINTS

✅ **Text:** Simple, direct, no fallback
✅ **Voice:** Complex, with retry logic
✅ **Both:** Check WebSocket state = 1 (OPEN)
✅ **Text:** Silent failure if WS not ready
✅ **Voice:** Auto-retries up to 30 seconds
✅ **Voice:** More resilient than text

---

## DEBUGGING CHECKLIST

```
IF Text not sending:
  [ ] Check: window.ws exists
  [ ] Check: window.ws.readyState === 1
  [ ] Check: text input not empty
  [ ] Check: Server receiving on endpoint

IF Voice not sending:
  [ ] Check: Wakeword detected in logs
  [ ] Check: Command extracted correctly
  [ ] Check: window.ws exists
  [ ] Check: WebSocket connected
  [ ] Check: Retry loop running (30s)
  [ ] Check: Server receiving command

IF Retry not working:
  [ ] Check: maxRetries = 60 (not 10)
  [ ] Check: interval = 500ms
  [ ] Check: sent flag prevents double-send
  [ ] Check: connectWebSocket() called
```

---

**Remember:** All conditions must be TRUE (&&) unless otherwise specified!

