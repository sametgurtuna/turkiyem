import chalk from 'chalk';
import prompts from 'prompts';
import { printBanner } from '../utils/banner.js';
import { getCity } from '../utils/config.js';

function printSessionHeader() {
    const city = getCity();
    const cityLabel = city ? chalk.green.bold(city) : chalk.yellow('seçilmedi');
    console.log('');
    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.gray(`  🏙️  Aktif şehir: ${cityLabel}  │  ${chalk.gray('Çıkmak için: Ctrl+C veya "exit"')}`));
    console.log(chalk.gray('─'.repeat(60)));
    console.log('');
}

export async function showMenu() {
    printBanner();
    console.log(chalk.white.bold('  🇹🇷 Sürekli oturum modu — Komutları direkt yazabilirsiniz (Örn: hat 500T, deprem son24)\n'));
    console.log(chalk.gray('  Tüm komutları görmek için "help" yazabilirsiniz.\n'));

    // REPL loop — kullanıcı çıkış seçene kadar devam et
    while (true) {
        printSessionHeader();

        const { cmd } = await prompts({
            type: 'text',
            name: 'cmd',
            message: chalk.cyan('turkiyem >')
        });

        if (cmd === undefined || cmd.trim().toLowerCase() === 'exit' || cmd.trim().toLowerCase() === 'çıkış') {
            console.log('');
            console.log(chalk.cyan('  Görüşmek üzere! 🇹🇷👋'));
            console.log('');
            break;
        }

        const args = cmd.trim().split(' ').filter(Boolean);

        if (args.length === 0) {
            continue;
        }

        try {
            const { spawnSync } = await import('node:child_process');
            spawnSync(process.argv[0], [process.argv[1], ...args], { stdio: 'inherit' });
        } catch (err) {
            console.log(chalk.red(`\n  Komut çalıştırılamadı: ${err.message}`));
        }
    }
}
