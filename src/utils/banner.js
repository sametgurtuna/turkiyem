import chalk from 'chalk';

const BANNER = `
${chalk.red.bold('  ████████╗██╗   ██╗██████╗ ██╗  ██╗██╗██╗   ██╗███████╗███╗   ███╗')}
${chalk.red.bold('  ╚══██╔══╝██║   ██║██╔══██╗██║ ██╔╝██║╚██╗ ██╔╝██╔════╝████╗ ████║')}
${chalk.red.bold('     ██║   ██║   ██║██████╔╝█████╔╝ ██║ ╚████╔╝ █████╗  ██╔████╔██║')}
${chalk.red.bold('     ██║   ██║   ██║██╔══██╗██╔═██╗ ██║  ╚██╔╝  ██╔══╝  ██║╚██╔╝██║')}
${chalk.red.bold('     ██║   ╚██████╔╝██║  ██║██║  ██╗██║   ██║   ███████╗██║ ╚═╝ ██║')}
${chalk.red.bold('     ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝   ╚═╝   ╚══════╝╚═╝     ╚═╝')}

                          ${chalk.white.bold('☾ ★')}

       ${chalk.gray('Türkiye Toplu Taşıma ve Deprem CLI')}
`;

export function printBanner() {
  console.log(BANNER);
}

export function printHelp() {
  printBanner();
  console.log(chalk.white.bold('  Komutlar:\n'));
  console.log(chalk.cyan('    turkiyem sehir <ankara|istanbul>') + chalk.gray('  Şehir seç'));
  console.log(chalk.cyan('    turkiyem hat <numara>') + chalk.gray('             Hat sorgula'));
  console.log(chalk.cyan('    turkiyem deprem son24') + chalk.gray('             Son 24 saat depremler'));
  console.log(chalk.cyan('    turkiyem deprem 7gun') + chalk.gray('              Son 7 gün depremler'));
  console.log(chalk.cyan('    turkiyem deprem buyukluk <deger>') + chalk.gray('  Büyüklüğe göre filtrele'));
  console.log(chalk.cyan('    turkiyem temizle') + chalk.gray('                  Cache ve config temizle'));
  console.log(chalk.cyan('    turkiyem --version') + chalk.gray('                Versiyon göster'));
  console.log('');
}
