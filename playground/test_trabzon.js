import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://ulasim.trabzon.bel.tr';

async function test() {
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
                name: text
            });
        }
    });
    console.log(`Found ${buses.length} buses.`, buses.slice(0, 3));

    const res2 = await axios.get(`${BASE_URL}/Web/HatSaat?hatIdler=1&yon=1`);
    const $2 = cheerio.load(res2.data);
    console.log("kalkan1:", $2('h2').eq(1).text().trim());
    console.log("kalkan2:", $2('h2').eq(2).text().trim());

    // Test a second route
    const res3 = await axios.get(`${BASE_URL}/Web/HatSaat?hatIdler=6&yon=1`);
    const $3 = cheerio.load(res3.data);
    console.log("route 6:");
    console.log("kalkan1:", $3('h2').eq(1).text().trim());
    console.log("kalkan2:", $3('h2').eq(2).text().trim());
}
test();
