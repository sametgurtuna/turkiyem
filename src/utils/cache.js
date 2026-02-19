import NodeCache from 'node-cache';

export const CACHE_TTL = Object.freeze({
  DEFAULT: 300,
  IETT_SOAP: 90,
});

const cache = new NodeCache({ stdTTL: CACHE_TTL.DEFAULT, checkperiod: 60 });

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
