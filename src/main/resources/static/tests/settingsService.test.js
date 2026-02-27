/** @jest-environment jsdom */
const fs = require('fs');
const path = require('path');

beforeAll(() => {
  // load SettingsService
  const serviceCode = fs.readFileSync(path.join(__dirname, '..', 'settingsService.js'), 'utf8');
  eval(serviceCode);
});

describe('SettingsService', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test('getModels returns parsed json on success', async () => {
    const mock = { availableModels: ['m1', 'm2'], activeModel: 'm2' };
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mock });
    const data = await window.SettingsService.getModels('mock');
    expect(data.availableModels).toEqual(mock.availableModels);
  });

  test('testConfig normalizes boolean/string', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: 'true', message: 'ok' }) });
    const res = await window.SettingsService.testConfig();
    expect(res.success).toBe(true);
    expect(res.message).toBe('ok');
  });
});

