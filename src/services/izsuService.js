import { defaultClient as httpClient } from '../utils/httpClient.js';

const BASE_URL = 'https://openapi.izmir.bel.tr/api/izsu';

/**
 * IZSU Su Kesintileri
 */
async function getWaterOutages() {
    try {
        const response = await httpClient.get(`${BASE_URL}/arizakaynaklisukesintileri`);
        return response.data || [];
    } catch (error) {
        throw new Error('IZSU su kesintileri verisi alınırken bir hata oluştu.');
    }
}

/**
 * IZSU Baraj Durumları
 */
async function getDamStatus() {
    try {
        const response = await httpClient.get(`${BASE_URL}/barajdurum`);
        return response.data || [];
    } catch (error) {
        throw new Error('IZSU baraj durumu verisi alınırken bir hata oluştu.');
    }
}

/**
 * IZSU Baraj ve Kuyular
 */
async function getDamAndWells() {
    try {
        const response = await httpClient.get(`${BASE_URL}/barajvekuyular`);
        return response.data || [];
    } catch (error) {
        throw new Error('IZSU baraj ve kuyular verisi alınırken bir hata oluştu.');
    }
}

/**
 * IZSU Günlük Su Üretimi
 */
async function getDailyWaterProduction() {
    try {
        const response = await httpClient.get(`${BASE_URL}/gunluksuuretimi`);
        return response.data || [];
    } catch (error) {
        throw new Error('IZSU günlük su üretimi verisi alınırken bir hata oluştu.');
    }
}

/**
 * IZSU Su Üretimi Dağılımı
 */
async function getWaterProductionDistribution(year) {
    try {
        const response = await httpClient.get(`${BASE_URL}/suuretiminindagilimi?Yil=${year || new Date().getFullYear()}`);
        return response.data || [];
    } catch (error) {
        throw new Error('IZSU su üretimi dağılımı verisi alınırken bir hata oluştu.');
    }
}

/**
 * IZSU Haftalık Su Analizleri
 */
async function getWeeklyWaterAnalysis() {
    try {
        const response = await httpClient.get(`${BASE_URL}/haftaliksuanalizleri`);
        return response.data || [];
    } catch (error) {
        throw new Error('IZSU haftalık su analizi verisi alınırken bir hata oluştu.');
    }
}

/**
 * IZSU Çevre İlçe Su Analizleri
 */
async function getPeripheryWaterAnalysis() {
    try {
        const response = await httpClient.get(`${BASE_URL}/cevreilcesuanalizleri`);
        return response.data || [];
    } catch (error) {
        throw new Error('IZSU çevre ilçe su analizi verisi alınırken bir hata oluştu.');
    }
}

/**
 * IZSU Şübeler
 */
async function getBranches() {
    try {
        const response = await httpClient.get(`${BASE_URL}/subeler`);
        return response.data || [];
    } catch (error) {
        throw new Error('IZSU şubeler verisi alınırken bir hata oluştu.');
    }
}

/**
 * IZSU Vezneler
 */
async function getCashDesks() {
    try {
        const response = await httpClient.get(`${BASE_URL}/vezneler`);
        return response.data || [];
    } catch (error) {
        throw new Error('IZSU vezneler verisi alınırken bir hata oluştu.');
    }
}

/**
 * IZSU Baraj Su Kalite Raporları
 */
async function getDamWaterQuality() {
    try {
        const response = await httpClient.get(`${BASE_URL}/barajsukaliteraporlari`);
        return response.data || [];
    } catch (error) {
        throw new Error('IZSU baraj su kalite raporları alınırken bir hata oluştu.');
    }
}

export {
    getWaterOutages,
    getDamStatus,
    getDamAndWells,
    getDailyWaterProduction,
    getWaterProductionDistribution,
    getWeeklyWaterAnalysis,
    getPeripheryWaterAnalysis,
    getBranches,
    getCashDesks,
    getDamWaterQuality
};
