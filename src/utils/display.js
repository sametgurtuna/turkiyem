import Table from 'cli-table3';
import chalk from 'chalk';

export function createEarthquakeTable(earthquakes) {
  const table = new Table({
    head: [
      chalk.white.bold('Tarih'),
      chalk.white.bold('Büyüklük'),
      chalk.white.bold('Derinlik (km)'),
      chalk.white.bold('Konum'),
    ],
    colWidths: [22, 12, 15, 45],
    style: { head: [], border: ['gray'] },
  });

  for (const eq of earthquakes) {
    const mag = parseFloat(eq.magnitude);
    const magStr = mag >= 4.0
      ? chalk.red.bold(mag.toFixed(1))
      : chalk.yellow(mag.toFixed(1));

    const row = [
      eq.date,
      magStr,
      eq.depth,
      eq.location,
    ];

    table.push(row);
  }

  return table.toString();
}

export function createEgoScheduleTable(schedule) {
  const table = new Table({
    head: [
      chalk.white.bold('Hat'),
      chalk.white.bold('Gün Tipi'),
      chalk.white.bold('Kalkış Saatleri'),
    ],
    colWidths: [10, 14, 70],
    style: { head: [], border: ['gray'] },
    wordWrap: true,
  });

  for (const row of schedule) {
    table.push([row.hat, row.gunTipi, row.saatler]);
  }

  return table.toString();
}

export function createEgoInfoTable(info) {
  const table = new Table({
    style: { head: [], border: ['gray'] },
  });

  table.push(
    { [chalk.cyan('Hat No')]: info.hatNo || '-' },
    { [chalk.cyan('Hat Adı')]: info.hatAdi || '-' },
    { [chalk.cyan('Kalkış')]: info.kalkis || '-' },
    { [chalk.cyan('Varış')]: info.varis || '-' },
    { [chalk.cyan('Mesafe')]: info.mesafe || '-' },
    { [chalk.cyan('Süre')]: info.sure || '-' },
  );

  return table.toString();
}

export function createRouteTable(route) {
  const table = new Table({
    style: { head: [], border: ['gray'] },
  });

  table.push(
    { [chalk.cyan('Hat Kısa Adı')]: route.routeShortName || '-' },
    { [chalk.cyan('Hat Uzun Adı')]: route.routeLongName || '-' },
  );

  if (route.stopCount > 0) {
    table.push({ [chalk.cyan('Durak Sayısı')]: String(route.stopCount) });
  }

  table.push(
    { [chalk.cyan('İlk Durak')]: route.firstStop || '-' },
    { [chalk.cyan('Son Durak')]: route.lastStop || '-' },
  );

  if (route.directions && route.directions.length > 1) {
    table.push({
      [chalk.cyan('Güzergahlar')]: route.directions.join('\n'),
    });
  }

  if (route.routeVariants && route.routeVariants > 1) {
    table.push({
      [chalk.cyan('Varyant Sayısı')]: String(route.routeVariants),
    });
  }

  return table.toString();
}
