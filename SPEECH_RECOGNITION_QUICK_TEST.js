// 🎤 JARVIS Speech Recognition - Quick Test Console Commands
// Copy & paste diese Commands in die Browser-Konsole (F12) um zu testen

// ============================================
// 1. SETUP & VERIFY
// ============================================

// Prüfe ob voiceActivation.js geladen wurde
console.clear();
console.log('🔍 JARVIS Speech Recognition - Quick Test');
console.log('==========================================');
console.log('');

// Prüfe Web Speech API Support
console.log('1️⃣ Check Web Speech API Support:');
console.log('Type:', typeof (window.SpeechRecognition || window.webkitSpeechRecognition));
console.log('');

// Prüfe VoiceActivation Module
console.log('2️⃣ Check Voice Activation Module:');
console.log('Module:', typeof window.VoiceActivation);
console.log('Ready:', window.voiceActivationReady);
console.log('');

// Prüfe aktuelle Konfiguration
console.log('3️⃣ Current Configuration:');
window.VoiceActivation && console.log(window.VoiceActivation.getConfig());
console.log('');

// ============================================
// 2. REQUEST MICROPHONE PERMISSION
// ============================================

console.log('4️⃣ To start testing:');
console.log('Run this in console:');
console.log('window.VoiceActivation.requestPermission()');
console.log('');
console.log('Then wait for browser dialog asking for microphone access.');
console.log('');

// ============================================
// 3. MANUAL START (after permission granted)
// ============================================

console.log('5️⃣ After permission granted, start listening:');
console.log('window.VoiceActivation.start()');
console.log('');
console.log('📢 Now speak "JARVIS" loudly and clearly!');
console.log('');

// ============================================
// 4. CHANGE LANGUAGE (OPTIONAL)
// ============================================

console.log('6️⃣ To test different language:');
console.log('window.VoiceActivation.setLanguage("de-DE")  // German');
console.log('window.VoiceActivation.setLanguage("fr-FR")  // French');
console.log('window.VoiceActivation.setLanguage("es-ES")  // Spanish');
console.log('window.VoiceActivation.setLanguage("en-US")  // English US');
console.log('window.VoiceActivation.setLanguage("en-GB")  // English UK');
console.log('');

// ============================================
// 5. WATCH FOR LOGS
// ============================================

console.log('7️⃣ Watch for these logs when speaking:');
console.log('[VA] 📡 onresult event fired');
console.log('[VA] Result[0] isFinal=... confidence=... transcript="..."');
console.log('[VA] 🎤 FULL TRANSCRIPT: "..."');
console.log('[VA] 🌍 LANGUAGE CONFIG: en-US');
console.log('');

console.log('✅ If you see these logs, speech recognition is working!');
console.log('');

// ============================================
// 6. STOP LISTENING
// ============================================

console.log('8️⃣ To stop listening:');
console.log('window.VoiceActivation.stop()');
console.log('');

// ============================================
// 7. ADDITIONAL COMMANDS
// ============================================

console.log('🔧 Additional Commands:');
console.log('window.VoiceActivation.init()              // Reinitialize');
console.log('window.VoiceActivation.isListening()       // Check if listening');
console.log('window.VoiceActivation.setWakeword("hello") // Change wakeword');
console.log('window.VoiceActivation.toggleDebug()       // Toggle debug mode');
console.log('');

// ============================================
// TROUBLESHOOTING
// ============================================

console.log('⚠️ TROUBLESHOOTING:');
console.log('');
console.log('If [VA] logs are NOT appearing:');
console.log('1. Check browser compatibility (Chrome/Edge/Safari needed)');
console.log('2. Reload page: Ctrl+F5 (clear cache)');
console.log('3. Check browser console for any errors');
console.log('4. Check browser microphone settings');
console.log('');

console.log('If speech is NOT recognized:');
console.log('1. Speak clearly and loudly');
console.log('2. Check background noise levels');
console.log('3. Try different language: setLanguage("de-DE")');
console.log('4. Check browser microphone permissions');
console.log('');

