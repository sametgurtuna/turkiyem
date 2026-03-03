import Table from 'cli-table3';
import chalk from 'chalk';

function createWaterOutagesTable(outages) {
    const table = new Table({
        head: [
            chalk.cyan('İlçe'),
            chalk.cyan('Mahalleler'),
            chalk.cyan('Arıza Tipi'),
            chalk.cyan('Kesinti Süresi'),
            chalk.cyan('Açıklama')
        ],
        wordWrap: true,
        wrapOnWordBoundary: true,
        colWidths: [15, 25, 20, 30, 40]
    });

    outages.forEach(outage => {
        table.push([
            chalk.bold(outage.IlceAdi || '-'),
            outage.Mahalleler || '-',
            chalk.yellow(outage.Tip || '-'),
            outage.KesintiSuresi || '-',
            outage.Aciklama || '-'
        ]);
    });

    return table.toString();
}

function createDamStatusTable(dams) {
    const table = new Table({
        head: [
            chalk.cyan('Baraj Adı'),
            chalk.cyan('Doluluk Oranı (%)'),
            chalk.cyan('Su Yüksekliği (m)'),
            chalk.cyan('Hacim (m³)')
        ]
    });

    dams.forEach(dam => {
        // Determine color based on fullness
        const fillRate = dam.DolulukOrani;
        let rateColor = chalk.green;
        if (fillRate < 20) rateColor = chalk.red;
        else if (fillRate < 50) rateColor = chalk.yellow;

        table.push([
            chalk.bold(dam.BarajKuyuAdi || '-'),
            rateColor(fillRate != null ? `%${fillRate.toFixed(2)}` : '-'),
            dam.SuYuksekligi != null ? dam.SuYuksekligi.toFixed(2) : '-',
            dam.KullanılabilirGolSuHacmi != null ? dam.KullanılabilirGolSuHacmi.toLocaleString('tr-TR') : '-'
        ]);
    });

    return table.toString();
}

function createWaterProductionTable(productionData) {
    const table = new Table({
        head: [
            chalk.cyan('Kaynak Adı'),
            chalk.cyan('Tür'),
            chalk.cyan('Üretim Miktarı (m³)')
        ]
    });

    if (productionData && productionData.BarajKuyuUretimleri) {
        productionData.BarajKuyuUretimleri.forEach(item => {
            table.push([
                chalk.bold(item.BarajKuyuAdi || item.UretimKaynagi || '-'),
                item.TurAdi || '-',
                item.UretimMiktari != null ? item.UretimMiktari.toLocaleString('tr-TR') : '-'
            ]);
        });
    }

    return table.toString();
}

function createBranchesTable(branches, isVezne = false) {
    const head = [
        chalk.cyan(isVezne ? 'Vezne Adı' : 'Şube Adı'),
        chalk.cyan('Adres')
    ];
    if (!isVezne) {
        head.push(chalk.cyan('Telefon'));
    }

    const table = new Table({
        head,
        wordWrap: true,
        wrapOnWordBoundary: true,
        colWidths: isVezne ? [30, 70] : [30, 50, 20]
    });

    branches.forEach(branch => {
        const row = [
            chalk.bold(branch.SubeAdi || branch.VezneAdi || '-'),
            branch.SubeAdresi || branch.VezneAdresi || '-'
        ];
        if (!isVezne) {
            row.push(branch.SubeTelefon || '-');
        }
        table.push(row);
    });

    return table.toString();
}

export {
    createWaterOutagesTable,
    createDamStatusTable,
    createWaterProductionTable,
    createBranchesTable
};
