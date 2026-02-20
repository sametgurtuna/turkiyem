import axios from 'axios';
import * as cheerio from 'cheerio';
import { getCached, setCached } from '../utils/cache.js';

const CACHE_KEY = 'tcmb_kur';
const CACHE_TTL = 3600; // 1 saat
const URL = 'https://www.tcmb.gov.tr/kurlar/today.xml';

export async function fetchExchangeRates() {
  const cached = getCached(CACHE_KEY);
  if (cached) return cached;

  try {
    const response = await axios.get(URL, { timeout: 10000 });
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
  } catch (error) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('TCMB servisine erişilemedi (Zaman aşımı).');
    }
    throw new Error(`TCMB veri hatası: ${error.message}`);
  }
}
