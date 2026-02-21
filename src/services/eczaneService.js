import axios from 'axios';

export async function fetchNobetciEczaneler() {
    const url = 'https://openapi.izmir.bel.tr/api/ibb/nobetcieczaneler';
    const response = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
    });
    return response.data;
}

export async function fetchAllEczaneler() {
    const url = 'https://openapi.izmir.bel.tr/api/ibb/eczaneler';
    const response = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
    });
    return response.data;
}

export async function fetchKayseriNobetciEczaneler() {
    const url = 'https://acikveri.kayseri.bel.tr/api/kbb/eczane';
    const response = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
    });
    return response.data;
}
