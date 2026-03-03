import { createHttpClient } from '../utils/httpClient.js';
import * as cheerio from 'cheerio';
import { getCached, setCached } from '../utils/cache.js';

const CACHE_KEY = 'tcmb_kur';
const CACHE_TTL = 3600; // 1 saat
const URL = 'https://www.tcmb.gov.tr/kurlar/today.xml';
const apiClient = createHttpClient();

export async function fetchExchangeRates() {
  const cached = getCached(CACHE_KEY);
  if (cached) return cached;

  const response = await apiClient.get(URL);
  const $ = cheerio.load(response.data, { xmlMode: true });

  const date = $('Tarih_Date').attr('Tarih');
  const bultenNo = $('Tarih_Date').attr('Bulten_No');

  const currencies = [];

  $('Currency').each((_, el) => {
    const isim = $(el).find('Isim').text().trim();
    const code = $(el).attr('CurrencyCode');
    const alis = $(el).find('ForexBuying').text().trim();
    const satis = $(el).find('ForexSelling').text().trim();

    if (isim && code) {
      currencies.push({
        isim,
        kodu: code,
        alis,
        satis
      });
    }
  });

  const result = { date, bultenNo, currencies };
  setCached(CACHE_KEY, result, CACHE_TTL);
  return result;
}
