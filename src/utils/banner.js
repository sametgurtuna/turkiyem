import chalk from 'chalk';
import gradient from 'gradient-string';

const logo = `
  ████████╗██╗   ██╗██████╗ ██╗  ██╗██╗██╗   ██╗███████╗███╗   ███╗
  ╚══██╔══╝██║   ██║██╔══██╗██║ ██╔╝██║╚██╗ ██╔╝██╔════╝████╗ ████║
     ██║   ██║   ██║██████╔╝█████╔╝ ██║ ╚████╔╝ █████╗  ██╔████╔██║
     ██║   ██║   ██║██╔══██╗██╔═██╗ ██║  ╚██╔╝  ██╔══╝  ██║╚██╔╝██║
     ██║   ╚██████╔╝██║  ██║██║  ██╗██║   ██║   ███████╗██║ ╚═╝ ██║
     ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝   ╚═╝   ╚══════╝╚═╝     ╚═╝
`;

const BANNER = `
${gradient('red', 'white')(logo)}
                          ${chalk.white.bold('☾ ★')}

       ${gradient('white', 'red')('Türkiye Toplu Taşıma ve Deprem CLI')}
`;

export function printBanner() {
  console.log(BANNER);
}

export function printHelp() {
  printBanner();
  console.log(chalk.white.bold('  Komutlar:\n'));
  console.log(chalk.cyan('    turkiyem sehir <ankara|istanbul|adana|antalya|bursa|izmir|trabzon|samsun|mersin|kayseri>') + chalk.gray('\n                                              Şehir seç'));
  console.log(chalk.cyan('    turkiyem hat <numara>') + chalk.gray('             Hat sorgula'));
  console.log(chalk.cyan('    turkiyem hat canli <numara> [--detay]') + chalk.gray('  Canlı araç konumu (IETT)'));
  console.log(chalk.cyan('    turkiyem durak <id>') + chalk.gray('               Durak bazlı detay sorgula'));
  console.log(chalk.cyan('    turkiyem hava guncel [sehir|lat,lon]') + chalk.gray('  Güncel hava durumu'));
  console.log(chalk.cyan('    turkiyem hava saatlik [sehir|lat,lon] -g 2') + chalk.gray('  Saatlik hava tahmini'));
  console.log(chalk.cyan('    turkiyem hava kalite [sehir|lat,lon]') + chalk.gray('  Hava kalitesi ölçümleri'));
  console.log(chalk.cyan('    turkiyem deprem son24') + chalk.gray('             Son 24 saatteki depremler'));
  console.log(chalk.cyan('    turkiyem deprem 7gun') + chalk.gray('              Son 7 gündeki depremler'));
  console.log(chalk.cyan('    turkiyem deprem buyukluk <deger>') + chalk.gray('  Büyüklüğe göre deprem filtrele'));
  console.log(chalk.cyan('    turkiyem eczane nobetci [ilce]') + chalk.gray('    Nöbetçi eczaneleri sorgula (Sadece İzmir ve Kayseri)'));
  console.log(chalk.cyan('    turkiyem eczane ara <kelime>') + chalk.gray('      Eczane adına veya ilçeye göre ara (Sadece İzmir ve Kayseri)'));
  console.log(chalk.cyan('    turkiyem doviz [--tum]') + chalk.gray('            TCMB güncel döviz kurları'));
  console.log(chalk.cyan('    turkiyem ibb hatlar [arama]') + chalk.gray('       İBB/IETT hat listesi sorgula'));
  console.log(chalk.cyan('    turkiyem ibb duraklar [arama]') + chalk.gray('    İBB/IETT durak listesi sorgula'));
  console.log(chalk.cyan('    turkiyem ibb filo') + chalk.gray('                 IETT filo araç konumları'));
  console.log(chalk.cyan('    turkiyem ibb garaj') + chalk.gray('                IETT garaj bilgileri'));
  console.log(chalk.cyan('    turkiyem ibb kaza') + chalk.gray('                 Güncel kaza lokasyonları'));
  console.log(chalk.cyan('    turkiyem izsu kesinti') + chalk.gray('             İZSU güncel su kesintileri'));
  console.log(chalk.cyan('    turkiyem izsu baraj') + chalk.gray('               İZSU baraj ve kuyu durumları'));
  console.log(chalk.cyan('    turkiyem izsu uretim [-g] [-y]') + chalk.gray('    İZSU günlük/yıllık su üretimi dağılımı'));
  console.log(chalk.cyan('    turkiyem izsu sube [-v]') + chalk.gray('           İZSU şube ve vezneleri'));
  console.log(chalk.cyan('    turkiyem izsu analiz [-h|-c|-b]') + chalk.gray('   İZSU su analiz raporları'));
  console.log(chalk.cyan('    turkiyem temizle') + chalk.gray('                  Cache ve ayarları temizle'));
  console.log(chalk.cyan('    turkiyem --version') + chalk.gray('                Versiyonu göster'));
  console.log('');
}
