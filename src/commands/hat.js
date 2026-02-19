import chalk from 'chalk';
import ora from 'ora';
import { getCity } from '../utils/config.js';
import { fetchEgoSchedule } from '../services/egoService.js';
import { fetchIettRouteWithPlannedTimes } from '../services/iettService.js';
import {
  createEgoInfoTable,
  createEgoScheduleTable,
  createIettPlannedTimesTable,
  createRouteTable,
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
  } else {
    console.log(chalk.red(`Desteklenmeyen şehir: ${city}. ankara veya istanbul seçin.`));
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
