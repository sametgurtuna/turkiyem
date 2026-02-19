import axios from 'axios';
import { getCached, setCached } from '../utils/cache.js';

const DATASTORE_SQL_URL = 'https://data.ibb.gov.tr/api/3/action/datastore_search_sql';
const DATASTORE_SEARCH_URL = 'https://data.ibb.gov.tr/api/3/action/datastore_search';

const RESOURCE_IDS = {
  routes: '46dbe388-c8c2-45c4-ac72-c06953de56a2',
  trips: '7ff49bdd-b0d2-4a6e-9392-b598f77f5070',
  stopTimes: '23778613-16fe-4d30-b8b8-8ca934ed2978',
  stops: '2299bc82-983b-4bdf-8520-5cef8c555e29',
};

const API_TIMEOUT = 30000;
const API_HEADERS = { 'User-Agent': 'turkiyem-cli/1.0' };

function escapeSQL(str) {
  return str.replace(/'/g, "''");
}

async function datastoreSQL(sql) {
  try {
    const response = await axios.get(DATASTORE_SQL_URL, {
      params: { sql },
      timeout: API_TIMEOUT,
      headers: API_HEADERS,
    });

    if (!response.data?.success) {
      throw new Error('IETT SQL sorgusu başarısız');
    }

    return response.data.result.records;
  } catch (err) {
    if (err.response?.status === 403) {
      throw new Error('IETT veri kaynağı erişim engeli (403 Forbidden). Lütfen daha sonra tekrar deneyin.');
    }
    if (err.code === 'ECONNABORTED') {
      throw new Error('IETT veri kaynağı zaman aşımına uğradı. Lütfen tekrar deneyin.');
    }
    throw err;
  }
}

async function datastoreSearch(resourceId, options = {}) {
  const params = {
    resource_id: resourceId,
    limit: options.limit || 100,
  };

  if (options.filters) params.filters = JSON.stringify(options.filters);
  if (options.sort) params.sort = options.sort;

  try {
    const response = await axios.get(DATASTORE_SEARCH_URL, {
      params,
      timeout: API_TIMEOUT,
      headers: API_HEADERS,
    });

    if (!response.data?.success) {
      throw new Error('IETT veri kaynağı başarısız yanıt döndürdü');
    }

    return response.data.result;
  } catch (err) {
    if (err.response?.status === 403) {
      throw new Error('IETT veri kaynağı erişim engeli (403 Forbidden). Lütfen daha sonra tekrar deneyin.');
    }
    if (err.code === 'ECONNABORTED') {
      throw new Error('IETT veri kaynağı zaman aşımına uğradı. Lütfen tekrar deneyin.');
    }
    throw err;
  }
}

function extractStopsFromName(longName) {
  if (!longName || longName === '-') return { first: '-', last: '-' };

  const separators = [' - ', ' – ', '-'];
  for (const sep of separators) {
    const parts = longName.split(sep).map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      return { first: parts[0], last: parts[parts.length - 1] };
    }
  }

  return { first: longName, last: '-' };
}

async function tryGetStopCount(routeId) {
  try {
    const tripsResult = await datastoreSearch(RESOURCE_IDS.trips, {
      filters: { route_id: routeId },
      limit: 10,
    });

    const trips = tripsResult.records;
    if (trips.length === 0) return 0;

    for (const trip of trips) {
      const stResult = await datastoreSearch(RESOURCE_IDS.stopTimes, {
        filters: { trip_id: trip.trip_id },
        limit: 1,
      });

      if (stResult.total > 0) {
        return stResult.total;
      }
    }

    return 0;
  } catch {
    return 0;
  }
}

export async function fetchIettRoute(routeCode) {
  const cacheKey = `iett_route_${routeCode.toUpperCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const code = routeCode.toUpperCase();
  const sql = `SELECT * FROM "${RESOURCE_IDS.routes}" WHERE UPPER(route_short_name)='${escapeSQL(code)}' LIMIT 20`;
  const routes = await datastoreSQL(sql);

  if (!routes || routes.length === 0) {
    throw new Error(`"${routeCode}" hat numarası IETT verilerinde bulunamadı.`);
  }

  const route = routes[0];
  const { first, last } = extractStopsFromName(route.route_long_name);

  const routeCount = routes.length;
  const directions = routes
    .map((r) => r.route_long_name)
    .filter((v, i, a) => a.indexOf(v) === i);

  const stopCount = await tryGetStopCount(route.route_id);

  const result = {
    routeShortName: route.route_short_name || code,
    routeLongName: route.route_long_name || '-',
    stopCount,
    firstStop: first,
    lastStop: last,
    routeVariants: routeCount,
    directions,
  };

  setCached(cacheKey, result);
  return result;
}
