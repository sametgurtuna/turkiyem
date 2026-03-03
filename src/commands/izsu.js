import chalk from 'chalk';
import { withSpinner } from '../utils/spinnerWrapper.js';
import {
    getWaterOutages,
    getDamStatus,
    getDamAndWells,
    getDailyWaterProduction,
    getWaterProductionDistribution,
    getBranches,
    getCashDesks,
    getWeeklyWaterAnalysis,
    getPeripheryWaterAnalysis,
    getDamWaterQuality
} from '../services/izsuService.js';
import {
    createWaterOutagesTable,
    createDamStatusTable,
    createWaterProductionTable,
    createBranchesTable
} from '../utils/display.js';
import boxen from 'boxen';

async function displayWaterOutages() {
    const result = await withSpinner(
        'Su kesintileri verisi alınıyor...',
        getWaterOutages,
        'Su kesintileri verisi başarıyla alındı!'
    );

    if (!result || result.length === 0) {
        console.log(chalk.yellow('\nŞu anda planlı veya arıza kaynaklı su kesintisi bulunmamaktadır.'));
        return;
    }

    console.log(chalk.bold.cyan('\n🚿 İZSU Su Kesintileri:\n'));
    console.log(createWaterOutagesTable(result));
}

async function displayDamStatus() {
    const result = await withSpinner(
        'Baraj ve kuyu verileri alınıyor...',
        () => Promise.all([getDamStatus(), getDamAndWells()]),
        'Baraj ve kuyu verileri başarıyla alındı!'
    );

    if (!result) return;
    const [dams, damsAndWells] = result;

    if (!dams || dams.length === 0) {
        console.log(chalk.red('\nBaraj verisi bulunamadı.'));
    } else {
        console.log(chalk.bold.cyan('\n💧 İZSU Baraj Doluluk Durumları:\n'));
        console.log(createDamStatusTable(dams));
    }

    if (damsAndWells && damsAndWells.length > 0) {
        console.log(chalk.bold.cyan('\n🚰 Baraj ve Kuyular:\n'));
        damsAndWells.forEach(dw => {
            console.log(chalk.green(`- ${dw.Adi || 'Bilinmeyen'}`));
        });
    }
}

async function displayWaterProduction(options) {
    if (options.gunluk) {
        const result = await withSpinner(
            'Günlük su üretimi verisi alınıyor...',
            getDailyWaterProduction,
            'Günlük su üretimi verisi başarıyla alındı!'
        );

        if (!result || !result.BarajKuyuUretimleri || result.BarajKuyuUretimleri.length === 0) {
            console.log(chalk.yellow('\nGünlük su üretimi verisi bulunamadı.'));
            return;
        }

        console.log(chalk.bold.cyan(`\n🌊 İZSU Günlük Su Üretimi (${result.UretimTarihi.split('T')[0]}):\n`));
        console.log(createWaterProductionTable(result));
    } else {
        const year = options.yil || new Date().getFullYear();
        const result = await withSpinner(
            `${year} yılı su üretimi verisi alınıyor...`,
            () => getWaterProductionDistribution(year),
            `${year} yılı su üretimi verisi başarıyla alındı!`
        );

        if (!result || result.length === 0) {
            console.log(chalk.yellow(`\n${year} yılına ait üretim dağılımı bulunamadı.`));
            return;
        }

        console.log(chalk.bold.cyan(`\n🌊 İZSU Su Üretimi Dağılımı (${year}):\n`));

        // Group by month
        const groupedByMonth = {};
        result.forEach(item => {
            if (!groupedByMonth[item.Ay]) groupedByMonth[item.Ay] = [];
            groupedByMonth[item.Ay].push(item);
        });

        Object.keys(groupedByMonth).sort((a, b) => b - a).forEach(month => {
            console.log(chalk.bold.yellow(`${month}. Ay`));
            console.log(createWaterProductionTable({ BarajKuyuUretimleri: groupedByMonth[month] }));
        });
    }
}

async function displayBranches(options) {
    if (options.vezne) {
        const result = await withSpinner(
            'Vezneler verisi alınıyor...',
            getCashDesks,
            'Vezneler verisi başarıyla alındı!'
        );

        if (!result || result.length === 0) {
            console.log(chalk.yellow('\nVezne bulunamadı.'));
            return;
        }

        console.log(chalk.bold.cyan('\n💳 İZSU Vezneleri:\n'));
        console.log(createBranchesTable(result, true));
    } else {
        const result = await withSpinner(
            'Şubeler verisi alınıyor...',
            getBranches,
            'Şubeler verisi başarıyla alındı!'
        );

        if (!result || result.length === 0) {
            console.log(chalk.yellow('\nŞube bulunamadı.'));
            return;
        }

        console.log(chalk.bold.cyan('\n🏢 İZSU Şubeleri:\n'));
        console.log(createBranchesTable(result, false));
    }
}

async function displayAnalysis(options) {
    if (options.cevre) {
        const result = await withSpinner(
            'Çevre ilçe su analizi raporları alınıyor...',
            getPeripheryWaterAnalysis,
            'Çevre ilçe analiz verisi başarıyla alındı!'
        );

        if (!result || result.length === 0) {
            console.log(chalk.yellow('\nAnaliz verisi bulunamadı.'));
            return;
        }

        console.log(chalk.bold.cyan('\n🔬 Çevre İlçe Su Analizleri:\n'));
        result.forEach(ilce => {
            console.log(chalk.bold.yellow(`📍 ${ilce.IlceAdi || 'Bilinmeyen İlçe'}`));
            if (ilce.Noktalar && ilce.Noktalar.length > 0) {
                ilce.Noktalar.forEach(nokta => {
                    console.log(`   🔸 ${nokta.Adres || nokta.NoktaKodu || 'Bilinmeyen Nokta'}`);
                });
            }
        });
        console.log(chalk.gray(`\nNot: Tüm parametreler için detaylar çok uzun olduğu için sadece analiz noktaları gösterilmektedir.`));

    } else if (options.baraj) {
        const result = await withSpinner(
            'Baraj su kalite raporları alınıyor...',
            getDamWaterQuality,
            'Baraj kalite verisi başarıyla alındı!'
        );

        if (!result || !result.BarajAnalizleri || result.BarajAnalizleri.length === 0) {
            console.log(chalk.yellow('\nAnaliz verisi bulunamadı.'));
            return;
        }

        console.log(chalk.bold.cyan('\n📊 Baraj Su Kalite Raporları:\n'));
        result.BarajAnalizleri.forEach(baraj => {
            console.log(chalk.bold.green(`🌊 ${baraj.BarajAdi || 'Bilinmeyen Baraj'}`));
            console.log(`   Tarih: ${baraj.Tarih ? baraj.Tarih.split('T')[0] : '-'}`);
        });
        console.log(chalk.gray(`\nNot: Tüm parametreler için detaylar çok uzun olduğu için sadece baraj listesi gösterilmektedir.`));

    } else {
        const result = await withSpinner(
            'Haftalık su analizi raporları alınıyor...',
            getWeeklyWaterAnalysis,
            'Haftalık analiz verisi başarıyla alındı!'
        );

        if (!result || result.length === 0) {
            console.log(chalk.yellow('\nAnaliz verisi bulunamadı.'));
            return;
        }

        console.log(chalk.bold.cyan('\n🔬 Haftalık Su Analizleri:\n'));
        if (result.TumAnalizler && result.TumAnalizler.length > 0) {
            result.TumAnalizler.forEach(analiz => {
                console.log(chalk.bold.yellow(`📍 ${analiz.NoktaTanimi || 'Bilinmeyen Nokta'}`));
                console.log(`   Tarih: ${analiz.Tarih ? analiz.Tarih.split('T')[0] : '-'}`);
            });
        }
        console.log(chalk.gray(`\nNot: Tüm parametreler için detaylar çok uzun olduğu için sadece analiz noktaları gösterilmektedir.`));
    }
}

export function registerIzsuCommands(program) {
    const izsuCmd = program
        .command('izsu')
        .description('İZSU açık veri servisleri (Kesintiler, Barajlar, Üretim, Şubeler)');

    izsuCmd
        .command('kesinti')
        .description('Mevcut su kesintilerini listeler')
        .action(async () => {
            await displayWaterOutages();
        });

    izsuCmd
        .command('baraj')
        .description('Barajların ve kuyuların güncel durumunu listeler')
        .action(async () => {
            await displayDamStatus();
        });

    izsuCmd
        .command('uretim')
        .description('Su üretimi verilerini listeler (Varsayılan: yıllık dağılım)')
        .option('-g, --gunluk', 'Günlük su üretimini gösterir')
        .option('-y, --yil <year>', 'Belirtilen yıla ait su üretim dağılımını gösterir', new Date().getFullYear().toString())
        .action(async (options) => {
            await displayWaterProduction(options);
        });

    izsuCmd
        .command('sube')
        .description('İZSU şubelerini ve veznelerini listeler (Varsayılan: Şubeler)')
        .option('-v, --vezne', 'Sadece vezneleri gösterir')
        .action(async (options) => {
            await displayBranches(options);
        });

    izsuCmd
        .command('analiz')
        .description('Su analizi raporlarını listeler')
        .option('-h, --haftalik', 'Haftalık su analiz raporlarını gösterir')
        .option('-c, --cevre', 'Çevre ilçe su analiz raporlarını gösterir')
        .option('-b, --baraj', 'Baraj su kalite raporlarını gösterir')
        .action(async (options) => {
            await displayAnalysis(options);
        });
}
