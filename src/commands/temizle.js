import chalk from 'chalk';
import { flushCache } from '../utils/cache.js';
import { resetConfig } from '../utils/config.js';

export function temizle() {
  try {
    flushCache();
    resetConfig();
    console.log(chalk.green('Cache ve yapılandırma başarıyla temizlendi.'));
  } catch (err) {
    console.log(chalk.red(`Temizleme sırasında hata oluştu: ${err.message}`));
  }
}
