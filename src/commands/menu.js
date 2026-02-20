import prompts from 'prompts';
import { printBanner } from '../utils/banner.js';
import { sehirSec } from './sehir.js';
import { hatSorgula } from './hat.js';
import { depremSon24, deprem7Gun } from './deprem.js';
import { havaGuncel, havaSaatlik } from './hava.js';
import { dovizKurlari } from './doviz.js';
import { durakSorgula } from './durak.js';

export async function showMenu() {
    printBanner();

    const response = await prompts({
        type: 'select',
        name: 'action',
        message: 'Ne yapmak istersin?',
        choices: [
            { title: '🌍 Deprem Bilgileri (Son 24 Saat)', value: 'deprem24' },
            { title: '🌍 Deprem Bilgileri (Son 7 Gün)', value: 'deprem7' },
            { title: '⛅ Güncel Hava Durumu', value: 'havaGuncel' },
            { title: '⛅ Saatlik Hava Tahmini', value: 'havaSaatlik' },
            { title: '🚌 Toplu Taşıma (Hat Sorgula)', value: 'hat' },
            { title: '🚏 Durak Sorgula (Adana/Antalya/Bursa/İzmir)', value: 'durak' },
            { title: '₺ Döviz Kurları (TCMB)', value: 'doviz' },
            { title: '⚙️  Şehir Değiştir', value: 'sehir' },
            { title: '❌ Çıkış', value: 'exit' }
        ]
    });

    if (!response.action || response.action === 'exit') {
        return;
    }

    switch (response.action) {
        case 'deprem24':
            await depremSon24();
            break;
        case 'deprem7':
            await deprem7Gun();
            break;
        case 'havaGuncel':
            await havaGuncel();
            break;
        case 'havaSaatlik':
            await havaSaatlik(undefined, 2);
            break;
        case 'hat': {
            const { hatNo } = await prompts({
                type: 'text',
                name: 'hatNo',
                message: 'Sorgulamak istediğiniz hat numarasını/adını girin:'
            });
            if (hatNo) await hatSorgula(hatNo);
            break;
        }
        case 'durak': {
            const { stopId } = await prompts({
                type: 'text',
                name: 'stopId',
                message: 'Durak numarasını (Stop ID / Durak No) girin:'
            });
            if (stopId) await durakSorgula(stopId);
            break;
        }
        case 'doviz':
            await dovizKurlari({ tum: false });
            break;
        case 'sehir': {
            const { sehir } = await prompts({
                type: 'select',
                name: 'sehir',
                message: 'Hangi şehri seçmek istersiniz?',
                choices: [
                    { title: 'Ankara', value: 'ankara' },
                    { title: 'İstanbul', value: 'istanbul' },
                    { title: 'Adana', value: 'adana' },
                    { title: 'Antalya', value: 'antalya' },
                    { title: 'Bursa', value: 'bursa' },
                    { title: 'İzmir', value: 'izmir' }
                ]
            });
            if (sehir) sehirSec(sehir);
            break;
        }
    }
}
