#!/usr/bin/env node

import 'dotenv/config';
import { Command } from 'commander';
import { createRequire } from 'node:module';
import { printBanner, printHelp } from './utils/banner.js';
import { sehirSec } from './commands/sehir.js';
import { hatSorgula } from './commands/hat.js';
import { depremSon24, deprem7Gun, depremBuyukluk } from './commands/deprem.js';
import { havaGuncel, havaKalitesi, havaSaatlik } from './commands/hava.js';
import { temizle } from './commands/temizle.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

process.on('unhandledRejection', (err) => {
  console.error('Beklenmeyen hata:', err?.message || err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Kritik hata:', err?.message || err);
  process.exit(1);
});

const program = new Command();

program
  .name('turkiyem')
  .description('Türkiye Toplu Taşıma ve Deprem CLI')
  .version(pkg.version, '-v, --version', 'Versiyon göster')
  .helpOption('-h, --help', 'Yardım göster')
  .addHelpCommand(false);

program
  .command('sehir [sehir]')
  .description('Şehir seç (ankara veya istanbul)')
  .action((sehir) => {
    sehirSec(sehir);
  });

program
  .command('hat <numara>')
  .description('Hat bilgilerini sorgula')
  .action(async (numara) => {
    await hatSorgula(numara);
  });

const depremCmd = program
  .command('deprem')
  .description('Deprem verileri sorgula');

depremCmd
  .command('son24')
  .description('Son 24 saat depremler')
  .action(async () => {
    await depremSon24();
  });

depremCmd
  .command('7gun')
  .description('Son 7 gün depremler')
  .action(async () => {
    await deprem7Gun();
  });

depremCmd
  .command('buyukluk <deger>')
  .description('Büyüklüğe göre filtrele (ör: 4.0)')
  .action(async (deger) => {
    await depremBuyukluk(deger);
  });

const havaCmd = program
  .command('hava')
  .description('Hava durumu ve hava kalitesi sorgula');

havaCmd
  .command('guncel [sehirVeyaKoordinat]')
  .description('Güncel sıcaklık, rüzgar ve nem bilgisi')
  .action(async (sehirVeyaKoordinat) => {
    await havaGuncel(sehirVeyaKoordinat);
  });

havaCmd
  .command('saatlik [sehirVeyaKoordinat]')
  .description('Saatlik hava tahmini (varsayılan 2 gün)')
  .option('-g, --gun <gun>', 'Tahmin gün sayısı (1-7)', '2')
  .action(async (sehirVeyaKoordinat, options) => {
    await havaSaatlik(sehirVeyaKoordinat, options.gun);
  });

havaCmd
  .command('kalite [sehirVeyaKoordinat]')
  .description('Güncel hava kalitesi (PM10, PM2.5, CO, NO2)')
  .action(async (sehirVeyaKoordinat) => {
    await havaKalitesi(sehirVeyaKoordinat);
  });

program
  .command('temizle')
  .description('Cache ve yapılandırmayı temizle')
  .action(() => {
    temizle();
  });

program
  .command('help')
  .description('Yardım göster')
  .action(() => {
    printHelp();
  });

if (process.argv.length <= 2) {
  printHelp();
} else {
  program.parse(process.argv);
}
