import chalk from 'chalk';
import ora from 'ora';
import { getCity } from '../utils/config.js';
import { fetchEgoSchedule } from '../services/egoService.js';
import { fetchIettLiveVehicles, fetchIettRouteWithPlannedTimes } from '../services/iettService.js';
import { fetchAdanaBuses, fetchAdanaBusDetails } from '../services/adanaService.js';
import { fetchAntalyaFormOptions, fetchAntalyaRouteSchedule } from '../services/antalyaService.js';
import { searchBursaRouteAndStation, getBursaRouteStops, getBursaScheduleByStop, getBursaRealTimeLocation } from '../services/bursaService.js';
import { searchIzmirRoutes, getIzmirRouteStopsAndSchedule } from '../services/izmirService.js';
import prompts from 'prompts';
import {
  createEgoInfoTable,
  createIettLiveDetailTable,
  createIettLiveSummaryTable,
  createEgoScheduleTable,
  createIettPlannedTimesTable,
  createRouteTable,
  createAdanaBusInfoTable,
  createAdanaScheduleTable,
  createAdanaStopsTable,
  createAntalyaScheduleTable,
  createBursaRouteStopsTable,
  createBursaLiveTrackingTable,
  createIzmirStopsTable,
  createIzmirScheduleTable,
} from '../utils/display.js';

export async function hatSorgula(hatNo) {
  if (!hatNo) {
    console.log(chalk.red('Hat numarası belirtmelisiniz. Örnek: turkiyem hat 340'));
    return;
  }

  const city = getCity();

  if (!city) {
    console.log(chalk.yellow('Henüz şehir seçmediniz. Önce şehir seçin:'));
    console.log(chalk.cyan('  turkiyem sehir ankara'));
    console.log(chalk.cyan('  turkiyem sehir istanbul'));
    return;
  }

  if (city === 'ankara') {
    await queryEgo(hatNo);
  } else if (city === 'istanbul') {
    await queryIett(hatNo);
  } else if (city === 'adana') {
    await queryAdana(hatNo);
  } else if (city === 'antalya') {
    await queryAntalya(hatNo);
  } else if (city === 'bursa') {
    await queryBursa(hatNo);
  } else if (city === 'izmir') {
    await queryIzmir(hatNo);
  } else {
    console.log(chalk.red(`Desteklenmeyen şehir: ${city}. ankara, istanbul, adana, antalya, bursa veya izmir seçin.`));
  }
}

async function queryAntalya(hatNo) {
  const spinner = ora('Antalya hat listesi alınıyor...').start();
  try {
    const { buses } = await fetchAntalyaFormOptions();
    const query = hatNo.toUpperCase();
    const matches = buses.filter(b => b.name.includes(query) || b.name === query);

    if (matches.length === 0) {
      spinner.fail(chalk.yellow(`"${hatNo}" aramasıyla eşleşen Antalya otobüs hattı bulunamadı.`));
      return;
    }

    spinner.stop();
    let targetId = matches[0].id;
    let selectedName = matches[0].name;

    if (matches.length > 1) {
      const response = await prompts({
        type: 'select',
        name: 'selectedTarget',
        message: `Birden fazla hat bulundu. Hangisini görmek istersiniz?`,
        choices: matches.map(m => ({ title: m.name, value: m.id }))
      });
      targetId = response.selectedTarget;
      selectedName = matches.find(m => m.id === targetId)?.name;
      if (!targetId) return;
    }

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
        { title: 'Dönüş', value: '0' }
      ]
    });
    if (selectedDirection === undefined) return;

    spinner.start(`Hat detayları alınıyor (${selectedName})...`);
    const schedule = await fetchAntalyaRouteSchedule(targetId, selectedDay, selectedDirection);

    if (schedule.length === 0) {
      spinner.info(chalk.yellow(`Bu hatta, seçilen gün ve yönde veri bulunamadı.`));
      return;
    }

    spinner.succeed(`Hat bilgileri alındı`);
    console.log('');
    console.log(chalk.white.bold(`  ${selectedName} Hat Güzergahı`));
    console.log(chalk.gray(`  Not: Resmi tabloda seferin tüm duraklardan geçiş saatleri için yalnızca bir örnek (genelde ilk sefer) yer almaktadır.`));
    console.log(createAntalyaScheduleTable(schedule));

  } catch (err) {
    spinner.fail(chalk.red(err.message));
  }
}

async function queryAdana(hatNo) {
  const spinner = ora(`Adana otobüs listesi alınıyor...`).start();
  try {
    const listData = await fetchAdanaBuses();
    const matches = listData.buses.filter(b => b.name.includes(hatNo.toUpperCase()));

    if (matches.length === 0) {
      spinner.fail(chalk.yellow(`"${hatNo}" aramasıyla eşleşen Adana otobüs hattı bulunamadı.`));
      return;
    }

    spinner.stop();
    let target = matches[0].target;
    let selectedName = matches[0].name;

    if (matches.length > 1) {
      const response = await prompts({
        type: 'select',
        name: 'selectedTarget',
        message: `Birden fazla hat bulundu. Hangisini görmek istersiniz?`,
        choices: matches.map(m => ({ title: m.name, value: m.target }))
      });
      target = response.selectedTarget;
      selectedName = matches.find(m => m.target === target)?.name;
      if (!target) return;
    }

    spinner.start(`Hat detayları alınıyor (${selectedName})...`);
    const details = await fetchAdanaBusDetails(target, listData.state);
    spinner.succeed(`Hat bilgileri alındı`);
    console.log('');

    console.log(chalk.white.bold('  Hat Bilgileri (Adana)'));
    console.log(createAdanaBusInfoTable(details));
    console.log('');

    if (details.schedule.length > 0) {
      console.log(createAdanaScheduleTable(details.schedule));
      console.log('');
    }

    if (details.stops.length > 0) {
      console.log(chalk.white.bold('  Durak Listesi (Durak Detayı İçin: turkiyem durak <StopID>)'));
      console.log(createAdanaStopsTable(details.stops));
    }
  } catch (err) {
    spinner.fail(chalk.red(err.message));
  }
}

export async function hatCanliSorgula(hatNo, options = {}) {
  if (!hatNo) {
    console.log(chalk.red('Hat numarası belirtmelisiniz. Örnek: turkiyem hat canli 34AS'));
    return;
  }

  const city = getCity();
  if (!city) {
    console.log(chalk.yellow('Henüz şehir seçmediniz. Önce şehir seçin:'));
    console.log(chalk.cyan('  turkiyem sehir istanbul'));
    return;
  }

  if (city === 'istanbul') {
    const spinner = ora(`IETT canlı araç konumları alınıyor (${hatNo})...`).start();
    try {
      const liveData = await fetchIettLiveVehicles(hatNo);
      spinner.succeed(`IETT canlı konum verisi alındı (${liveData.summary.totalVehicles} araç)`);
      console.log('');

      console.log(chalk.white.bold('  IETT Canlı Konum Özeti'));
      console.log(createIettLiveSummaryTable(liveData));

      if (options.detay) {
        console.log('');
        console.log(chalk.white.bold('  IETT Canlı Konum Detayları'));
        console.log(createIettLiveDetailTable(liveData));
      } else {
        console.log('');
        console.log(chalk.gray('  Detay tablo için: turkiyem hat canli <numara> --detay'));
      }
    } catch (err) {
      spinner.fail(chalk.red(err.message));
    }
  } else if (city === 'bursa') {
    await queryBursaLive(hatNo);
  } else {
    console.log(chalk.yellow('Canlı konum özelliği sadece İstanbul (IETT) ve Bursa için kullanılabilir.'));
    console.log(chalk.gray('Önce şehir seçimini güncelleyin: turkiyem sehir istanbul | bursa'));
  }
}

async function queryEgo(hatNo) {
  const spinner = ora(`EGO hat ${hatNo} bilgileri alınıyor...`).start();

  try {
    const result = await fetchEgoSchedule(hatNo);

    spinner.succeed(`Hat ${hatNo} bilgileri alındı`);
    console.log('');

    console.log(chalk.white.bold('  Hat Bilgileri'));
    console.log(createEgoInfoTable(result.info));
    console.log('');

    if (result.schedule && result.schedule.length > 0) {
      console.log(chalk.white.bold('  Sefer Saatleri'));
      console.log(createEgoScheduleTable(result.schedule));
    } else {
      console.log(chalk.yellow('  Sefer saati bilgisi bulunamadı.'));
    }
  } catch (err) {
    spinner.fail(chalk.red(err.message));
  }
}

async function queryIett(hatNo) {
  const spinner = ora(`IETT hat ${hatNo} bilgileri alınıyor...`).start();

  try {
    const result = await fetchIettRouteWithPlannedTimes(hatNo);

    spinner.succeed(`Hat ${hatNo} bilgileri alındı`);
    console.log('');

    console.log(chalk.white.bold('  Hat Bilgileri (IETT)'));
    console.log(createRouteTable(result.routeSummary));

    if (result.sourceStatus.soap && result.plannedTimes && result.plannedTimes.groups.length > 0) {
      console.log('');
      console.log(chalk.white.bold('  Planlanan Sefer Saatleri (IETT SOAP)'));
      console.log(createIettPlannedTimesTable(result.plannedTimes));
    } else if (result.sourceStatus.soap) {
      console.log('');
      console.log(chalk.yellow('  Planlanan sefer saati verisi boş döndü.'));
    } else {
      console.log('');
      console.log(chalk.yellow('  IETT SOAP servisi kullanılamadı, GTFS özeti gösteriliyor.'));
      console.log(chalk.gray(`  Detay: ${result.sourceStatus.soapError}`));
    }
  } catch (err) {
    spinner.fail(chalk.red(err.message));
  }
}

async function queryBursa(hatNo) {
  const spinner = ora(`Bursa hat araması yapılıyor (${hatNo})...`).start();
  try {
    const searchResults = await searchBursaRouteAndStation(hatNo);
    // Filter only routes (type === 'R') and match exactly or contains
    const routes = searchResults.filter(r => r.type === 'R');
    const matches = routes.filter(r => r.aciklama.toUpperCase().includes(hatNo.toUpperCase()));

    if (matches.length === 0) {
      spinner.fail(chalk.yellow(`"${hatNo}" aramasıyla eşleşen Bursa otobüs hattı bulunamadı.`));
      return;
    }

    spinner.stop();
    let selectedRoute = matches[0];

    if (matches.length > 1) {
      const response = await prompts({
        type: 'select',
        name: 'route',
        message: `Birden fazla hat bulundu. Hangisini görmek istersiniz?`,
        choices: matches.map(m => ({ title: m.aciklama, value: m }))
      });
      selectedRoute = response.route;
      if (!selectedRoute) return;
    }

    const directionResponse = await prompts({
      type: 'select',
      name: 'direction',
      message: 'Hangi yönü görmek istiyorsunuz?',
      choices: [
        { title: 'Gidiş', value: '1' },
        { title: 'Dönüş', value: '2' }
      ]
    });
    if (!directionResponse.direction) return;

    spinner.start(`Hat durakları alınıyor (${selectedRoute.aciklama})...`);
    const stops = await getBursaRouteStops(selectedRoute.hatNo.toString(), directionResponse.direction);

    spinner.succeed(`Hat bilgileri alındı`);
    console.log('');
    console.log(chalk.white.bold(`  ${selectedRoute.aciklama} Hat Durakları (Bursa)`));
    if (stops.length > 0) {
      console.log(createBursaRouteStopsTable(stops));
      console.log(chalk.gray('  Durak detayları ve zaman tablosu için: turkiyem durak <Durak ID>'));
    } else {
      console.log(chalk.yellow(`  Bu hatta durak verisi bulunamadı.`));
    }
  } catch (err) {
    spinner.fail(chalk.red(err.message));
  }
}

async function queryBursaLive(hatNo) {
  const spinner = ora(`Bursa hat araması yapılıyor (${hatNo})...`).start();
  try {
    const searchResults = await searchBursaRouteAndStation(hatNo);
    const routes = searchResults.filter(r => r.type === 'R');
    const matches = routes.filter(r => r.aciklama.toUpperCase().includes(hatNo.toUpperCase()));

    if (matches.length === 0) {
      spinner.fail(chalk.yellow(`"${hatNo}" aramasıyla eşleşen Bursa otobüs hattı bulunamadı.`));
      return;
    }

    spinner.stop();
    let selectedRoute = matches[0];

    if (matches.length > 1) {
      const response = await prompts({
        type: 'select',
        name: 'route',
        message: `Birden fazla hat bulundu. Hangisini görmek istersiniz?`,
        choices: matches.map(m => ({ title: m.aciklama, value: m }))
      });
      selectedRoute = response.route;
      if (!selectedRoute) return;
    }

    spinner.start(`Canlı araç konumları alınıyor (${selectedRoute.aciklama})...`);
    const liveData = await getBursaRealTimeLocation(selectedRoute.hatNo.toString());

    if (liveData.length === 0) {
      spinner.info(`Şu an bu hatta aktif araç bulunmuyor.`);
      return;
    }

    spinner.succeed(`Bursa canlı konum verisi alındı (${liveData.length} araç)`);
    console.log('');
    console.log(chalk.white.bold(`  ${selectedRoute.aciklama} - Anlık Araç Bilgileri`));
    console.log(createBursaLiveTrackingTable(liveData));
  } catch (err) {
    spinner.fail(chalk.red(err.message));
  }
}

async function queryIzmir(hatNo) {
  const spinner = ora(`İzmir hat araması yapılıyor (${hatNo})...`).start();
  try {
    const matches = await searchIzmirRoutes(hatNo, spinner);

    if (matches.length === 0) {
      spinner.fail(chalk.yellow(`"${hatNo}" aramasıyla eşleşen İzmir ESHOT hattı bulunamadı.`));
      return;
    }

    spinner.stop();
    let selectedRouteId = matches[0].route_id;
    let selectedRouteName = `${matches[0].route_short_name} - ${matches[0].route_long_name}`;

    if (matches.length > 1) {
      const response = await prompts({
        type: 'select',
        name: 'routeId',
        message: 'Birden fazla hat bulundu. Hangisini görmek istersiniz?',
        choices: matches.map(m => ({ title: `${m.route_short_name} - ${m.route_long_name}`, value: m.route_id }))
      });
      selectedRouteId = response.routeId;
      if (!selectedRouteId) return;
      const r = matches.find(m => m.route_id === selectedRouteId);
      selectedRouteName = `${r.route_short_name} - ${r.route_long_name}`;
    }

    spinner.start(`Hat detayları alınıyor (${selectedRouteName})...`);
    const details = await getIzmirRouteStopsAndSchedule(selectedRouteId, spinner);
    spinner.succeed(`Hat bilgileri alındı`);

    console.log('');
    console.log(chalk.white.bold(`  ${selectedRouteName} Hat Durakları (İlk Yön)`));
    if (details.stops && details.stops.length > 0) {
      console.log(createIzmirStopsTable(details.stops));
    } else {
      console.log(chalk.yellow('  Bu hatta durak verisi bulunamadı.'));
    }

    console.log('');
    console.log(chalk.white.bold(`  Sefer Saatleri (İlk Duraktan Kalkışlar)`));
    if (details.schedule && details.schedule.length > 0) {
      console.log(createIzmirScheduleTable(details.schedule));
    } else {
      console.log(chalk.yellow('  Sefer saati verisi bulunamadı.'));
    }

  } catch (err) {
    if (spinner.isSpinning) spinner.fail(chalk.red('İzmir ESHOT verisi alınamadı.'));
    console.log(chalk.red(err.message));
  }
}
