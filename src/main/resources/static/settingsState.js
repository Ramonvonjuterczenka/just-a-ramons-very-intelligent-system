// settingsState.js
// Minimal event emitter + state container for settings UI

(function () {
    const listeners = {};
    const state = {
        config: null
    };

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

    window.SettingsState = { on, off, emit, setConfig, getConfig };
})();

