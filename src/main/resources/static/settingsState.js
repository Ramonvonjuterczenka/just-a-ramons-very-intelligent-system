// settingsState.js
// Minimal event emitter + state container for settings UI
// Includes LocalStorage persistence for user preferences

(function () {
    const listeners = {};
    const state = {
        config: null
    };

    const STORAGE_KEY = 'jarvis_user_preferences';
    const VOICE_PARAMS_KEY = 'jarvis_voice_params';

    function on(evt, cb) {
        listeners[evt] = listeners[evt] || new Set();
        listeners[evt].add(cb);
    }

    function off(evt, cb) {
        if (!listeners[evt]) return;
        listeners[evt].delete(cb);
    }

    function emit(evt, data) {
        if (!listeners[evt]) return;
        for (const cb of Array.from(listeners[evt])) {
            try { cb(data); } catch (e) { console.error('settingsState listener error', e); }
        }
    }

    function setConfig(cfg) {
        state.config = cfg;
        emit('configChanged', cfg);
    }

    function getConfig() { return state.config; }

    /**
     * Save user preferences to LocalStorage
     * Stores: wakeword, language, microphone, voiceId, voiceParams, etc.
     */
    function savePreferences(prefs) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
            console.log('[SettingsState] ✅ Preferences saved to LocalStorage:', prefs);
        } catch (e) {
            console.error('[SettingsState] ❌ Failed to save preferences:', e.message);
        }
    }

    /**
     * Load user preferences from LocalStorage
     */
    function loadPreferences() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const prefs = JSON.parse(saved);
                console.log('[SettingsState] ✅ Preferences loaded from LocalStorage:', prefs);
                return prefs;
            }
        } catch (e) {
            console.error('[SettingsState] ❌ Failed to load preferences:', e.message);
        }
        return null;
    }

    /**
     * Save voice parameters to LocalStorage
     */
    function saveVoiceParams(params) {
        try {
            localStorage.setItem(VOICE_PARAMS_KEY, JSON.stringify(params));
            console.log('[SettingsState] ✅ Voice parameters saved:', params);
        } catch (e) {
            console.error('[SettingsState] ❌ Failed to save voice params:', e.message);
        }
    }

    /**
     * Load voice parameters from LocalStorage
     */
    function loadVoiceParams() {
        try {
            const saved = localStorage.getItem(VOICE_PARAMS_KEY);
            if (saved) {
                const params = JSON.parse(saved);
                console.log('[SettingsState] ✅ Voice parameters loaded:', params);
                return params;
            }
        } catch (e) {
            console.error('[SettingsState] ❌ Failed to load voice params:', e.message);
        }
        return null;
    }

    /**
     * Clear all stored preferences
     */
    function clearPreferences() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(VOICE_PARAMS_KEY);
            console.log('[SettingsState] ✅ All preferences cleared');
        } catch (e) {
            console.error('[SettingsState] ❌ Failed to clear preferences:', e.message);
        }
    }

    window.SettingsState = {
        on,
        off,
        emit,
        setConfig,
        getConfig,
        savePreferences,
        loadPreferences,
        saveVoiceParams,
        loadVoiceParams,
        clearPreferences
    };
})();

