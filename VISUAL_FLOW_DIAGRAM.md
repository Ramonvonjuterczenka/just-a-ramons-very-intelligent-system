# 🎯 JARVIS Input Processing - Visuelles Flowchart

## GESAMTÜBERSICHT - Side by Side

```
╔════════════════════════════════════════════════════════════════════════════════════╗
║                          JARVIS INPUT PROCESSING                                   ║
║                    TEXT INPUT vs VOICE ACTIVATION                                  ║
╚════════════════════════════════════════════════════════════════════════════════════╝


┌─────────────────────────────────────────┬────────────────────────────────────────┐
│         TEXT INPUT FLOW                 │      VOICE ACTIVATION FLOW              │
├─────────────────────────────────────────┼────────────────────────────────────────┤
│                                         │                                        │
│  ┌─────────────────────────────┐       │  ┌──────────────────────────────┐     │
│  │  USER TYPES TEXT            │       │  │  APP INITIALIZES             │     │
│  │  "hallo welt"               │       │  │  - SpeechRecognition init    │     │
│  └──────────────┬──────────────┘       │  │  - loadPreferences()         │     │
│                 │                      │  │  - requestMicrophoneAccess   │     │
│                 ▼                      │  └──────────────┬───────────────┘     │
│  ┌─────────────────────────────┐       │                 │                     │
│  │  USER CLICKS SEND BUTTON    │       │                 ▼                     │
│  │  sendBtn.click()            │       │  ┌──────────────────────────────┐     │
│  └──────────────┬──────────────┘       │  │  RECOGNIZER STARTS LISTENING │     │
│                 │                      │  │  updateStatusText()          │     │
│                 ▼                      │  │  recognizer.start()          │     │
│  ┌─────────────────────────────┐       │  │  "LISTENING FOR: JARVIS"     │     │
│  │  CHECK PRECONDITIONS:       │       │  └──────────────┬───────────────┘     │
│  │  ┌─────────────────────┐    │       │                 │                     │
│  │  │ IF (text exists AND │    │       │                 ▼                     │
│  │  │     window.ws AND   │    │       │  ┌──────────────────────────────┐     │
│  │  │     readyState===   │    │       │  │  USER SPEAKS                 │     │
│  │  │     OPEN)           │    │       │  │  "Hey Jarvis hallo welt"     │     │
│  │  └─────────────────────┘    │       │  └──────────────┬───────────────┘     │
│  └──────────────┬──────────────┘       │                 │                     │
│       ✅/❌    │                      │                 ▼                     │
│          ┌─────┴──────┐               │  ┌──────────────────────────────┐     │
│          │            │               │  │  RECOGNITION RESULT RECEIVED │     │
│          ▼            ▼               │  │  onresult(event)             │     │
│      ✅ YES      ❌ NO              │  │  Build transcript from        │     │
│          │            │               │  │  finalTranscript +           │     │
│          │            │               │  │  interimTranscript           │     │
│          │            ▼               │  └──────────────┬───────────────┘     │
│          │       ┌─────────┐          │                 │                     │
│          │       │ DO      │          │                 ▼                     │
│          │       │ NOTHING │          │  ┌──────────────────────────────┐     │
│          │       │ ❌      │          │  │  CHECK FOR WAKEWORD:         │     │
│          │       └─────────┘          │  │  ┌──────────────────────────┐│     │
│          │                            │  │  │ IF (!isProcessing AND    ││     │
│          ▼                            │  │  │ fullTranscript.includes( ││     │
│  ┌─────────────────────────────┐      │  │  │ CONFIG.wakeword))        ││     │
│  │  SEND TO SERVER             │      │  │  └──────────────────────────┘│     │
│  │  logMessage('USER', text)   │      │  └──────────────┬───────────────┘     │
│  │  window.ws.send(text)       │      │       ✅/❌    │                     │
│  │  startThinking()            │      │          ┌─────┴──────┐               │
│  │                             │      │          │            │               │
│  └──────────────┬──────────────┘      │          ▼            ▼               │
│                 │                      │      ✅ YES      ❌ NO              │
│                 ▼                      │          │            │               │
│  ┌─────────────────────────────┐      │          │            ▼               │
│  │  WAITING FOR SERVER         │      │          │    ┌────────────────┐     │
│  │  ws.onmessage triggered     │      │          │    │ CONTINUE       │     │
│  │                             │      │          │    │ LISTENING      │     │
│  └──────────────┬──────────────┘      │          │    └────────────────┘     │
│                 │                      │          │                          │
│                 ▼                      │          ▼                          │
│  ┌─────────────────────────────┐      │  ┌──────────────────────────────┐     │
│  │  PROCESS RESPONSE           │      │  │  EXTRACT COMMAND             │     │
│  │  - logMessage('JARVIS'...)  │      │  │  commandText = transcript    │     │
│  │  - stopThinking()           │      │  │  after wakeword              │     │
│  │  - speakText(response)      │      │  │                              │     │
│  │                             │      │  └──────────────┬───────────────┘     │
│  └──────────────┬──────────────┘      │                 │                     │
│                 │                      │                 ▼                     │
│                 ▼                      │  ┌──────────────────────────────┐     │
│  ┌─────────────────────────────┐      │  │  CHECK IF COMMAND EXISTS:    │     │
│  │  CHAT SHOWS:                │      │  │  ┌──────────────────────────┐│     │
│  │  USER: hallo welt           │      │  │  │ IF (commandText)         ││     │
│  │  JARVIS: [Response]         │      │  │  │  (has text after wake)   ││     │
│  │                             │      │  │  └──────────────────────────┘│     │
│  │  USER HEARS RESPONSE        │      │  └──────────────┬───────────────┘     │
│  │                             │      │       ✅/❌    │                     │
│  └─────────────────────────────┘      │          ┌─────┴──────┐               │
│                                        │          │            │               │
│                                        │          ▼            ▼               │
│                                        │      ✅ YES      ❌ NO              │
│                                        │          │            │               │
│                                        │          │            ▼               │
│                                        │          │    ┌────────────────┐     │
│                                        │          │    │ START          │     │
│                                        │          │    │ RECORDING MODE │     │
│                                        │          │    │ (await command)│     │
│                                        │          │    └────────┬───────┘     │
│                                        │          │             │              │
│                                        │          ▼             │              │
│                                        │  ┌──────────────────┐   │              │
│                                        │  │ SEND VOICE COMMAND   │              │
│                                        │  │ sendVoiceCommand()   │              │
│                                        │  │ (with retry logic)   │              │
│                                        │  └──────────┬─────────┘    │          │
│                                        │             │              │          │
│                                        │             ├──────────────┘          │
│                                        │             │                         │
│                                        │             ▼                         │
│                                        │  ┌──────────────────────────────┐     │
│                                        │  │  WS CHECK & SEND             │     │
│                                        │  │  ┌──────────────────────────┐│     │
│                                        │  │  │ IF (window.ws AND        ││     │
│                                        │  │  │     readyState===OPEN)   ││     │
│                                        │  │  └──────────────────────────┘│     │
│                                        │  └──────────────┬───────────────┘     │
│                                        │       ✅/❌    │                     │
│                                        │          ┌─────┴──────┐               │
│                                        │          │            │               │
│                                        │          ▼            ▼               │
│                                        │      ✅ YES      ❌ NO              │
│                                        │          │            │               │
│                                        │          ▼            ▼               │
│                                        │  ┌──────────────┐ ┌───────────┐     │
│                                        │  │ SEND NOW     │ │ RETRY     │     │
│                                        │  │ < 100ms      │ │ LOOP      │     │
│                                        │  │              │ │ (30 sec)  │     │
│                                        │  │ ws.send()    │ │           │     │
│                                        │  └──────┬───────┘ └─────┬─────┘     │
│                                        │         │               │            │
│                                        │         └───────────────┘            │
│                                        │                 │                    │
│                                        │                 ▼                    │
│                                        │  ┌──────────────────────────────┐   │
│                                        │  │  SERVER PROCESSES COMMAND    │   │
│                                        │  │  SENDS RESPONSE              │   │
│                                        │  └──────────────┬───────────────┘   │
│                                        │                 │                    │
│                                        │                 ▼                    │
│                                        │  ┌──────────────────────────────┐   │
│                                        │  │  DISPLAY IN CHAT:            │   │
│                                        │  │  USER (Voice): hallo welt    │   │
│                                        │  │  JARVIS: [Response]          │   │
│                                        │  │                              │   │
│                                        │  │  SPEAK RESPONSE (TTS)        │   │
│                                        │  │                              │   │
│                                        │  │  RESTART LISTENING           │   │
│                                        │  └──────────────────────────────┘   │
│                                        │                                     │
└─────────────────────────────────────────┴─────────────────────────────────────┘
```

---

## DETAILLIERTE IF-BEDINGUNGEN

### TEXT INPUT (app.js - Zeile 199)

```
┌────────────────────────────────────────────────────────────┐
│  TEXT INPUT CONDITION TREE                                  │
└────────────────────────────────────────────────────────────┘

                      START
                        │
                        ▼
        ┌──────────────────────────────┐
        │  User clicks SEND button     │
        │  sendBtn.addEventListener    │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Get text from input          │
        │ text = textInput.value.trim()│
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────────┐
        │  IF (text && window.ws &&                │
        │      window.ws.readyState===             │
        │      WebSocket.OPEN)                     │
        │                                          │
        │  3 Conditions, ALL must be TRUE:         │
        │  ✓ text has content                      │
        │  ✓ window.ws exists                      │
        │  ✓ WebSocket state = 1 (OPEN)            │
        └──────────────┬───────────────┘
                   ┌───┴────┐
                   │        │
            ✅ YES │        │ ❌ NO
                   │        │
                   ▼        ▼
        ┌──────────────┐  ┌──────────────┐
        │ SEND TEXT    │  │ DO NOTHING   │
        │              │  │              │
        │ Execute:     │  │ Function     │
        │ • logMessage │  │ ends silently│
        │ • ws.send()  │  │              │
        │ • clear input│  │ No error msg │
        │ • think()    │  │ (User sees: │
        │              │  │  nothing)    │
        │ ✅ SUCCESS   │  │              │
        └──────────────┘  └──────────────┘
        
Note: If window.ws is null/undefined, 
      the second condition fails and 
      nothing happens. Silent failure!
```

---

### VOICE ACTIVATION - Part 1: Wakeword Detection

```
┌────────────────────────────────────────────────────────────┐
│  VOICE WAKEWORD DETECTION (voiceActivation.js onresult)   │
└────────────────────────────────────────────────────────────┘

                      START
                        │
                        ▼
        ┌──────────────────────────────┐
        │ User speaks something        │
        │ "hey jarvis hallo welt"      │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  Build fullTranscript        │
        │  from result.isFinal parts   │
        │                              │
        │  fullTranscript =            │
        │  "hey jarvis hallo welt"     │
        │  (converted to lowercase)    │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌────────────────────────────────────────────┐
        │  IF (!isProcessing &&                      │
        │      fullTranscript.includes(              │
        │      CONFIG.wakeword))                     │
        │                                            │
        │  2 Conditions, BOTH must be TRUE:          │
        │  ✓ NOT currently processing (idle)         │
        │  ✓ Transcript includes wakeword            │
        │    (CONFIG.wakeword = "jarvis")            │
        └──────────────┬────────────────┘
                   ┌───┴────┐
                   │        │
            ✅ YES │        │ ❌ NO
                   │        │
                   ▼        ▼
        ┌──────────────────────────────┐
        │ WAKEWORD FOUND               │ Continue
        │ Log: WAKEWORD DETECTED       │ listening
        │                              │
        │ Extract command after:       │ No action
        │ commandText = substring      │
        │ after wakeword               │
        │                              │
        │ "hallo welt"                 │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌────────────────────────────────────────┐
        │  IF (commandText)                      │
        │  Check if anything after wakeword      │
        │                                        │
        │  1 Condition:                          │
        │  ✓ commandText not empty               │
        └──────────────┬────────────┘
                   ┌───┴────┐
                   │        │
            ✅ YES │        │ ❌ NO
                   │        │
                   ▼        ▼
        ┌──────────────────┐ ┌───────────────┐
        │ SEND NOW         │ │ RECORDING MODE│
        │                  │ │               │
        │ sendVoiceCommand │ │ User only said│
        │ ("hallo welt")   │ │ wakeword,     │
        │                  │ │ wait for more │
        │ → WS check       │ │               │
        │ → Send or retry  │ │ startRecording│
        │                  │ │ (10sec wait)  │
        └──────────────────┘ └───────────────┘
```

---

### VOICE ACTIVATION - Part 2: Send Command

```
┌────────────────────────────────────────────────────────────┐
│  VOICE SEND COMMAND (voiceActivation.js sendVoiceCommand) │
└────────────────────────────────────────────────────────────┘

                      START
                        │
                        ▼
        ┌──────────────────────────────┐
        │ sendVoiceCommand(command)    │
        │ called with: "hallo welt"    │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Stop recognizer              │
        │ recognizer.stop()            │
        │ Log message to chat          │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌────────────────────────────────────────────┐
        │  IF (window.ws &&                          │
        │      window.ws.readyState ===              │
        │      WebSocket.OPEN)                       │
        │                                            │
        │  2 Conditions, BOTH must be TRUE:          │
        │  ✓ window.ws exists                        │
        │  ✓ WebSocket state = 1 (OPEN)              │
        └──────────────┬────────────────┘
                   ┌───┴────┐
                   │        │
            ✅ YES │        │ ❌ NO
                   │        │
                   ▼        ▼
        ┌──────────────────────────────┐
        │ SEND IMMEDIATELY             │ RETRY LOOP
        │ < 100ms                      │
        │                              │
        │ window.ws.send(command)      │ Setup:
        │ startThinking()              │ • maxRetries = 60
        │ Log: ✅ sent immediately     │ • interval = 500ms
        │                              │ • max time = 30s
        │ Restart listening (1s delay) │
        │                              │ Start retrying:
        └──────────────────────────────┘ • Call connectWS()
                                         │ • Call fetchConfig()
                                         │
                                         └─→ setInterval(fn, 500ms)
                                            
        ┌────────────────────────────────────────────┐
        │  RETRY LOOP - Each 500ms:                  │
        │                                            │
        │  IF (window.ws &&                          │
        │      window.ws.readyState === OPEN)        │
        │    ✅ YES:                                 │
        │       • Send command                       │
        │       • Set sent = true                    │
        │       • Break loop                         │
        │       • Restart listening                  │
        │                                            │
        │  ELSE IF (retries >= 60)                   │
        │    ❌ TIMEOUT:                             │
        │       • Log timeout error                  │
        │       • Set sent = true                    │
        │       • Break loop                         │
        │       • Restart listening anyway           │
        │                                            │
        │  ELSE:                                     │
        │    ⏳ CONTINUE:                             │
        │       • retries++                          │
        │       • Loop continues                     │
        │       • Retry count increments             │
        └────────────────────────────────────────────┘
```

---

## BEDINGUNGEN ZUSAMMENFASSUNG

```
┌──────────────────────────────────────────────────────────────────┐
│ ALLE KRITISCHEN IF-BEDINGUNGEN IN JARVIS                         │
└──────────────────────────────────────────────────────────────────┘

CONTEXT             │ CONDITION                    │ WHEN TRUE          │ WHEN FALSE
────────────────────┼──────────────────────────────┼────────────────────┼────────────
Text Input          │ text &&                      │ Send to server     │ Do nothing
(app.js)            │ window.ws &&                 │ ✅ SUCCESS         │ ❌ FAIL
                    │ readyState===OPEN            │                    │

Voice Wakeword      │ !isProcessing &&             │ Extract command    │ Continue
(VA onresult)       │ includes(wakeword)           │ Check if has text  │ listening

Voice Command       │ commandText                  │ Send immediately   │ Start
Existence           │ (not empty)                  │ OR retry           │ recording
(VA extract)        │                              │                    │

Voice WS Check      │ window.ws &&                 │ Send < 100ms       │ Setup
(VA send)           │ readyState===OPEN            │ ✅ INSTANT         │ retry

Voice Retry         │ window.ws &&                 │ Send now ✅        │ Check
Loop                │ readyState===OPEN            │ Break retry        │ timeout

Voice Retry         │ retries >= 60                │ Timeout ❌         │ Continue
Timeout             │ (30 seconds elapsed)         │ Break retry        │ looping

────────────────────┴──────────────────────────────┴────────────────────┴────────────
```

---

## FEHLER-HANDLING IF-TREE

```
Error Scenario:
  WebSocket = null or undefined

Test:
  IF (window.ws && readyState===OPEN) → FALSE (fails at first part)

Result:
  • Condition fails
  • Code block skipped
  • No error message (!)
  • User sees nothing happen
  • Silent failure

Fix Applied:
  • window.ws = null (initialized)
  • window.ws = ws (set in connectWS)
  • Now always either exists or is checked


Error Scenario 2:
  WebSocket = CONNECTING (state 0)

Test:
  IF (window.ws && readyState===OPEN) → FALSE (state is 0, not 1)

Result:
  • Retry loop starts
  • 60 retries × 500ms = 30 seconds
  • Checks every 500ms
  • When state becomes 1: sends
  • If timeout: continues anyway

Success Path:
  Retry 3: state becomes 1 → SEND ✅
```

