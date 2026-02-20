import chalk from 'chalk';
import ora from 'ora';
import { fetchExchangeRates } from '../services/tcmbService.js';
import { createDovizTable } from '../utils/display.js';

export async function dovizKurlari(options) {
    const spinner = ora('TCMB döviz kurları alınıyor...').start();

    try {
        const result = await fetchExchangeRates();
        spinner.succeed(`TCMB kurları alındı (Tarih: ${result.date || '-'})`);

        const popular = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'DKK', 'SEK', 'NOK'];
        const kurlar = options.tum ? result.currencies : result.currencies.filter(c => popular.includes(c.kodu));

        console.log('');
        console.log(createDovizTable({ ...result, currencies: kurlar }));

        if (!options.tum) {
            console.log('');
            console.log(chalk.gray('  Tüm kurları görmek için: turkiyem doviz --tum'));
        }
    } catch (err) {
        spinner.fail(chalk.red(err.message));
    }
}
