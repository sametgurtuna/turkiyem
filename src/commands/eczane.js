import chalk from 'chalk';
import ora from 'ora';
import { fetchNobetciEczaneler, fetchAllEczaneler, fetchKayseriNobetciEczaneler } from '../services/eczaneService.js';
import { createNobetciEczaneTable, createEczaneListTable } from '../utils/display.js';
import { getCity } from '../utils/config.js';

function getCityOrCheck() {
    const city = getCity() || 'izmir';
    if (!['izmir', 'kayseri'].includes(city)) {
        console.log(chalk.yellow('Eczane servisi şu an yalnızca İzmir ve Kayseri için desteklenmektedir. Lütfen uygulamanın şehrini değiştirin.'));
        process.exit(0);
    }
    return city;
}

export async function eczaneNobetci(ilce) {
    const city = getCityOrCheck();
    const spinner = ora('Nöbetçi eczaneler alınıyor...').start();
    try {
        let data = [];
        if (city === 'izmir') {
            data = await fetchNobetciEczaneler();
        } else if (city === 'kayseri') {
            const rawData = await fetchKayseriNobetciEczaneler();
            data = rawData.map(e => ({
                Bolge: e.district,
                Adi: e.name,
                Telefon: e.phone,
                Adres: e.address,
                LokasyonX: e.latitude,
                LokasyonY: e.longitude
            }));
        }
        let filtered = data;
        if (ilce) {
            const ilceUpper = ilce.toLocaleUpperCase('tr-TR');
            filtered = data.filter(e => e.Bolge && e.Bolge.toLocaleUpperCase('tr-TR').includes(ilceUpper));
        }

        spinner.succeed(`Nöbetçi eczane verisi alındı (${filtered.length} sonuç).`);

        if (filtered.length === 0) {
            console.log(chalk.yellow(`Belirtilen kritere (${ilce || 'tümü'}) uygun nöbetçi eczane bulunamadı.`));
            return;
        }
        console.log('\n' + createNobetciEczaneTable(filtered));
    } catch (error) {
        spinner.fail(chalk.red('Hata: ' + error.message));
    }
}

export async function eczaneAra(kelime) {
    const city = getCityOrCheck();

    if (city === 'kayseri') {
        console.log(chalk.yellow('Kayseri için şu anda tüm eczanelerde arama desteklenmemektedir (sadece nöbetçi eczaneleri sorgulayabilirsiniz).'));
        return;
    }

    const spinner = ora('Eczane listesi alınıyor...').start();
    try {
        const data = await fetchAllEczaneler();
        let filtered = data;
        if (kelime) {
            const kw = kelime.toLocaleUpperCase('tr-TR');
            filtered = data.filter(e =>
                (e.Adi && e.Adi.toLocaleUpperCase('tr-TR').includes(kw)) ||
                (e.Bolge && e.Bolge.toLocaleUpperCase('tr-TR').includes(kw)) ||
                (e.Adres && e.Adres.toLocaleUpperCase('tr-TR').includes(kw))
            );
        } else {
            spinner.info(`Sistemde kayıtlı toplam ${data.length} eczane bulunuyor.`);
            console.log(chalk.yellow('Arama yapmak için lütfen bir kelime veya ilçe giriniz:'));
            console.log(chalk.white('Örnek: turkiyem eczane ara Konak\n'));
            return;
        }

        spinner.succeed(`Eczane listesi alındı (${filtered.length} sonuç).`);

        if (filtered.length === 0) {
            console.log(chalk.yellow(`"${kelime}" ile eşleşen eczane bulunamadı.`));
            return;
        }

        if (filtered.length > 50) {
            console.log(chalk.yellow(`\nÇok fazla sonuç bulundu (${filtered.length}). Sadece ilk 50 kayıt gösteriliyor. Daha spesifik bir arama yapabilirsiniz.`));
            filtered = filtered.slice(0, 50);
        }

        console.log('\n' + createEczaneListTable(filtered));
    } catch (error) {
        spinner.fail(chalk.red('Hata: ' + error.message));
    }
}
