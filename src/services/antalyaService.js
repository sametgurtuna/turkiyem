import axios from 'axios';
import * as cheerio from 'cheerio';
import qs from 'querystring';
import https from 'https';

const BASE_URL = 'https://ulasim.antalya.bel.tr';

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

/**
 * Fetches the list of all Antalya buses from the select dropdown.
 * Also fetches the stops since they are globally available.
 */
export async function fetchAntalyaFormOptions() {
    const res = await axios.get(`${BASE_URL}/Home/TarifeListesi`, { httpsAgent });
    const $ = cheerio.load(res.data);

    const buses = [];
    $('#selRoute option').each((i, el) => {
        const val = $(el).attr('value');
        const text = $(el).text().trim();
        if (val) buses.push({ id: val, name: text });
    });

    const stops = [];
    $('#selStop option').each((i, el) => {
        const val = $(el).attr('value');
        const text = $(el).text().trim(); // "10001 : AKDENİZ BLV-1"
        if (val) {
            const parts = text.split(':', 2);
            if (parts.length === 2) {
                stops.push({ id: val, name: parts[1].trim() });
            } else {
                stops.push({ id: val, name: text });
            }
        }
    });

    return { buses, stops };
}

/**
 * Fetches the table data for a specific bus route, direction, and day.
 */
export async function fetchAntalyaRouteSchedule(routeId, dayId, dirId) {
    const payload = qs.stringify({
        selDay: dayId,
        selDirection: dirId,
        selRoute: routeId,
        selStop: ''
    });

    const res = await axios.post(`${BASE_URL}/Home/TarifeListesi`, payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        httpsAgent
    });

    const $ = cheerio.load(res.data);
    const rows = [];

    $('tbody tr').each((i, el) => {
        const tds = $(el).find('td');
        if (tds.length >= 7) {
            rows.push({
                hatAdi: $(tds[0]).text().trim(),
                guzergah: $(tds[2]).text().trim(),
                saat: $(tds[3]).text().trim(),
                durakNo: $(tds[4]).text().trim(),
                durakAdi: $(tds[5]).text().trim(),
                yon: $(tds[6]).text().trim(),
            });
        }
    });

    return rows;
}

/**
 * Fetches data for a specific stop
 */
export async function fetchAntalyaStopSchedule(stopId, dayId, dirId) {
    const payload = qs.stringify({
        selDay: dayId,
        selDirection: dirId,
        selRoute: '',
        selStop: stopId
    });

    const res = await axios.post(`${BASE_URL}/Home/TarifeListesi`, payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        httpsAgent
    });

    const $ = cheerio.load(res.data);
    const rows = [];

    $('tbody tr').each((i, el) => {
        const tds = $(el).find('td');
        if (tds.length >= 7) {
            rows.push({
                hatAdi: $(tds[0]).text().trim(),
                guzergah: $(tds[2]).text().trim(),
                saat: $(tds[3]).text().trim(),
                durakNo: $(tds[4]).text().trim(),
                durakAdi: $(tds[5]).text().trim(),
                yon: $(tds[6]).text().trim(),
            });
        }
    });

    return rows;
}
