import chalk from 'chalk';
import ora from 'ora';
import { fetchAirQuality, fetchCurrentWeather, fetchHourlyForecast } from '../services/weatherService.js';
import {
  createAirQualityTable,
  createCurrentWeatherTable,
  createHourlyWeatherTable,
} from '../utils/display.js';

function formatLocationHint(city) {
  if (city) return city;
  return 'seçili şehir';
}

export async function havaGuncel(city) {
  const spinner = ora(`Güncel hava verisi alınıyor (${formatLocationHint(city)})...`).start();

  try {
    const result = await fetchCurrentWeather(city);
    spinner.succeed('Güncel hava verisi alındı');
    console.log('');
    console.log(createCurrentWeatherTable(result));
  } catch (err) {
    spinner.fail(chalk.red(err.message));
  }
}

export async function havaSaatlik(city, days) {
  const parsedDays = Number.parseInt(days, 10);
  if (!Number.isNaN(parsedDays) && (parsedDays < 1 || parsedDays > 7)) {
    console.log(chalk.red('Gün sayısı 1 ile 7 arasında olmalıdır.'));
    return;
  }

  const spinner = ora(`Saatlik tahmin verisi alınıyor (${formatLocationHint(city)})...`).start();

  try {
    const result = await fetchHourlyForecast(city, parsedDays || 2);
    spinner.succeed(`Saatlik tahmin verisi alındı (${result.forecastDays} gün)`);
    console.log('');
    console.log(createHourlyWeatherTable(result));
  } catch (err) {
    spinner.fail(chalk.red(err.message));
  }
}

export async function havaKalitesi(city) {
  const spinner = ora(`Hava kalitesi verisi alınıyor (${formatLocationHint(city)})...`).start();

  try {
    const result = await fetchAirQuality(city);
    spinner.succeed('Hava kalitesi verisi alındı');
    console.log('');
    console.log(createAirQualityTable(result));
  } catch (err) {
    spinner.fail(chalk.red(err.message));
  }
}
