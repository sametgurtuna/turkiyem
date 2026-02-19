import axios from 'axios';
import { CACHE_TTL, getCached, setCached } from '../utils/cache.js';
import { getCity } from '../utils/config.js';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

const REQUEST_TIMEOUT = 15000;

function isCoordinateInput(value) {
  return /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(value);
}

function parseCoordinates(value) {
  const [latRaw, lonRaw] = value.split(',');
  const latitude = Number.parseFloat(latRaw.trim());
  const longitude = Number.parseFloat(lonRaw.trim());

  if (
    Number.isNaN(latitude)
    || Number.isNaN(longitude)
    || latitude < -90
    || latitude > 90
    || longitude < -180
    || longitude > 180
  ) {
    throw new Error('Koordinatlar geçersiz. Örnek: 41.0082,28.9784');
  }

  return { latitude, longitude };
}

async function fetchGeocodeByName(cityName) {
  const cacheKey = `geo_${cityName.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await axios.get(GEOCODING_URL, {
    params: {
      name: cityName,
      count: 1,
      language: 'tr',
      format: 'json',
    },
    timeout: REQUEST_TIMEOUT,
  });

  if (response.status !== 200 || !response.data) {
    throw new Error('Open-Meteo geocoding yanıtı alınamadı.');
  }

  const first = response.data.results?.[0];
  if (!first) {
    throw new Error(`"${cityName}" için konum bulunamadı.`);
  }

  const normalized = {
    name: [first.name, first.admin1, first.country].filter(Boolean).join(', '),
    latitude: first.latitude,
    longitude: first.longitude,
    timezone: first.timezone || 'auto',
  };

  setCached(cacheKey, normalized, CACHE_TTL.DEFAULT);
  return normalized;
}

export async function resolveLocation(inputCity) {
  const raw = (inputCity || getCity() || '').trim();
  if (!raw) {
    throw new Error('Şehir belirtilmedi. Örnek: turkiyem hava guncel istanbul');
  }

  if (isCoordinateInput(raw)) {
    const coords = parseCoordinates(raw);
    return {
      name: `${coords.latitude},${coords.longitude}`,
      latitude: coords.latitude,
      longitude: coords.longitude,
      timezone: 'auto',
    };
  }

  return fetchGeocodeByName(raw);
}

function buildHourlyRows(hourly, limitCount) {
  const times = hourly.time || [];
  const temperatures = hourly.temperature_2m || [];
  const apparent = hourly.apparent_temperature || [];
  const precipitation = hourly.precipitation_probability || [];

  const size = Math.min(times.length, temperatures.length, apparent.length, precipitation.length, limitCount);
  const rows = [];

  for (let i = 0; i < size; i += 1) {
    rows.push({
      time: times[i],
      temperature: temperatures[i],
      apparentTemperature: apparent[i],
      precipitationProbability: precipitation[i],
    });
  }

  return rows;
}

function findClosestIndex(timeValues) {
  if (!Array.isArray(timeValues) || timeValues.length === 0) return -1;

  const nowTs = Date.now();
  let bestIndex = 0;
  let bestDelta = Number.POSITIVE_INFINITY;

  for (let i = 0; i < timeValues.length; i += 1) {
    const ts = new Date(timeValues[i]).getTime();
    if (Number.isNaN(ts)) continue;
    const delta = Math.abs(nowTs - ts);
    if (delta < bestDelta) {
      bestDelta = delta;
      bestIndex = i;
    }
  }

  return bestIndex;
}

function normalizeAxiosError(err, sourceName) {
  if (err?.code === 'ECONNABORTED') {
    throw new Error(`${sourceName} isteği zaman aşımına uğradı.`);
  }
  if (err?.code === 'ENOTFOUND' || err?.code === 'ECONNREFUSED') {
    throw new Error(`${sourceName} sunucusuna bağlanılamadı.`);
  }
  if (err?.response?.status) {
    throw new Error(`${sourceName} HTTP ${err.response.status} hatası döndürdü.`);
  }
  throw err;
}

export async function fetchCurrentWeather(inputCity) {
  const location = await resolveLocation(inputCity);
  const cacheKey = `weather_current_${location.latitude}_${location.longitude}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(FORECAST_URL, {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
        current: 'temperature_2m,wind_speed_10m,relative_humidity_2m',
        timezone: location.timezone || 'auto',
      },
      timeout: REQUEST_TIMEOUT,
    });

    if (response.status !== 200 || !response.data?.current) {
      throw new Error('Güncel hava verisi alınamadı.');
    }

    const result = {
      locationName: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: response.data.timezone || location.timezone || 'auto',
      current: {
        time: response.data.current.time,
        temperature: response.data.current.temperature_2m,
        windSpeed: response.data.current.wind_speed_10m,
        humidity: response.data.current.relative_humidity_2m,
      },
    };

    setCached(cacheKey, result, CACHE_TTL.WEATHER_CURRENT);
    return result;
  } catch (err) {
    normalizeAxiosError(err, 'Open-Meteo');
  }
}

export async function fetchHourlyForecast(inputCity, forecastDays = 2) {
  const location = await resolveLocation(inputCity);
  const safeDays = Number.isFinite(forecastDays)
    ? Math.min(Math.max(Number.parseInt(forecastDays, 10), 1), 7)
    : 2;

  const cacheKey = `weather_hourly_${location.latitude}_${location.longitude}_${safeDays}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(FORECAST_URL, {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
        hourly: 'temperature_2m,apparent_temperature,precipitation_probability',
        forecast_days: safeDays,
        timezone: location.timezone || 'auto',
      },
      timeout: REQUEST_TIMEOUT,
    });

    if (response.status !== 200 || !response.data?.hourly) {
      throw new Error('Saatlik tahmin verisi alınamadı.');
    }

    const limitCount = Math.min(safeDays * 24, 48);
    const rows = buildHourlyRows(response.data.hourly, limitCount);

    const result = {
      locationName: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: response.data.timezone || location.timezone || 'auto',
      rows,
      forecastDays: safeDays,
    };

    setCached(cacheKey, result, CACHE_TTL.WEATHER_HOURLY);
    return result;
  } catch (err) {
    normalizeAxiosError(err, 'Open-Meteo');
  }
}

export async function fetchAirQuality(inputCity) {
  const location = await resolveLocation(inputCity);
  const cacheKey = `weather_air_${location.latitude}_${location.longitude}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(AIR_QUALITY_URL, {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
        hourly: 'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide',
        timezone: 'auto',
      },
      timeout: REQUEST_TIMEOUT,
    });

    const hourly = response.data?.hourly;
    if (response.status !== 200 || !hourly) {
      throw new Error('Hava kalitesi verisi alınamadı.');
    }

    const idx = findClosestIndex(hourly.time);
    if (idx < 0) {
      throw new Error('Hava kalitesi saat verisi çözümlenemedi.');
    }

    const result = {
      locationName: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: response.data.timezone || 'auto',
      current: {
        time: hourly.time?.[idx] ?? '-',
        pm10: hourly.pm10?.[idx] ?? null,
        pm25: hourly.pm2_5?.[idx] ?? null,
        carbonMonoxide: hourly.carbon_monoxide?.[idx] ?? null,
        nitrogenDioxide: hourly.nitrogen_dioxide?.[idx] ?? null,
      },
    };

    setCached(cacheKey, result, CACHE_TTL.WEATHER_AIR);
    return result;
  } catch (err) {
    normalizeAxiosError(err, 'Open-Meteo Air Quality');
  }
}
