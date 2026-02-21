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
  console.log(chalk.cyan('    turkiyem temizle') + chalk.gray('                  Cache ve ayarları temizle'));
  console.log(chalk.cyan('    turkiyem --version') + chalk.gray('                Versiyonu göster'));
  console.log('');
}
