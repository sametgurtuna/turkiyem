import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

export function getCached(key) {
  return cache.get(key) || null;
}

export function setCached(key, value, ttl) {
  if (ttl !== undefined) {
    cache.set(key, value, ttl);
  } else {
    cache.set(key, value);
  }
}

export function flushCache() {
  cache.flushAll();
}

export default cache;
