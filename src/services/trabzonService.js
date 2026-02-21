import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://ulasim.trabzon.bel.tr';

/**
 * Fetches the list of all Trabzon buses.
 * Returns an array of objects: { id: string, name: string }
 */
export async function fetchTrabzonBuses() {
    const res = await axios.get(`${BASE_URL}/`);
    const $ = cheerio.load(res.data);

    const buses = [];
    $('a[href^="/Web/Mobil?hatIdler="]').each((i, el) => {
        const text = $(el).text().trim();
        const href = $(el).attr('href');
        const match = href.match(/hatIdler=(\d+)/);
        if (match && text) {
            buses.push({
                id: match[1],
                name: text.replace(/\s+/g, ' ')
            });
        }
    });

    return buses;
}

/**
 * Fetches the schedule of a specific Trabzon bus.
 * Returns an object with schedule details.
 */
export async function fetchTrabzonBusSchedule(hatId) {
    const res = await axios.get(`${BASE_URL}/Web/HatSaat?hatIdler=${hatId}&yon=1`);
    const $ = cheerio.load(res.data);

    const rootTitle = $('h2').eq(0).text().trim();
    const kalkan1Adi = $('h2').eq(1).text().trim();
    const kalkan2Adi = $('h2').eq(2).text().trim();

    if ($('#tableGelis').length === 0 && $('#tableGidis').length === 0) {
        throw new Error('Saat bilgisi bulunamadı.');
    }

    const parseTable = (selector) => {
        const result = [];
        $(selector).find('tbody tr').each((i, el) => {
            const cols = $(el).find('td');
            const haftaIci = $(cols[0]).text().trim();
            const cumartesi = $(cols[1]).text().trim();
            const pazar = $(cols[2]).text().trim();
            if (haftaIci || cumartesi || pazar) {
                result.push({ haftaIci, cumartesi, pazar });
            }
        });
        return result;
    };

    const gidisSaat = parseTable('#tableGelis');
    const donusSaat = parseTable('#tableGidis');

    return {
        busName: rootTitle,
        direction1: kalkan1Adi,
        direction2: kalkan2Adi,
        gidisSaat,
        donusSaat
    };
}
