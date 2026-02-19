import chalk from 'chalk';
import ora from 'ora';
import { fetchEarthquakes, fetchByMagnitude } from '../services/afadService.js';
import { createEarthquakeTable } from '../utils/display.js';

export async function depremSon24() {
  const spinner = ora('AFAD verileri alınıyor (son 24 saat)...').start();

  try {
    const earthquakes = await fetchEarthquakes('son24');

    if (!earthquakes || earthquakes.length === 0) {
      spinner.info('Son 24 saatte kayıtlı deprem bulunamadı.');
      return;
    }

    spinner.succeed(`${earthquakes.length} deprem bulundu (son 24 saat)`);
    console.log('');
    console.log(createEarthquakeTable(earthquakes));
  } catch (err) {
    spinner.fail(chalk.red(err.message));
  }
}

export async function deprem7Gun() {
  const spinner = ora('AFAD verileri alınıyor (son 7 gün)...').start();

  try {
    const earthquakes = await fetchEarthquakes('7gun');

    if (!earthquakes || earthquakes.length === 0) {
      spinner.info('Son 7 günde kayıtlı deprem bulunamadı.');
      return;
    }

    spinner.succeed(`${earthquakes.length} deprem bulundu (son 7 gün)`);
    console.log('');
    console.log(createEarthquakeTable(earthquakes));
  } catch (err) {
    spinner.fail(chalk.red(err.message));
  }
}

export async function depremBuyukluk(value) {
  const min = parseFloat(value);
  if (isNaN(min)) {
    console.log(chalk.red('Geçerli bir büyüklük değeri girin. Örnek: turkiyem deprem buyukluk 4.0'));
    return;
  }

  const spinner = ora(`Büyüklüğü >= ${min} olan depremler aranıyor...`).start();

  try {
    const earthquakes = await fetchByMagnitude(min);

    if (!earthquakes || earthquakes.length === 0) {
      spinner.info(`Büyüklüğü >= ${min} olan deprem bulunamadı (son 7 gün).`);
      return;
    }

    spinner.succeed(`${earthquakes.length} deprem bulundu (büyüklük >= ${min})`);
    console.log('');
    console.log(createEarthquakeTable(earthquakes));
  } catch (err) {
    spinner.fail(chalk.red(err.message));
  }
}
