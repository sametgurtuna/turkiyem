import chalk from 'chalk';
import ora from 'ora';
import {
    fetchIettAllRoutes,
    fetchIettAllStops,
    fetchIettGarages,
    fetchIettFleetPositions,
    fetchIettAccidentLocations,
} from '../services/iettService.js';
import {
    createIbbHatListTable,
    createIbbDurakListTable,
    createIbbGarajTable,
    createIbbFiloKonumTable,
    createIbbKazaTable,
} from '../utils/display.js';

/**
 * İBB/IETT hat listesi sorgula.
 * Opsiyonel arama parametresiyle filtrele.
 */
export async function ibbHatlar(arama) {
    const spinner = ora('İBB/IETT hat listesi alınıyor...').start();
    try {
        const routes = await fetchIettAllRoutes(arama || undefined);

        if (!routes || routes.length === 0) {
            spinner.info(chalk.yellow(arama
                ? `"${arama}" aramasıyla eşleşen IETT hattı bulunamadı.`
                : 'IETT hat verisi bulunamadı.'));
            return;
        }

        // Eğer arama varsa ve tam veri geldiyse client-side filtre
        let filtered = routes;
        if (arama && routes.length > 10) {
            const query = arama.toUpperCase();
            filtered = routes.filter(r => {
                const code = (r.SHATKODU || r.HAT_KODU || '').toUpperCase();
                const name = (r.HATADI || r.HAT_ADI || '').toUpperCase();
                return code.includes(query) || name.includes(query);
            });
            if (filtered.length === 0) {
                spinner.info(chalk.yellow(`"${arama}" aramasıyla eşleşen IETT hattı bulunamadı.`));
                return;
            }
        }

        spinner.succeed(`İBB/IETT hat listesi alındı (${filtered.length} hat)`);
        console.log('');
        console.log(chalk.white.bold('  İBB/IETT Hat Listesi'));
        if (filtered.length > 50) {
            console.log(chalk.gray(`  Toplam ${filtered.length} hat bulundu. İlk 50 tanesi gösteriliyor.`));
            console.log(chalk.gray(`  Filtrelemek için: turkiyem ibb hatlar <arama>`));
            console.log(createIbbHatListTable(filtered.slice(0, 50)));
        } else {
            console.log(createIbbHatListTable(filtered));
        }
    } catch (err) {
        spinner.fail(chalk.red(err.message));
    }
}

/**
 * İBB/IETT durak listesi sorgula.
 * Opsiyonel arama parametresiyle filtrele.
 */
export async function ibbDuraklar(arama) {
    const spinner = ora('İBB/IETT durak listesi alınıyor...').start();
    try {
        const stops = await fetchIettAllStops(arama || undefined);

        if (!stops || stops.length === 0) {
            spinner.info(chalk.yellow(arama
                ? `"${arama}" aramasıyla eşleşen IETT durağı bulunamadı.`
                : 'IETT durak verisi bulunamadı.'));
            return;
        }

        let filtered = stops;
        if (arama && stops.length > 10) {
            const query = arama.toUpperCase();
            filtered = stops.filter(s => {
                const code = String(s.DURAKKODU || s.DURAK_KODU || '').toUpperCase();
                const name = (s.DURAKADI || s.DURAK_ADI || '').toUpperCase();
                return code.includes(query) || name.includes(query);
            });
            if (filtered.length === 0) {
                spinner.info(chalk.yellow(`"${arama}" aramasıyla eşleşen IETT durağı bulunamadı.`));
                return;
            }
        }

        spinner.succeed(`İBB/IETT durak listesi alındı (${filtered.length} durak)`);
        console.log('');
        console.log(chalk.white.bold('  İBB/IETT Durak Listesi'));
        if (filtered.length > 50) {
            console.log(chalk.gray(`  Toplam ${filtered.length} durak bulundu. İlk 50 tanesi gösteriliyor.`));
            console.log(chalk.gray(`  Filtrelemek için: turkiyem ibb duraklar <arama>`));
            console.log(createIbbDurakListTable(filtered.slice(0, 50)));
        } else {
            console.log(createIbbDurakListTable(filtered));
        }
    } catch (err) {
        spinner.fail(chalk.red(err.message));
    }
}

/**
 * IETT tüm filo araç konumlarını göster.
 */
export async function ibbFilo() {
    const spinner = ora('İBB/IETT filo araç konumları alınıyor...').start();
    try {
        const vehicles = await fetchIettFleetPositions();

        if (!vehicles || vehicles.length === 0) {
            spinner.info(chalk.yellow('IETT filo konum verisi bulunamadı.'));
            return;
        }

        spinner.succeed(`İBB/IETT filo konum verisi alındı (${vehicles.length} araç)`);
        console.log('');
        console.log(chalk.white.bold('  İBB/IETT Filo Araç Konumları'));
        if (vehicles.length > 50) {
            console.log(chalk.gray(`  Toplam ${vehicles.length} araç. İlk 50 tanesi gösteriliyor.`));
        }
        console.log(createIbbFiloKonumTable(vehicles));
    } catch (err) {
        spinner.fail(chalk.red(err.message));
    }
}

/**
 * IETT garaj bilgilerini göster.
 */
export async function ibbGaraj() {
    const spinner = ora('İBB/IETT garaj bilgileri alınıyor...').start();
    try {
        const garages = await fetchIettGarages();

        if (!garages || garages.length === 0) {
            spinner.info(chalk.yellow('IETT garaj verisi bulunamadı.'));
            return;
        }

        spinner.succeed(`İBB/IETT garaj bilgileri alındı (${garages.length} garaj)`);
        console.log('');
        console.log(chalk.white.bold('  İBB/IETT Garaj Bilgileri'));
        console.log(createIbbGarajTable(garages));
    } catch (err) {
        spinner.fail(chalk.red(err.message));
    }
}

/**
 * IETT kaza lokasyonlarını göster.
 */
export async function ibbKaza() {
    const spinner = ora('İBB/IETT kaza lokasyonları alınıyor...').start();
    try {
        const accidents = await fetchIettAccidentLocations();

        if (!accidents || accidents.length === 0) {
            spinner.info(chalk.yellow('Şu an kayıtlı kaza lokasyonu bulunmuyor.'));
            return;
        }

        spinner.succeed(`İBB/IETT kaza lokasyonları alındı (${accidents.length} kayıt)`);
        console.log('');
        console.log(chalk.white.bold('  İBB/IETT Kaza Lokasyonları'));
        console.log(createIbbKazaTable(accidents));
    } catch (err) {
        spinner.fail(chalk.red(err.message));
    }
}
