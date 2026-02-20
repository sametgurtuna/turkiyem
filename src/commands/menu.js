import chalk from 'chalk';
import prompts from 'prompts';
import { printBanner } from '../utils/banner.js';
import { getCity } from '../utils/config.js';
import { sehirSec } from './sehir.js';
import { hatSorgula, hatCanliSorgula } from './hat.js';
import { depremSon24, deprem7Gun, depremBuyukluk } from './deprem.js';
import { havaGuncel, havaSaatlik, havaKalitesi } from './hava.js';
import { dovizKurlari } from './doviz.js';
import { durakSorgula } from './durak.js';

function printSessionHeader() {
    const city = getCity();
    const cityLabel = city ? chalk.green.bold(city) : chalk.yellow('seçilmedi');
    console.log('');
    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.gray(`  🏙️  Aktif şehir: ${cityLabel}  │  ${chalk.gray('Çıkmak için: Ctrl+C veya "Çıkış"')}`));
    console.log(chalk.gray('─'.repeat(60)));
    console.log('');
}

export async function showMenu() {
    printBanner();
    console.log(chalk.white.bold('  🇹🇷 Sürekli oturum modu — İşlem bitince otomatik menüye döner.\n'));

    // REPL loop — kullanıcı çıkış seçene kadar devam et
    while (true) {
        printSessionHeader();

        const response = await prompts({
            type: 'select',
            name: 'action',
            message: 'Ne yapmak istersin?',
            choices: [
                { title: '🚌 Toplu Taşıma (Hat Sorgula)', value: 'hat' },
                { title: '📍 Canlı Araç Takibi', value: 'canli' },
                { title: '🚏 Durak Sorgula', value: 'durak' },
                { title: '🌍 Deprem Bilgileri', value: 'deprem' },
                { title: '⛅ Hava Durumu', value: 'hava' },
                { title: '💱 Döviz Kurları (TCMB)', value: 'doviz' },
                { title: '⚙️  Şehir Değiştir', value: 'sehir' },
                { title: '❌ Çıkış', value: 'exit' }
            ]
        });

        // Ctrl+C veya Çıkış
        if (!response.action || response.action === 'exit') {
            console.log('');
            console.log(chalk.cyan('  Görüşmek üzere! 🇹🇷👋'));
            console.log('');
            break;
        }

        try {
            switch (response.action) {
                case 'hat': {
                    const { hatNo } = await prompts({
                        type: 'text',
                        name: 'hatNo',
                        message: 'Hat numarasını/adını girin:'
                    });
                    if (hatNo) await hatSorgula(hatNo);
                    break;
                }
                case 'canli': {
                    const { hatNo } = await prompts({
                        type: 'text',
                        name: 'hatNo',
                        message: 'Canlı takip için hat numarasını girin:'
                    });
                    if (hatNo) await hatCanliSorgula(hatNo, {});
                    break;
                }
                case 'durak': {
                    const { stopId } = await prompts({
                        type: 'text',
                        name: 'stopId',
                        message: 'Durak numarasını/adını girin:'
                    });
                    if (stopId) await durakSorgula(stopId);
                    break;
                }
                case 'deprem': {
                    const { subAction } = await prompts({
                        type: 'select',
                        name: 'subAction',
                        message: 'Hangi deprem verisi?',
                        choices: [
                            { title: '🕐 Son 24 Saat', value: 'son24' },
                            { title: '📅 Son 7 Gün', value: '7gun' },
                            { title: '📊 Büyüklüğe Göre Filtrele', value: 'buyukluk' },
                            { title: '↩ Geri', value: 'back' }
                        ]
                    });
                    if (subAction === 'son24') await depremSon24();
                    else if (subAction === '7gun') await deprem7Gun();
                    else if (subAction === 'buyukluk') {
                        const { deger } = await prompts({
                            type: 'text',
                            name: 'deger',
                            message: 'Minimum büyüklük değeri (ör: 4.0):'
                        });
                        if (deger) await depremBuyukluk(deger);
                    }
                    break;
                }
                case 'hava': {
                    const { subAction } = await prompts({
                        type: 'select',
                        name: 'subAction',
                        message: 'Hangi hava verisi?',
                        choices: [
                            { title: '🌡️ Güncel Hava', value: 'guncel' },
                            { title: '⏱️ Saatlik Tahmin', value: 'saatlik' },
                            { title: '🏭 Hava Kalitesi', value: 'kalite' },
                            { title: '↩ Geri', value: 'back' }
                        ]
                    });
                    if (subAction === 'back') break;
                    const { konum } = await prompts({
                        type: 'text',
                        name: 'konum',
                        message: 'Şehir adı veya koordinat (boş bırakırsan seçili şehir):'
                    });
                    const loc = konum || undefined;
                    if (subAction === 'guncel') await havaGuncel(loc);
                    else if (subAction === 'saatlik') await havaSaatlik(loc, 2);
                    else if (subAction === 'kalite') await havaKalitesi(loc);
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
        } catch (err) {
            console.log(chalk.red(`  Hata: ${err.message}`));
        }
    }
}
