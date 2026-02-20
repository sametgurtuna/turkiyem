import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import boxen from 'boxen';
import { fetchEarthquakes, fetchByMagnitude } from '../services/afadService.js';
import { createEarthquakeTable } from '../utils/display.js';

async function displayPaginatedEarthquakes(earthquakes) {
  const PAGE_SIZE = 15;
  let page = 0;

  // Highlight critical earthquakes first
  const critical = earthquakes.filter(eq => parseFloat(eq.magnitude) >= 4.0);
  if (critical.length > 0) {
    console.log(boxen(
      chalk.red.bold(`DİKKAT! Son verilerde ${critical.length} adet >= 4.0 büyüklüğünde deprem var:\n\n`) +
      critical.map(c => `📍 ${c.location} - Büyüklük: ${c.magnitude}`).join('\n'),
      { padding: 1, borderColor: 'red', borderStyle: 'double' }
    ));
    console.log('');
  }

  while (page * PAGE_SIZE < earthquakes.length) {
    const chunk = earthquakes.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    console.log(createEarthquakeTable(chunk));

    if ((page + 1) * PAGE_SIZE < earthquakes.length) {
      const { devam } = await prompts({
        type: 'confirm',
        name: 'devam',
        message: 'Sonraki sayfa gösterilsin mi?',
        initial: true
      });

      if (!devam) break;
      page++;
    } else {
      break;
    }
  }
}

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
    await displayPaginatedEarthquakes(earthquakes);
  } catch (err) {
    spinner.fail(boxen(chalk.red(err.message), { padding: 1, borderColor: 'red' }));
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
    await displayPaginatedEarthquakes(earthquakes);
  } catch (err) {
    spinner.fail(boxen(chalk.red(err.message), { padding: 1, borderColor: 'red' }));
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
    await displayPaginatedEarthquakes(earthquakes);
  } catch (err) {
    spinner.fail(boxen(chalk.red(err.message), { padding: 1, borderColor: 'red' }));
  }
}
