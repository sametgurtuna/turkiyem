import axios from 'axios';

const BASE_URL = 'https://bursakartapi.abys-web.com/api/static';
const ORIGIN_HEADER = { Origin: 'https://www.bursakart.com.tr' };

/**
 * Common POST request wrapper for Burulas API
 */
async function fetchBursaApi(endpoint, data) {
    try {
        const response = await axios.post(`${BASE_URL}/${endpoint}`, data, {
            headers: ORIGIN_HEADER
        });
        // Burulas API returns data in the `.result` array
        if (response.data && response.data.result) {
            return response.data.result;
        }
        return [];
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(`Bursa API Hatası: ${error.response.data.message}`);
        }
        throw error;
    }
}

/**
 * Arama terimiyle hat ve durakları getirir.
 * @param {string} keyword Aranacak terim (örn: "17")
 */
export async function searchBursaRouteAndStation(keyword) {
    return fetchBursaApi('routeandstation', { keyword });
}

/**
 * Belirli bir hattın duraklarını getirir.
 * @param {string} routeId Hat ID'si
 * @param {string} direction Yön (Gidiş/Dönüş -> "1" veya "2" vs)
 */
export async function getBursaRouteStops(routeId, direction) {
    // Api expects strings
    return fetchBursaApi('routestat', {
        routeId: routeId.toString(),
        direction: direction.toString()
    });
}

/**
 * Hattaki araçların anlık konumlarını getirir.
 * @param {string} routeId Hat ID'si
 */
export async function getBursaRealTimeLocation(routeId) {
    return fetchBursaApi('realtimedata', { keyword: routeId.toString() });
}

/**
 * Belirli bir durağa yaklaşan otobüsleri ve kalan sürelerini getirir.
 * @param {number|string} stationId Durak ID'si
 */
export async function getBursaStationRemainingTime(stationId) {
    // Api expects keyword as int
    return fetchBursaApi('stationremainingtime', { keyword: parseInt(stationId, 10) });
}

/**
 * Durağa ait hat geçiş saatlerini getirir.
 * @param {string} routeId Hat ID'si
 * @param {string} direction Yön
 * @param {number|string} stationId Durak ID'si
 */
export async function getBursaScheduleByStop(routeId, direction, stationId) {
    // Api expects routeId as int, direction as string, stationId as int
    return fetchBursaApi('schedulebystop', {
        routeId: parseInt(routeId, 10),
        direction: direction.toString(),
        stationId: parseInt(stationId, 10)
    });
}
