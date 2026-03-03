import chalk from 'chalk';
import prompts from 'prompts';
import boxen from 'boxen';
import { withSpinner } from '../utils/spinnerWrapper.js';
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
  const earthquakes = await withSpinner(
    'AFAD verileri alınıyor (son 24 saat)...',
    () => fetchEarthquakes('son24')
  );

  if (!earthquakes) return; // fail message already printed by wrapper
  if (earthquakes.length === 0) {
    console.log(chalk.yellow('Son 24 saatte kayıtlı deprem bulunamadı.'));
    return;
  }

  console.log(chalk.green(`✔ ${earthquakes.length} deprem bulundu (son 24 saat)\n`));
  await displayPaginatedEarthquakes(earthquakes);
}

export async function deprem7Gun() {
  const earthquakes = await withSpinner(
    'AFAD verileri alınıyor (son 7 gün)...',
    () => fetchEarthquakes('7gun')
  );

  if (!earthquakes) return;
  if (earthquakes.length === 0) {
    console.log(chalk.yellow('Son 7 günde kayıtlı deprem bulunamadı.'));
    return;
  }

  console.log(chalk.green(`✔ ${earthquakes.length} deprem bulundu (son 7 gün)\n`));
  await displayPaginatedEarthquakes(earthquakes);
}

export async function depremBuyukluk(value) {
  const min = parseFloat(value);
  if (isNaN(min)) {
    console.log(chalk.red('Geçerli bir büyüklük değeri girin. Örnek: turkiyem deprem buyukluk 4.0'));
    return;
  }

  const earthquakes = await withSpinner(
    `Büyüklüğü >= ${min} olan depremler aranıyor...`,
    () => fetchByMagnitude(min)
  );

  if (!earthquakes) return;
  if (earthquakes.length === 0) {
    console.log(chalk.yellow(`Büyüklüğü >= ${min} olan deprem bulunamadı (son 7 gün).`));
    return;
  }

  console.log(chalk.green(`✔ ${earthquakes.length} deprem bulundu (büyüklük >= ${min})\n`));
  await displayPaginatedEarthquakes(earthquakes);
}
