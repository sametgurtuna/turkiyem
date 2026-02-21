import chalk from 'chalk';
import { setCity, getCity } from '../utils/config.js';

const SUPPORTED_CITIES = ['ankara', 'istanbul', 'adana', 'antalya', 'bursa', 'izmir', 'trabzon', 'samsun', 'mersin', 'kayseri'];

export function sehirSec(city) {
  if (!city) {
    const current = getCity();
    if (current) {
      console.log(chalk.green(`Şu an seçili şehir: ${chalk.bold(current)}`));
    } else {
      console.log(chalk.yellow('Henüz şehir seçilmemiş.'));
    }
    console.log('');
    console.log(chalk.white('Kullanım:'));
    console.log(chalk.cyan('  turkiyem sehir ankara'));
    console.log(chalk.cyan('  turkiyem sehir istanbul'));
    console.log(chalk.cyan('  turkiyem sehir adana'));
    console.log(chalk.cyan('  turkiyem sehir antalya'));
    console.log(chalk.cyan('  turkiyem sehir bursa'));
    console.log(chalk.cyan('  turkiyem sehir izmir'));
    console.log(chalk.cyan('  turkiyem sehir trabzon'));
    console.log(chalk.cyan('  turkiyem sehir samsun'));
    console.log(chalk.cyan('  turkiyem sehir mersin'));
    console.log(chalk.cyan('  turkiyem sehir kayseri'));
    return;
  }

  const normalized = city.toLowerCase().trim();

  if (!SUPPORTED_CITIES.includes(normalized)) {
    console.log(chalk.red(`"${city}" desteklenmiyor.`));
    console.log(chalk.white('Desteklenen şehirler:'));
    SUPPORTED_CITIES.forEach((c) => {
      console.log(chalk.cyan(`  - ${c}`));
    });
    return;
  }

  setCity(normalized);
  console.log(chalk.green(`Şehir "${chalk.bold(normalized)}" olarak ayarlandı.`));
}
