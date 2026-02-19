import axios from 'axios';
import { getCached, setCached } from '../utils/cache.js';

const AFAD_URL = 'https://deprem.afad.gov.tr/apiv2/event/filter';

function formatISODate(date) {
  return date.toISOString().replace(/\.\d{3}Z$/, '');
}

function computeTimeRange(period) {
  const end = new Date();
  const start = new Date();

  if (period === 'son24') {
    start.setHours(start.getHours() - 24);
  } else if (period === '7gun') {
    start.setDate(start.getDate() - 7);
  } else {
    start.setDate(start.getDate() - 1);
  }

  return { start: formatISODate(start), end: formatISODate(end) };
}

function normalizeQuake(raw) {
  return {
    magnitude: raw.magnitude ?? raw.mag ?? raw.Magnitude ?? '-',
    depth: raw.depth ?? raw.Depth ?? raw.derinlik ?? '-',
    location: raw.location ?? raw.Location ?? raw.title ?? raw.yer ?? '-',
    date: raw.date ?? raw.Date ?? raw.eventDate ?? '-',
    latitude: raw.latitude ?? raw.Latitude ?? '-',
    longitude: raw.longitude ?? raw.Longitude ?? '-',
    type: raw.type ?? raw.Type ?? '-',
  };
}

export async function fetchEarthquakes(period, limit = 20) {
  const cacheKey = `afad_${period}_${limit}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { start, end } = computeTimeRange(period);

  const params = {
    start,
    end,
    format: 'json',
    limit,
    orderby: 'timedesc',
  };

  try {
    const response = await axios.get(AFAD_URL, {
      params,
      timeout: 15000,
      maxRedirects: 5,
      headers: {
        'User-Agent': 'turkiyem-cli/1.0',
        'Accept': 'application/json',
      },
      validateStatus(status) {
        return status >= 200 && status < 600;
      },
    });

    if (response.status === 500) {
      const body = response.data;
      if (body && body.status === 400) {
        throw new Error(`AFAD API hata döndürdü: ${body.message || 'Geçersiz istek parametreleri'}`);
      }
      throw new Error(`AFAD API sunucu hatası (HTTP 500)`);
    }

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`AFAD API HTTP ${response.status} hatası döndürdü`);
    }

    const data = response.data;

    if (!Array.isArray(data)) {
      throw new Error('AFAD API beklenmeyen yanıt formatı döndürdü');
    }

    const earthquakes = data.map(normalizeQuake);
    setCached(cacheKey, earthquakes);
    return earthquakes;
  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      throw new Error('AFAD API isteği zaman aşımına uğradı. Lütfen tekrar deneyin.');
    }
    if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
      throw new Error('AFAD API sunucusuna bağlanılamıyor. İnternet bağlantınızı kontrol edin.');
    }
    throw err;
  }
}

export async function fetchByMagnitude(minMagnitude) {
  const cacheKey = `afad_mag_${minMagnitude}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const earthquakes = await fetchEarthquakes('7gun', 100);
  const filtered = earthquakes.filter(
    (eq) => parseFloat(eq.magnitude) >= parseFloat(minMagnitude)
  );

  setCached(cacheKey, filtered);
  return filtered;
}
