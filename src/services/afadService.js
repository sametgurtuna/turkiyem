import { createHttpClient } from '../utils/httpClient.js';
import { getCached, setCached } from '../utils/cache.js';

const AFAD_URL = 'https://deprem.afad.gov.tr/apiv2/event/filter';
const apiClient = createHttpClient();

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

  const response = await apiClient.get(AFAD_URL, { params });
  const data = response.data;

  if (!Array.isArray(data)) {
    throw new Error('AFAD API beklenmeyen yanıt formatı döndürdü');
  }

  const earthquakes = data.map(normalizeQuake);
  setCached(cacheKey, earthquakes);
  return earthquakes;
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
