/** @jest-environment jsdom */
const fs = require('fs');
const path = require('path');

beforeAll(() => {
  const uiCode = fs.readFileSync(path.join(__dirname, '..', 'settingsUi.js'), 'utf8');
  eval(uiCode);
});

describe('Voice loader', () => {
  test('loadVoices resolves when speechSynthesis.getVoices returns immediately', async () => {
    global.window.speechSynthesis = { getVoices: () => [{ name: 'Test', lang: 'en-US' }] };
    const voices = await window.SettingsUi.loadVoices(50);
    expect(Array.isArray(voices)).toBe(true);
    expect(voices.length).toBeGreaterThan(0);
  });

  test('loadVoices resolves with empty array when not available', async () => {
    global.window.speechSynthesis = { getVoices: () => [] };
    const voices = await window.SettingsUi.loadVoices(10);
    expect(Array.isArray(voices)).toBe(true);
  });
});

