import chalk from 'chalk';
import readline from 'node:readline';
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

const commands = [
    'sehir', 'hat', 'durak', 'hava', 'deprem', 'eczane', 'doviz', 'ibb', 'temizle', 'help', 'clear', 'exit', 'çıkış'
];

const subcommands = {
    'sehir': ['ankara', 'istanbul', 'adana', 'antalya', 'bursa', 'izmir', 'trabzon', 'samsun', 'mersin', 'kayseri'],
    'hat': ['canli'],
    'hava': ['guncel', 'saatlik', 'kalite'],
    'deprem': ['son24', '7gun', 'buyukluk'],
    'eczane': ['nobetci', 'ara'],
    'ibb': ['hatlar', 'duraklar', 'filo', 'garaj', 'kaza']
};

function completer(line) {
    const parts = line.trimStart().split(/\s+/);
    let completions = [];

    if (parts.length === 1) {
        completions = commands.filter(c => c.startsWith(parts[0]));
        if (completions.length > 0) return [completions, line];
    } else if (parts.length === 2) {
        const cmd = parts[0];
        if (subcommands[cmd]) {
            const subCompletions = subcommands[cmd].filter(c => c.startsWith(parts[1]));
            if (subCompletions.length > 0) {
                const prefix = line.substring(0, line.length - parts[1].length);
                const mappedCompletions = subCompletions.map(c => prefix + c);
                return [mappedCompletions, line];
            }
        }
    }

    return [[], line];
}

export async function showMenu() {
    console.clear();
    printBanner();
    console.log(chalk.white.bold('  🇹🇷 Sürekli oturum modu — Komutları direkt yazabilirsiniz (Örn: hat 500T, deprem son24)\n'));
    console.log(chalk.gray('  Tüm komutları görmek için "help" yazabilirsiniz.\n'));

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        completer: completer,
        prompt: chalk.cyan('turkiyem > '),
        historySize: 200 // Yukarı/aşağı ok tuşu arabellek boyutu
    });

    printSessionHeader();
    rl.prompt();

    rl.on('line', async (line) => {
        const cmd = line.trim();

        if (cmd.toLowerCase() === 'exit' || cmd.toLowerCase() === 'çıkış') {
            console.log('');
            console.log(chalk.cyan('  Görüşmek üzere! 🇹🇷👋'));
            console.log('');
            rl.close();
            return;
        }

        if (cmd.toLowerCase() === 'clear') {
            console.clear();
            printBanner();
            console.log(chalk.white.bold('  🇹🇷 Sürekli oturum modu — Komutları direkt yazabilirsiniz (Örn: hat 500T, deprem son24)\n'));
            console.log(chalk.gray('  Tüm komutları görmek için "help" yazabilirsiniz.\n'));
            printSessionHeader();
            rl.prompt();
            return;
        }

        const args = cmd.split(' ').filter(Boolean);

        if (args.length > 0) {
            try {
                const { spawnSync } = await import('node:child_process');
                spawnSync(process.argv[0], [process.argv[1], ...args], { stdio: 'inherit' });
            } catch (err) {
                console.log(chalk.red(`\n  Komut çalıştırılamadı: ${err.message}`));
            }
        }

        printSessionHeader();
        rl.prompt();
    }).on('close', () => {
        process.exit(0);
    });
}
