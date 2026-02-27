// settingsUi.js
// Extracted settings UI logic. Depends on window.SettingsService and window.SettingsState.

(function () {
    const dom = {
        settingsBtn: document.getElementById('settings-btn'),
        settingsModal: document.getElementById('settings-modal'),
        closeSettingsBtn: document.getElementById('close-settings-btn'),
        saveSettingsBtn: document.getElementById('save-settings-btn'),
        llmSelect: document.getElementById('llm-select'),
        modelSelect: document.getElementById('model-select'),
        ttsSelect: document.getElementById('tts-select'),
        voiceSelect: document.getElementById('voice-select'),
        voiceGroup: document.getElementById('voice-group'),
        voiceParamsGroup: document.getElementById('voice-params-group'),
        voiceRateInput: document.getElementById('voice-rate'),
        voiceRateValue: document.getElementById('voice-rate-value'),
        voicePitchInput: document.getElementById('voice-pitch'),
        voicePitchValue: document.getElementById('voice-pitch-value'),
        voiceVolumeInput: document.getElementById('voice-volume'),
        voiceVolumeValue: document.getElementById('voice-volume-value'),
        testVoiceBtn: document.getElementById('test-voice-btn'),
        // Voice Activation Settings
        wakewordInput: document.getElementById('wakeword-input'),
        recognitionLangSelect: document.getElementById('recognition-lang'),
        voiceDebugToggle: document.getElementById('voice-debug-toggle'),
        geminiKeyGroup: document.getElementById('gemini-key-group'),
        geminiKeyInput: document.getElementById('gemini-key'),
        testConnBtn: document.getElementById('test-conn-btn'),
        testConnResult: document.getElementById('test-conn-result'),
        settingsError: document.getElementById('settings-error') || null,
        saveSpinner: document.getElementById('save-spinner') || null
    };

    let currentModelsAbort = null;

    function showModal() {
        dom.settingsModal.classList.remove('hidden');
        // focus first input
        setTimeout(() => dom.llmSelect && dom.llmSelect.focus(), 10);
    }

    function hideModal() {
        dom.settingsModal.classList.add('hidden');
    }

    function updateGeminiKeyVisibility() {
        if (!dom.llmSelect) return;
        if (dom.llmSelect.value === 'gemini') {
            dom.geminiKeyGroup.style.display = 'flex';
        } else {
            dom.geminiKeyGroup.style.display = 'none';
        }
    }

    function updateVoiceVisibility() {
        if (!dom.ttsSelect) return;
        if (dom.ttsSelect.value === 'browser') {
            dom.voiceGroup.style.display = 'flex';
            if (dom.voiceParamsGroup) dom.voiceParamsGroup.style.display = 'flex';
        } else {
            dom.voiceGroup.style.display = 'none';
            if (dom.voiceParamsGroup) dom.voiceParamsGroup.style.display = 'none';
        }
    }

    // Voice loader returning a Promise that resolves when voices available (or times out)
    function loadVoices(timeout = 2000) {
        return new Promise((resolve) => {
            const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
            if (voices && voices.length) return resolve(voices);

            let resolved = false;
            const handler = () => {
                if (resolved) return;
                resolved = true;
                const v = window.speechSynthesis.getVoices();
                window.speechSynthesis.onvoiceschanged = null;
                resolve(v);
            };

            if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = handler;

            setTimeout(() => {
                if (resolved) return;
                resolved = true;
                if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null;
                resolve(window.speechSynthesis ? window.speechSynthesis.getVoices() : []);
            }, timeout);
        });
    }

    function populateVoiceSelect(voices) {
        if (!dom.voiceSelect) return;
        dom.voiceSelect.innerHTML = '';
        if (!voices || voices.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.disabled = true;
            opt.textContent = 'No voices available';
            dom.voiceSelect.appendChild(opt);
            return;
        }

        voices.forEach(v => {
            const opt = document.createElement('option');
            opt.value = `${v.name}::${v.lang}`;
            opt.textContent = `${v.name} (${v.lang})`;
            if (v.default) opt.selected = true;
            dom.voiceSelect.appendChild(opt);
        });
    }

    async function fetchModels(provider) {
        if (!dom.modelSelect) return;
        if (currentModelsAbort) {
            try { currentModelsAbort.abort(); } catch (e) {}
            currentModelsAbort = null;
        }
        const ac = new AbortController();
        currentModelsAbort = ac;

        dom.modelSelect.innerHTML = '<option value="" disabled selected>🔄 Loading models...</option>';
        dom.modelSelect.disabled = true;
        try {
            console.log('Fetching models for provider:', provider);
            const data = await window.SettingsService.getModels(provider, { signal: ac.signal });
            console.log('Models response:', data);

            if (!data || !data.availableModels) {
                dom.modelSelect.innerHTML = '<option value="" disabled>No models found</option>';
                console.warn('No availableModels in response');
                return;
            }

            dom.modelSelect.innerHTML = '';

            // Create options for all available models
            data.availableModels.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m;
                opt.innerText = m;
                // Pre-select the active model if it matches
                if (m === data.activeModel) {
                    opt.selected = true;
                }
                dom.modelSelect.appendChild(opt);
            });

            // If no model was marked as selected, select the first one
            if (dom.modelSelect.selectedIndex < 0 && dom.modelSelect.options.length > 0) {
                dom.modelSelect.options[0].selected = true;
            }

            dom.modelSelect.disabled = false;
            console.log('Models loaded successfully. Count:', data.availableModels.length);
        } catch (e) {
            console.error('Error fetching models:', e);
            dom.modelSelect.innerHTML = '<option value="" disabled>❌ Error loading models</option>';
            dom.modelSelect.disabled = true;
        } finally {
            currentModelsAbort = null;
        }
    }

    async function testConnection() {
        if (!dom.testConnBtn || !dom.testConnResult) return;
        dom.testConnResult.innerText = 'Testing active config... (Save first)';
        dom.testConnResult.style.color = '#a4b5c4';
        dom.testConnBtn.disabled = true;
        try {
            const res = await window.SettingsService.testConfig();
            if (res.success) {
                dom.testConnResult.innerText = `Success: ${res.message}`;
                dom.testConnResult.style.color = '#33ff33';
            } else {
                dom.testConnResult.innerText = `Failed: ${res.message}`;
                dom.testConnResult.style.color = '#ff3333';
            }
        } catch (e) {
            dom.testConnResult.innerText = 'Test Failed (Network Error)';
            dom.testConnResult.style.color = '#ff3333';
        } finally {
            dom.testConnBtn.disabled = false;
        }
    }

    function showError(msg) {
        if (dom.settingsError) {
            dom.settingsError.innerText = msg;
            dom.settingsError.classList.remove('visually-hidden');
        } else {
            console.error('Settings Error:', msg);
        }
    }

    function clearError() {
        if (dom.settingsError) {
            dom.settingsError.innerText = '';
            dom.settingsError.classList.add('visually-hidden');
        }
    }

    async function saveSettings() {
        if (!dom.saveSettingsBtn) return;
        clearError();

        // basic validation
        if (dom.llmSelect && dom.llmSelect.value === 'gemini') {
            if (!dom.geminiKeyInput || !dom.geminiKeyInput.value.trim()) {
                showError('Google Gemini API Key is required for Gemini provider.');
                return;
            }
        }

        const payload = {
            llm: dom.llmSelect ? dom.llmSelect.value : undefined,
            tts: dom.ttsSelect ? dom.ttsSelect.value : undefined,
            model: dom.modelSelect ? dom.modelSelect.value : undefined
        };
        if (dom.llmSelect && dom.llmSelect.value === 'gemini' && dom.geminiKeyInput && dom.geminiKeyInput.value.trim()) {
            payload.geminiKey = dom.geminiKeyInput.value.trim();
        }
        if (dom.ttsSelect && dom.ttsSelect.value === 'browser' && dom.voiceSelect && dom.voiceSelect.value) {
            payload.voiceId = dom.voiceSelect.value;
        }

        // UI lock
        dom.saveSettingsBtn.disabled = true;
        if (dom.saveSpinner) dom.saveSpinner.classList.remove('visually-hidden');

        try {
            const newConfig = await window.SettingsService.saveConfig(payload);
            window.SettingsState.setConfig(newConfig);
            hideModal();
            // logMessage is global in app.js
            if (window.logMessage) window.logMessage('SYS', `Configuration Updated. LLM: ${newConfig.llm.toUpperCase()}`);
        } catch (e) {
            showError('Failed to save configuration. ' + (e && e.details ? e.details : ''));
        } finally {
            dom.saveSettingsBtn.disabled = false;
            if (dom.saveSpinner) dom.saveSpinner.classList.add('visually-hidden');
        }
    }

    // Wire events
    if (dom.settingsBtn) dom.settingsBtn.addEventListener('click', () => {
        clearError();
        showModal();
        updateGeminiKeyVisibility();
        updateVoiceVisibility();
        fetchModels(dom.llmSelect ? dom.llmSelect.value : 'mock');

        loadVoices().then(populateVoiceSelect).catch(() => populateVoiceSelect([]));
    });

    if (dom.closeSettingsBtn) dom.closeSettingsBtn.addEventListener('click', hideModal);

    // LLM Provider change - load models for selected provider
    if (dom.llmSelect) {
        dom.llmSelect.addEventListener('change', () => {
            console.log('LLM Provider changed to:', dom.llmSelect.value);
            updateGeminiKeyVisibility();
            // Load models for the newly selected provider
            fetchModels(dom.llmSelect.value);
        });
    }

    if (dom.ttsSelect) dom.ttsSelect.addEventListener('change', updateVoiceVisibility);

    // Voice parameter listeners
    if (dom.voiceRateInput) {
        dom.voiceRateInput.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (dom.voiceRateValue) dom.voiceRateValue.innerText = value.toFixed(2) + 'x';
            window.voiceParams = window.voiceParams || {};
            window.voiceParams.rate = value;
        });
    }
    if (dom.voicePitchInput) {
        dom.voicePitchInput.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (dom.voicePitchValue) dom.voicePitchValue.innerText = value.toFixed(2) + 'x';
            window.voiceParams = window.voiceParams || {};
            window.voiceParams.pitch = value;
        });
    }
    if (dom.voiceVolumeInput) {
        dom.voiceVolumeInput.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (dom.voiceVolumeValue) dom.voiceVolumeValue.innerText = value.toFixed(2);
            window.voiceParams = window.voiceParams || {};
            window.voiceParams.volume = value;
        });
    }

    // Voice Activation Settings
    if (dom.wakewordInput) {
        dom.wakewordInput.addEventListener('change', (e) => {
            const wakeword = e.target.value.trim().toLowerCase();
            if (wakeword && window.VoiceActivation) {
                window.VoiceActivation.setWakeword(wakeword);
                console.log('Wakeword set to:', wakeword);
            }
        });
    }

    if (dom.recognitionLangSelect) {
        dom.recognitionLangSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            if (lang && window.VoiceActivation) {
                window.VoiceActivation.setLanguage(lang);
                console.log('Speech recognition language set to:', lang);
            }
        });
    }

    if (dom.voiceDebugToggle) {
        dom.voiceDebugToggle.addEventListener('change', (e) => {
            if (window.VoiceActivation) {
                window.VoiceActivation.toggleDebug();
                const isDebugOn = dom.voiceDebugToggle.checked;
                console.log('Voice Activation Debug:', isDebugOn ? 'ON' : 'OFF');
            }
        });
    }

if (dom.testConnBtn) dom.testConnBtn.addEventListener('click', testConnection);
    if (dom.testVoiceBtn) dom.testVoiceBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const vid = dom.voiceSelect ? dom.voiceSelect.value : null;
        if (!vid) return;
        const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
        const [name, lang] = vid.split('::');
        const match = voices.find(v => v.name === name && v.lang === lang);
        if (match) {
            if (window.speakText) window.speakText(`Greetings. This is a test of the ${match.name} vocal subsystem.`);
        } else {
            showError('Selected voice not available.');
        }
    });
    if (dom.saveSettingsBtn) dom.saveSettingsBtn.addEventListener('click', saveSettings);

    // react to external config updates
    if (window.SettingsState) {
        window.SettingsState.on('configChanged', (cfg) => {
            // update UI fields if modal open
            if (!dom.settingsModal || dom.settingsModal.classList.contains('hidden')) return;
            if (dom.llmSelect && cfg.llm) dom.llmSelect.value = cfg.llm;
            if (dom.ttsSelect && cfg.tts) dom.ttsSelect.value = cfg.tts;
            if (dom.modelSelect && cfg.model) dom.modelSelect.value = cfg.model;
            if (dom.voiceSelect && cfg.voiceId) dom.voiceSelect.value = cfg.voiceId;
            updateGeminiKeyVisibility();
            updateVoiceVisibility();
        });
    }

    // expose init for manual tests
    window.SettingsUi = { loadVoices, fetchModels, saveSettings };
})();

