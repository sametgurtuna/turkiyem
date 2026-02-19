import axios from 'axios';
import * as cheerio from 'cheerio';
import { getCached, setCached } from '../utils/cache.js';

const EGO_URL = 'https://www.ego.gov.tr/hareketsaatleri';

function parseInfoTable($) {
  const info = {
    hatNo: '',
    hatAdi: '',
    kalkis: '',
    varis: '',
    mesafe: '',
    sure: '',
  };

  const infoTable = $('.hatbilgileri table');
  if (!infoTable.length) return info;

  infoTable.find('tr').each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length >= 3) {
      const label = $(cells[0]).text().trim().toLowerCase();
      const value = $(cells[2]).text().trim();

      if (label.includes('hat no')) info.hatNo = value;
      else if (label.includes('hat adı') || label.includes('hat ismi')) info.hatAdi = value;
      else if (label.includes('kalkış')) info.kalkis = value;
      else if (label.includes('varış')) info.varis = value;
      else if (label.includes('mesafe')) info.mesafe = value;
      else if (label.includes('süre')) info.sure = value;
    }
  });

  return info;
}

function parseScheduleTable($, hatNo) {
  const schedule = [];
  const scheduleTable = $('.hareket-saatleri table');
  if (!scheduleTable.length) return schedule;

  const headers = [];
  scheduleTable.find('th').each((_, th) => {
    headers.push($(th).text().trim());
  });

  const dataRow = scheduleTable.find('tr').last();
  const cells = dataRow.find('td');

  cells.each((i, cell) => {
    const raw = $(cell).html() || '';
    const times = raw
      .split(/<br\s*\/?>/i)
      .map((t) => t.replace(/<[^>]*>/g, '').trim())
      .filter((t) => t.length > 0)
      .map((t) => t.replace(/\s*-\s*$/, '').trim())
      .filter((t) => t.length > 0);

    if (times.length > 0) {
      const gunTipi = headers[i] || ['Hafta içi', 'Cumartesi', 'Pazar'][i] || `Sütun ${i + 1}`;
      schedule.push({
        hat: String(hatNo),
        gunTipi,
        saatler: times.join(', '),
      });
    }
  });

  return schedule;
}

export async function fetchEgoSchedule(hatNo) {
  const cacheKey = `ego_${hatNo}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(EGO_URL, {
      params: { hat_no: hatNo },
      timeout: 15000,
      maxRedirects: 5,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      responseType: 'text',
    });

    if (response.status !== 200) {
      throw new Error(`EGO sunucusu HTTP ${response.status} döndürdü`);
    }

    const html = response.data;
    if (!html || html.length < 100) {
      throw new Error('EGO sunucusundan geçerli yanıt alınamadı');
    }

    const $ = cheerio.load(html);
    const info = parseInfoTable($);

    if (!info.hatNo) {
      info.hatNo = String(hatNo);
    }

    const schedule = parseScheduleTable($, hatNo);

    const result = { info, schedule };
    setCached(cacheKey, result);
    return result;
  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      throw new Error('EGO sunucusu isteği zaman aşımına uğradı. Lütfen tekrar deneyin.');
    }
    if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
      throw new Error('EGO sunucusuna bağlanılamıyor. İnternet bağlantınızı kontrol edin.');
    }
    if (err.response && err.response.status === 404) {
      throw new Error(`Hat numarası "${hatNo}" bulunamadı.`);
    }
    throw err;
  }
}
