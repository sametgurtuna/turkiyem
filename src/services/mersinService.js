import axios from 'axios';
import https from 'https';

const MERSIN_AJAX_URL = 'https://ulasim.mersin.bel.tr/ajax/bilgi.php';

// Mersin sertifika hatalarını yok saymak için (Bazen belediye sitelerinde oluyor)
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export async function fetchMersinRoutes(regionOrKeyword) {
    let requestKeyword = 'TUM';

    // Eğer bölgesel sorguysa (MERKEZ, TARSUS vb.) 
    const regions = ['MERKEZ', 'TARSUS', 'GÜLNAR', 'ANAMUR', 'KÖYLER'];
    if (regionOrKeyword && regions.includes(regionOrKeyword.toUpperCase())) {
        requestKeyword = regionOrKeyword.toUpperCase();
    }

    const params = new URLSearchParams();
    params.append('aranan', requestKeyword);
    params.append('tipi', 'hatbilgisi');

    const response = await axios.post(MERSIN_AJAX_URL, params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'User-Agent': 'Mozilla/5.0'
        },
        httpsAgent
    });

    if (!response.data || !Array.isArray(response.data)) {
        return [];
    }

    let routes = response.data.map(r => {
        const hNo = r.hat_no && r.hat_no['0'] ? r.hat_no['0'].trim() : '';
        const hAd = r.hat_adi && r.hat_adi['0'] ? r.hat_adi['0'].trim() : '';
        const hYon = r.hat_yon && r.hat_yon['0'] ? r.hat_yon['0'].trim() : '';
        const bolge = r.bolge && r.bolge['0'] ? r.bolge['0'].trim() : '';

        return {
            hatNo: hNo,
            hatAdi: hAd,
            yon: hYon,
            bolge: bolge
        };
    });

    // Sadece "G" yönünü (gidiş) alıp filtrelenmiş gösterelim
    routes = routes.filter(r => r.yon === 'G');

    // Eğer parametre bölge değil de spesifik aramaysa lokalde filtreleyelim
    if (regionOrKeyword && requestKeyword === 'TUM') {
        const kw = regionOrKeyword.toLocaleUpperCase('tr-TR');
        routes = routes.filter(r =>
            (r.hatNo && r.hatNo.toLocaleUpperCase('tr-TR').includes(kw)) ||
            (r.hatAdi && r.hatAdi.toLocaleUpperCase('tr-TR').includes(kw))
        );
    }

    // Aynı hatta sahip birden fazla kayıt gelirse dedup
    const uniqueMap = new Map();
    routes.forEach(r => uniqueMap.set(r.hatNo, r));

    return Array.from(uniqueMap.values());
}

export async function fetchMersinSchedule(hatNo) {
    // API "-G" ile çalışıyor genelde
    let queryHat = hatNo;
    if (!queryHat.endsWith('-G')) {
        queryHat = queryHat + '-G';
    }

    const params = new URLSearchParams();
    params.append('hat_no', queryHat);
    params.append('tipi', 'tarifeler');

    const response = await axios.post(MERSIN_AJAX_URL, params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'User-Agent': 'Mozilla/5.0'
        },
        httpsAgent
    });

    if (!response.data || !Array.isArray(response.data)) {
        return [];
    }

    const schedule = {
        haftaIci: [],
        cumartesi: [],
        pazar: []
    };

    response.data.forEach(item => {
        const gun = item.tarife_gun && item.tarife_gun['0'] ? item.tarife_gun['0'].trim() : '';
        const saat = item.saat && item.saat['0'] ? item.saat['0'].replace(/\n/g, '').trim() : '';

        if (saat) {
            if (gun.toLocaleUpperCase('tr-TR') === 'HAFTAİÇİ' || gun.toLocaleUpperCase('tr-TR') === 'HAFTA ICI' || gun.toLocaleUpperCase('tr-TR') === 'HAFTA İÇİ') {
                schedule.haftaIci.push(saat);
            } else if (gun.toLocaleUpperCase('tr-TR') === 'CUMARTESİ') {
                schedule.cumartesi.push(saat);
            } else if (gun.toLocaleUpperCase('tr-TR') === 'PAZAR') {
                schedule.pazar.push(saat);
            }
        }
    });

    return schedule;
}
