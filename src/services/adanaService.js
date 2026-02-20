import axios from 'axios';
import * as cheerio from 'cheerio';
import qs from 'querystring';

const BASE_URL = 'https://ulasimbilgi.adana.bel.tr';

/**
 * Fetches the list of all Adana buses.
 * Returns an object with { buses: [{name, target}], state: {viewstate, ...} }
 */
export async function fetchAdanaBuses() {
    const res = await axios.get(`${BASE_URL}/Otobusler`);
    const $ = cheerio.load(res.data);

    const viewstate = $('#__VIEWSTATE').val();
    const viewstategenerator = $('#__VIEWSTATEGENERATOR').val();
    const eventvalidation = $('#__EVENTVALIDATION').val();

    const buses = [];
    $('li.busList-style a').each((i, el) => {
        const text = $(el).find('div.col-md-8').text().trim() || $(el).text().trim();
        let href = $(el).attr('href');
        if (href && href.includes('javascript:__doPostBack')) {
            // Extract the target name
            // href is typically: javascript:__doPostBack('AllBusRepeater$ctl00$LinkButton1','')
            const match = href.match(/__doPostBack\('(.*?)','/);
            if (match) {
                buses.push({
                    name: text.replace(/\s+/g, ' '),
                    target: match[1]
                });
            }
        }
    });

    return {
        state: { viewstate, viewstategenerator, eventvalidation },
        buses
    };
}

/**
 * Fetches the details of a specific bus by performing a postback then following redirect
 */
export async function fetchAdanaBusDetails(target, state) {
    const payload = {
        __EVENTTARGET: target,
        __EVENTARGUMENT: '',
        __VIEWSTATE: state.viewstate,
        __VIEWSTATEGENERATOR: state.viewstategenerator,
        __EVENTVALIDATION: state.eventvalidation
    };

    const res = await axios.post(`${BASE_URL}/Otobusler`, qs.stringify(payload), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        maxRedirects: 0,
        validateStatus: null // We expect a 302 redirect
    });

    if (res.status !== 302 || !res.headers.location) {
        throw new Error('Beklenen yönlendirme verisi alınamadı.');
    }

    const cookies = res.headers['set-cookie'] || [];
    const loc = res.headers.location;

    // Make the second request to fetch the details page
    const detailRes = await axios.get(`${BASE_URL}${loc.startsWith('/') ? loc : '/' + loc}`, {
        headers: { 'Cookie': cookies.map(c => c.split(';')[0]).join('; ') }
    });

    const $ = cheerio.load(detailRes.data);
    const busName = $('#busNameLabel').text().trim();
    const lastUpdate = $('#guncellemeLabel').text().trim();

    // Extract schedule
    const schedule = [];
    $('#weekdays .ulBusList li').each((i, el) => {
        schedule.push($(el).text().trim());
    });

    // Extract stops
    const stops = [];
    const stopNames = $('.nameLabel');
    const stopIds = $('.stopLabel');

    stopNames.each((i, el) => {
        const sName = $(el).text().trim();
        const sId = $(stopIds[i]).text().trim();
        if (sName && sId) {
            stops.push({ name: sName, id: sId });
        }
    });

    return {
        busName,
        lastUpdate,
        schedule,
        stops
    };
}

/**
 * Fetches the details of a specific stop
 */
export async function fetchAdanaStopDetails(stopId) {
    const res = await axios.get(`${BASE_URL}/Durak?StopId=${stopId}`);
    const $ = cheerio.load(res.data);

    const stopName = $('#StopNameLabel').text().trim();
    const passingBuses = [];

    $('.ulBusList li a').each((i, el) => {
        passingBuses.push($(el).text().trim().replace(/\s+/g, ' '));
    });

    return {
        stopId,
        stopName,
        passingBuses
    };
}
