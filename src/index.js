#!/usr/bin/env node

import 'dotenv/config';
import { Command } from 'commander';
import { createRequire } from 'node:module';
import { printBanner, printHelp } from './utils/banner.js';
import { sehirSec } from './commands/sehir.js';
import { hatCanliSorgula, hatSorgula } from './commands/hat.js';
import { durakSorgula } from './commands/durak.js';
import { depremSon24, deprem7Gun, depremBuyukluk } from './commands/deprem.js';
import { havaGuncel, havaKalitesi, havaSaatlik } from './commands/hava.js';
import { temizle } from './commands/temizle.js';
import { dovizKurlari } from './commands/doviz.js';
import { eczaneNobetci, eczaneAra } from './commands/eczane.js';
import { ibbHatlar, ibbDuraklar, ibbFilo, ibbGaraj, ibbKaza } from './commands/ibb.js';
import { registerIzsuCommands } from './commands/izsu.js';

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

const hatCmd = program
  .command('hat')
  .description('Hat bilgilerini sorgula');

hatCmd
  .argument('[arg1]', 'Hat numarası veya "canli"')
  .argument('[arg2]', 'Canlı komutu için hat numarası')
  .option('--detay', 'Araç bazlı detay tabloyu göster')
  .action(async (arg1, arg2, options) => {
    if (arg1 === 'canli') {
      await hatCanliSorgula(arg2, options);
      return;
    }
    await hatSorgula(arg1);
  });

program
  .command('durak <stopId>')
  .description('Durak bazlı detay sorgula (Adana, Antalya, Bursa, İzmir)')
  .action(async (stopId) => {
    await durakSorgula(stopId);
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

registerIzsuCommands(program);
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

const eczaneCmd = program
  .command('eczane')
  .description('Eczane işlemleri (İzmir ve Kayseri)');

eczaneCmd
  .command('nobetci [ilce]')
  .description('Nöbetçi eczaneleri sorgula (İlçe filtreli)')
  .action(async (ilce) => {
    await eczaneNobetci(ilce);
  });

eczaneCmd
  .command('ara [kelime]')
  .description('Tüm eczanelerde kelime veya ilçeye göre arama yap')
  .action(async (kelime) => {
    await eczaneAra(kelime);
  });

program
  .command('temizle')
  .description('Cache ve yapılandırmayı temizle')
  .action(() => {
    temizle();
  });

program
  .command('doviz')
  .description('TCMB güncel döviz kurlarını sorgula')
  .option('--tum', 'Tüm kurları göster')
  .action(async (options) => {
    await dovizKurlari(options);
  });

const ibbCmd = program
  .command('ibb')
  .description('İBB/IETT veri sorguları (hat listesi, durak, filo, garaj, kaza)');

ibbCmd
  .command('hatlar [arama]')
  .description('IETT hat listesi sorgula veya filtrele')
  .action(async (arama) => {
    await ibbHatlar(arama);
  });

ibbCmd
  .command('duraklar [arama]')
  .description('IETT durak listesi sorgula veya ara')
  .action(async (arama) => {
    await ibbDuraklar(arama);
  });

ibbCmd
  .command('filo')
  .description('IETT filo araç konumlarını göster')
  .action(async () => {
    await ibbFilo();
  });

ibbCmd
  .command('garaj')
  .description('IETT garaj bilgilerini göster')
  .action(async () => {
    await ibbGaraj();
  });

ibbCmd
  .command('kaza')
  .description('Güncel kaza lokasyonlarını göster')
  .action(async () => {
    await ibbKaza();
  });

program
  .command('help')
  .description('Yardım göster')
  .action(() => {
    printHelp();
  });

if (process.argv.length <= 2) {
  import('./commands/menu.js').then((m) => m.showMenu());
} else {
  program.parse(process.argv);
}
