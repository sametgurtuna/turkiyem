import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const CONFIG_DIR = path.join(os.homedir(), '.turkiyem');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

const DEFAULT_CONFIG = { city: null };

function ensureDir() {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

export function readConfig() {
  try {
    ensureDir();
    if (!fs.existsSync(CONFIG_FILE)) {
      writeConfig(DEFAULT_CONFIG);
      return { ...DEFAULT_CONFIG };
    }
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      writeConfig(DEFAULT_CONFIG);
      return { ...DEFAULT_CONFIG };
    }
    return parsed;
  } catch {
    writeConfig(DEFAULT_CONFIG);
    return { ...DEFAULT_CONFIG };
  }
}

export function writeConfig(config) {
  ensureDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

export function getCity() {
  const config = readConfig();
  return config.city || null;
}

export function setCity(city) {
  const config = readConfig();
  config.city = city;
  writeConfig(config);
}

export function resetConfig() {
  writeConfig({ ...DEFAULT_CONFIG });
}

export { CONFIG_DIR, CONFIG_FILE };
