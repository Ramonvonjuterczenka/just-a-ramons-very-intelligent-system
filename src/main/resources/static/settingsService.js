// settingsService.js
// Lightweight settings service with timeout + retry and AbortController support.
// Exposes window.SettingsService with methods: getConfig(), getModels(provider, signal), saveConfig(payload), testConfig()

(function () {
    const DEFAULT_TIMEOUT = 8000;

    function timeoutFetch(url, options = {}, timeout = DEFAULT_TIMEOUT) {
        const controller = options.signal ? null : new AbortController();
        const signal = options.signal || (controller && controller.signal);
        const fetchPromise = fetch(url, Object.assign({}, options, { signal }));

        if (!controller) return fetchPromise;

        const timeoutId = setTimeout(() => controller.abort(), timeout);
        return fetchPromise.finally(() => clearTimeout(timeoutId));
    }

    async function withRetry(fn, retries = 1) {
        let lastErr;
        for (let i = 0; i <= retries; i++) {
            try {
                return await fn();
            } catch (e) {
                lastErr = e;
                // small backoff
                await new Promise(r => setTimeout(r, 200 * (i + 1)));
            }
        }
        throw lastErr;
    }

    async function getConfig() {
        return withRetry(async () => {
            const res = await timeoutFetch('/api/config', {}, DEFAULT_TIMEOUT);
            if (!res.ok) throw new Error('Failed to fetch config');
            return res.json();
        });
    }

    async function getModels(provider, { signal } = {}) {
        return withRetry(async () => {
            const url = `/api/config/models?provider=${encodeURIComponent(provider)}`;
            const res = await timeoutFetch(url, { signal }, DEFAULT_TIMEOUT);
            if (!res.ok) {
                const txt = await res.text().catch(() => '');
                throw new Error(`Failed to fetch models: ${res.status} ${txt}`);
            }
            return res.json();
        });
    }

    async function saveConfig(payload) {
        return withRetry(async () => {
            const res = await timeoutFetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }, DEFAULT_TIMEOUT);
            if (!res.ok) {
                const txt = await res.text().catch(() => '');
                const err = new Error('Failed to save config ' + res.status);
                err.details = txt;
                throw err;
            }
            return res.json();
        });
    }

    async function testConfig() {
        return withRetry(async () => {
            const res = await timeoutFetch('/api/config/test', {}, DEFAULT_TIMEOUT);
            if (!res.ok) throw new Error('Test endpoint returned ' + res.status);
            const data = await res.json();
            // normalize
            return { success: (data.success === true || data.success === 'true'), message: data.message || '' };
        });
    }

    window.SettingsService = {
        getConfig,
        getModels,
        saveConfig,
        testConfig
    };
})();

