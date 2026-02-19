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

function formatTimes(times, limit = 30) {
  if (!Array.isArray(times) || times.length === 0) return '-';
  if (times.length <= limit) return times.join(', ');

  const visible = times.slice(0, limit).join(', ');
  const remaining = times.length - limit;
  return `${visible}, ... (+${remaining})`;
}

export function createIettPlannedTimesTable(plannedTimes) {
  const table = new Table({
    head: [
      chalk.white.bold('Gün Tipi'),
      chalk.white.bold('Yön'),
      chalk.white.bold('Kalkış Saatleri'),
      chalk.white.bold('Servis Tipi'),
    ],
    colWidths: [14, 12, 70, 18],
    style: { head: [], border: ['gray'] },
    wordWrap: true,
  });

  for (const group of plannedTimes.groups || []) {
    table.push([
      group.gunTipi || '-',
      group.yon || '-',
      formatTimes(group.saatler, 30),
      (group.servisTipleri || []).join(', ') || '-',
    ]);
  }

  return table.toString();
}

export function createCurrentWeatherTable(result) {
  const table = new Table({
    style: { head: [], border: ['gray'] },
    wordWrap: true,
  });

  table.push(
    { [chalk.cyan('Konum')]: result.locationName || '-' },
    { [chalk.cyan('Koordinat')]: `${result.latitude}, ${result.longitude}` },
    { [chalk.cyan('Zaman Dilimi')]: result.timezone || '-' },
    { [chalk.cyan('Ölçüm Zamanı')]: result.current?.time || '-' },
    { [chalk.cyan('Sıcaklık (°C)')]: String(result.current?.temperature ?? '-') },
    { [chalk.cyan('Rüzgar (km/s)')]: String(result.current?.windSpeed ?? '-') },
    { [chalk.cyan('Nem (%)')]: String(result.current?.humidity ?? '-') },
  );

  return table.toString();
}

export function createHourlyWeatherTable(result) {
  const table = new Table({
    head: [
      chalk.white.bold('Saat'),
      chalk.white.bold('Sıcaklık (°C)'),
      chalk.white.bold('Hissedilen (°C)'),
      chalk.white.bold('Yağış Olasılığı (%)'),
    ],
    colWidths: [22, 15, 18, 22],
    style: { head: [], border: ['gray'] },
  });

  for (const row of result.rows || []) {
    table.push([
      row.time || '-',
      String(row.temperature ?? '-'),
      String(row.apparentTemperature ?? '-'),
      String(row.precipitationProbability ?? '-'),
    ]);
  }

  return table.toString();
}

export function createAirQualityTable(result) {
  const table = new Table({
    style: { head: [], border: ['gray'] },
    wordWrap: true,
  });

  table.push(
    { [chalk.cyan('Konum')]: result.locationName || '-' },
    { [chalk.cyan('Koordinat')]: `${result.latitude}, ${result.longitude}` },
    { [chalk.cyan('Zaman Dilimi')]: result.timezone || '-' },
    { [chalk.cyan('Ölçüm Zamanı')]: result.current?.time || '-' },
    { [chalk.cyan('PM10 (µg/m3)')]: String(result.current?.pm10 ?? '-') },
    { [chalk.cyan('PM2.5 (µg/m3)')]: String(result.current?.pm25 ?? '-') },
    { [chalk.cyan('CO (µg/m3)')]: String(result.current?.carbonMonoxide ?? '-') },
    { [chalk.cyan('NO2 (µg/m3)')]: String(result.current?.nitrogenDioxide ?? '-') },
  );

  return table.toString();
}

export function createIettLiveSummaryTable(liveData) {
  const table = new Table({
    style: { head: [], border: ['gray'] },
    wordWrap: true,
  });

  const directionText = (liveData.summary?.directionDistribution || [])
    .map((item) => `${item.direction}: ${item.count}`)
    .join(' | ');

  table.push(
    { [chalk.cyan('Hat Kodu')]: liveData.routeCode || '-' },
    { [chalk.cyan('Aktif Araç Sayısı')]: String(liveData.summary?.totalVehicles ?? 0) },
    { [chalk.cyan('Yön Dağılımı')]: directionText || '-' },
    { [chalk.cyan('Son Konum Zamanı')]: liveData.summary?.latestLocationTime || '-' },
  );

  return table.toString();
}

export function createIettLiveDetailTable(liveData) {
  const table = new Table({
    head: [
      chalk.white.bold('Kapı No'),
      chalk.white.bold('Yön'),
      chalk.white.bold('Enlem'),
      chalk.white.bold('Boylam'),
      chalk.white.bold('Yakın Durak'),
      chalk.white.bold('Son Konum Zamanı'),
    ],
    colWidths: [10, 24, 12, 12, 14, 22],
    style: { head: [], border: ['gray'] },
    wordWrap: true,
  });

  for (const vehicle of liveData.vehicles || []) {
    table.push([
      vehicle.vehicleDoorNo || '-',
      vehicle.direction || '-',
      String(vehicle.latitude ?? '-'),
      String(vehicle.longitude ?? '-'),
      vehicle.nearestStopCode || '-',
      vehicle.lastLocationTime || '-',
    ]);
  }

  return table.toString();
}
