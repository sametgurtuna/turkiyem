import chalk from 'chalk';
import ora from 'ora';
import { getCity } from '../utils/config.js';
import { fetchAdanaStopDetails } from '../services/adanaService.js';
import { fetchAntalyaStopSchedule } from '../services/antalyaService.js';
import { getBursaStationRemainingTime } from '../services/bursaService.js';
import { searchIzmirStops, getIzmirStopSchedule } from '../services/izmirService.js';
import { createAdanaStopDetailsTable, createAntalyaStopTable, createBursaStationRemainingTable, createIzmirStopScheduleTable } from '../utils/display.js';
import prompts from 'prompts';

export async function durakSorgula(stopId) {
    if (!stopId) {
        console.log(chalk.red('Durak ID belirtmelisiniz. Örnek: turkiyem durak 43681'));
        return;
    }

    const city = getCity();
    if (city === 'adana') {
        await queryAdanaStop(stopId);
    } else if (city === 'antalya') {
        await queryAntalyaStop(stopId);
    } else if (city === 'bursa') {
        await queryBursaStop(stopId);
    } else if (city === 'izmir') {
        await queryIzmirStop(stopId);
    } else {
        console.log(chalk.yellow('Durak sorgulaması şu an sadece Adana, Antalya, Bursa ve İzmir için destekleniyor.'));
        console.log(chalk.cyan('Şehri değiştirmek için: turkiyem sehir adana | antalya | bursa | izmir'));
        return;
    }
}

async function queryAdanaStop(stopId) {
    const spinner = ora(`Durak detayları alınıyor (${stopId})...`).start();

    try {
        const details = await fetchAdanaStopDetails(stopId);

        if (!details.stopName) {
            spinner.info(`"${stopId}" ID'sine sahip bir durak bulunamadı veya bilgi yok.`);
            return;
        }

        spinner.succeed(`Durak bilgileri alındı`);
        console.log('');

        console.log(chalk.white.bold('  Durak Bilgisi'));
        console.log(createAdanaStopDetailsTable(details));
        console.log('');

    } catch (err) {
        spinner.fail(chalk.red(err.message));
    }
}

async function queryAntalyaStop(stopId) {
    const { selectedDay } = await prompts({
        type: 'select',
        name: 'selectedDay',
        message: 'Hangi gün için tarife görmek istiyorsunuz?',
        choices: [
            { title: 'Pazartesi', value: '1' },
            { title: 'Salı', value: '2' },
            { title: 'Çarşamba', value: '3' },
            { title: 'Perşembe', value: '4' },
            { title: 'Cuma', value: '5' },
            { title: 'Cumartesi', value: '6' },
            { title: 'Pazar', value: '7' },
        ],
        initial: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1 // Default to current day
    });
    if (!selectedDay) return;

    const { selectedDirection } = await prompts({
        type: 'select',
        name: 'selectedDirection',
        message: 'Hangi yönü görmek istiyorsunuz?',
        choices: [
            { title: 'Gidiş', value: '1' },
            { title: 'Dönüş', value: '0' },
            { title: 'Fark Etmez (Tümü)', value: '' }
        ]
    });
    if (selectedDirection === undefined) return;

    const spinner = ora(`Antalya durak tarifesi alınıyor (${stopId})...`).start();
    try {
        const schedule = await fetchAntalyaStopSchedule(stopId, selectedDay, selectedDirection);

        if (schedule.length === 0) {
            spinner.info(chalk.yellow(`"${stopId}" ID'sine sahip durakta bu gün/yön için geçen hat bulunamadı veya durak geçersiz.`));
            return;
        }

        spinner.succeed(`Durak tarife bilgileri alındı`);
        console.log('');
        console.log(chalk.white.bold(`  Durak Detayları (${stopId})`));
        console.log(createAntalyaStopTable(schedule, stopId));

    } catch (err) {
        spinner.fail(chalk.red(err.message));
    }
}

async function queryBursaStop(stopId) {
    const spinner = ora(`Durağa yanaşan araçlar aranıyor (${stopId})...`).start();
    try {
        const remainingData = await getBursaStationRemainingTime(stopId);

        if (remainingData.length === 0) {
            spinner.info(chalk.yellow(`"${stopId}" ID'sine sahip durakta yaklaşan araç bulunamadı.`));
            return;
        }

        spinner.succeed(`Durak kalan süre bilgileri alındı`);
        console.log('');
        console.log(chalk.white.bold(`  Durak Detayları (${stopId})`));
        console.log(createBursaStationRemainingTable(remainingData));

    } catch (err) {
        spinner.fail(chalk.red(err.message));
    }
}

async function queryIzmirStop(stopId) {
    const spinner = ora(`İzmir durak araması yapılıyor (${stopId})...`).start();
    try {
        const matches = await searchIzmirStops(stopId, spinner);

        if (matches.length === 0) {
            spinner.fail(chalk.yellow(`"${stopId}" aramasıyla eşleşen İzmir durağı bulunamadı.`));
            return;
        }

        spinner.stop();
        let selectedStopId = matches[0].stop_id;
        let selectedStopName = matches[0].stop_name;

        if (matches.length > 1) {
            const response = await prompts({
                type: 'select',
                name: 'stopId',
                message: 'Birden fazla durak bulundu. Hangisini görmek istersiniz?',
                choices: matches.map(m => ({ title: m.stop_name, value: m.stop_id }))
            });
            selectedStopId = response.stopId;
            if (!selectedStopId) return;
            selectedStopName = matches.find(m => m.stop_id === selectedStopId).stop_name;
        }

        spinner.start(`Durak detayları alınıyor (${selectedStopName})...`);
        const schedule = await getIzmirStopSchedule(selectedStopId, spinner);

        spinner.succeed(`Durak bilgileri alındı`);
        console.log('');
        console.log(chalk.white.bold(`  ${selectedStopName} Durağından Geçecek Hatlar`));

        if (schedule.length > 0) {
            console.log(createIzmirStopScheduleTable(schedule));
        } else {
            console.log(chalk.yellow('  Bu duraktan geçecek araç bulunamadı.'));
        }

    } catch (err) {
        if (spinner.isSpinning) spinner.fail(chalk.red('İzmir durak verisi alınamadı.'));
        console.log(chalk.red(err.message));
    }
}
