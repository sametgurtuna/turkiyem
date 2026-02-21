import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://samulas.com.tr';

/**
 * Fetches the list of all Samsun buses.
 * Returns an array of objects: { id: string|number, name: string }
 */
export async function fetchSamsunBuses() {
    const res = await axios.get(`${BASE_URL}/api/v1/lines/list?page=1&limit=500`);
    const data = res.data?.data?.data || [];

    return data.map(item => ({
        id: item.line_no,
        name: item.text.replace(/\s+/g, ' ').trim()
    }));
}

/**
 * Fetches the schedule of a specific Samsun bus.
 * Returns an object with schedule details and stops.
 */
export async function fetchSamsunBusSchedule(lineNo) {
    const res = await axios.get(`${BASE_URL}/otobus-detay/${lineNo}`);
    const $ = cheerio.load(res.data);

    const rootTitle = $('div.page-heading h1').text().trim();
    if (!rootTitle) {
        throw new Error('Saat bilgisi bulunamadı.');
    }

    const parseTimes = (tabId) => {
        const title = $(`#${tabId} .row.border`).eq(0).text().trim() || '';
        const times = [];
        $(`#${tabId} .row.border`).eq(1).find('div').each((i, el) => {
            const timeStr = $(el).text().replace('*', '').trim();
            if (timeStr && timeStr.includes(':')) times.push(timeStr);
        });

        // Let's sort the times logically
        times.sort();

        return { title, times };
    };

    const haftaIci = parseTimes('haftaIciContent');
    const cumartesi = parseTimes('cumartesiContent');
    const pazar = parseTimes('pazarContent');

    const stops = [];
    const markerScript = $('script').filter((i, el) => $(el).html().includes('L.marker')).html() || '';
    const matches = [...markerScript.matchAll(/marker\.bindPopup\("<b>(.*?)<\/b>"\)/g)];

    matches.forEach(m => {
        // e.g., "1 - 11872 - YENİ CEZAEVİ" -> name
        stops.push(m[1]);
    });

    return {
        busName: rootTitle,
        haftaIci,
        cumartesi,
        pazar,
        stops
    };
}
