import Table from 'cli-table3';
import chalk from 'chalk';
import asciichart from 'asciichart';

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

  const temperatures = [];

  for (const row of result.rows || []) {
    table.push([
      row.time || '-',
      String(row.temperature ?? '-'),
      String(row.apparentTemperature ?? '-'),
      String(row.precipitationProbability ?? '-'),
    ]);

    if (row.temperature !== undefined && row.temperature !== null) {
      temperatures.push(row.temperature);
    }
  }

  let chart = '';
  if (temperatures.length > 0) {
    chart = '\n' + chalk.white.bold('  Sıcaklık Grafiği (Sonraki Saatler)\n') +
      chalk.cyan(asciichart.plot(temperatures, { height: 10 })) + '\n\n';
  }

  return chart + table.toString();
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

export function createDovizTable(result) {
  const table = new Table({
    head: [
      chalk.white.bold('Kod'),
      chalk.white.bold('Döviz Cinsi'),
      chalk.white.bold('Alış (TL)'),
      chalk.white.bold('Satış (TL)'),
    ],
    colWidths: [8, 30, 15, 15],
    style: { head: [], border: ['gray'] },
  });

  for (const c of result.currencies) {
    if (!c.alis && !c.satis) continue;
    table.push([
      chalk.cyan(c.kodu),
      c.isim,
      c.alis || '-',
      c.satis || '-'
    ]);
  }

  return table.toString();
}

export function createAdanaBusInfoTable(info) {
  const table = new Table({
    style: { head: [], border: ['gray'] },
  });

  table.push(
    { [chalk.cyan('Hat Adı')]: info.busName || '-' },
    { [chalk.cyan('Son Güncelleme')]: info.lastUpdate || '-' }
  );

  return table.toString();
}

export function createAdanaScheduleTable(schedule) {
  const table = new Table({
    head: [chalk.white.bold('Sefer Saatleri')],
    colWidths: [70],
    style: { head: [], border: ['gray'] },
    wordWrap: true,
  });

  if (schedule && schedule.length > 0) {
    // formatTimes takes an array, let's just chunk it ourselves or use formatTimes
    // Unfortunately formatTimes trims at "limit". Maybe just chunk by 10
    const chunks = [];
    for (let i = 0; i < schedule.length; i += 10) {
      chunks.push(schedule.slice(i, i + 10).join(', '));
    }
    table.push([chunks.join('\n')]);
  } else {
    table.push(['-']);
  }
  return table.toString();
}

export function createAdanaStopsTable(stops) {
  const table = new Table({
    head: [
      chalk.white.bold('Durak Adı'),
      chalk.white.bold('Stop ID')
    ],
    colWidths: [45, 12],
    style: { head: [], border: ['gray'] },
    wordWrap: true,
  });

  for (const s of stops) {
    table.push([s.name, s.id]);
  }
  return table.toString();
}

export function createAdanaStopDetailsTable(stop) {
  const table = new Table({
    style: { head: [], border: ['gray'] },
  });

  table.push(
    { [chalk.cyan('Durak Adı')]: stop.stopName || '-' },
    { [chalk.cyan('Stop ID')]: stop.stopId || '-' }
  );

  if (stop.passingBuses && stop.passingBuses.length > 0) {
    table.push({ [chalk.cyan('Geçen Hatlar')]: stop.passingBuses.join('\n') });
  } else {
    table.push({ [chalk.cyan('Geçen Hatlar')]: '-' });
  }

  return table.toString();
}

export function createAntalyaScheduleTable(rows) {
  const table = new Table({
    head: [
      chalk.white.bold('Sıra'),
      chalk.white.bold('İlk Sefer Zamanı'),
      chalk.white.bold('Durak Adı'),
      chalk.white.bold('Durak No')
    ],
    colWidths: [6, 20, 45, 12],
    style: { head: [], border: ['gray'] },
    wordWrap: true,
  });

  rows.forEach((r, idx) => {
    table.push([
      (idx + 1).toString(),
      r.saat,
      r.durakAdi,
      r.durakNo
    ]);
  });

  return table.toString();
}

export function createAntalyaStopTable(rows, stopId) {
  const table = new Table({
    head: [
      chalk.white.bold('Sıcak Saat'),
      chalk.white.bold('Hat Adı'),
      chalk.white.bold('Yön'),
      chalk.white.bold('Güzergah')
    ],
    colWidths: [15, 10, 8, 45],
    style: { head: [], border: ['gray'] },
    wordWrap: true,
  });

  rows.forEach(r => {
    table.push([
      r.saat,
      chalk.cyan(r.hatAdi),
      r.yon,
      r.guzergah
    ]);
  });

  return table.toString();
}

export function createBursaRouteStopsTable(stops) {
  const table = new Table({
    head: [
      chalk.white.bold('Sıra'),
      chalk.white.bold('Durak Adı'),
      chalk.white.bold('Durak ID')
    ],
    colWidths: [6, 45, 12],
    style: { head: [], border: ['gray'] },
    wordWrap: true,
  });

  stops.forEach((s) => {
    table.push([
      s.seq?.toString() || '-',
      s.stnAd || '-',
      s.stnID?.toString() || '-'
    ]);
  });

  return table.toString();
}

export function createBursaLiveTrackingTable(liveData) {
  const table = new Table({
    head: [
      chalk.white.bold('Plaka'),
      chalk.white.bold('Hız (km/s)'),
      chalk.white.bold('Doluluk (%)')
    ],
    colWidths: [15, 12, 12],
    style: { head: [], border: ['gray'] },
    wordWrap: true,
  });

  liveData.forEach((d) => {
    table.push([
      d.plaka || '-',
      d.hiz?.toString() || '-',
      d.doluluk?.toString() || '-'
    ]);
  });

  return table.toString();
}

export function createBursaStationRemainingTable(remainingTimeData) {
  const table = new Table({
    head: [
      chalk.white.bold('Hat Kodu'),
      chalk.white.bold('Kalan Süre (Dk)'),
      chalk.white.bold('Varış Saati'),
      chalk.white.bold('Kalan Durak')
    ],
    colWidths: [12, 18, 15, 15],
    style: { head: [], border: ['gray'] },
    wordWrap: true,
  });

  remainingTimeData.forEach((d) => {
    table.push([
      chalk.cyan(d.hatKod || '-'),
      d.kalanSure?.toString() || '-',
      d.tahminiKalanSure || '-',
      d.kalanDurak?.toString() || '-'
    ]);
  });

  return table.toString();
}

export function createIzmirStopsTable(stops) {
  const table = new Table({
    head: [
      chalk.white.bold('Sıra'),
      chalk.white.bold('Durak Adı'),
      chalk.white.bold('Durak ID')
    ],
    colWidths: [8, 45, 12],
    style: { head: [], border: ['gray'] },
    wordWrap: true,
  });

  for (const s of stops) {
    table.push([s.seq?.toString() || '-', s.name || '-', s.id || '-']);
  }

  return table.toString();
}

export function createIzmirScheduleTable(schedule) {
  const table = new Table({
    head: [chalk.white.bold('Sefer Saatleri')],
    colWidths: [70],
    style: { head: [], border: ['gray'] },
    wordWrap: true,
  });

  if (schedule && schedule.length > 0) {
    const chunks = [];
    for (let i = 0; i < schedule.length; i += 10) {
      chunks.push(schedule.slice(i, i + 10).join(', '));
    }
    table.push([chunks.join('\n')]);
  } else {
    table.push(['-']);
  }

  return table.toString();
}

export function createIzmirStopScheduleTable(schedule) {
  const table = new Table({
    head: [
      chalk.white.bold('Saat'),
      chalk.white.bold('Hat')
    ],
    colWidths: [12, 60],
    style: { head: [], border: ['gray'] },
    wordWrap: true,
  });

  for (const s of schedule) {
    table.push([s.time || '-', chalk.cyan(s.route || '-')]);
  }

  return table.toString();
}

export function createTrabzonScheduleTable(schedule) {
  const table = new Table({
    head: [
      chalk.white.bold('Hafta İçi'),
      chalk.white.bold('Cumartesi'),
      chalk.white.bold('Pazar')
    ],
    colWidths: [20, 20, 20],
    style: { head: [], border: ['gray'] },
    wordWrap: true,
  });

  for (const row of schedule) {
    table.push([
      row.haftaIci || '-',
      row.cumartesi || '-',
      row.pazar || '-'
    ]);
  }

  return table.toString();
}

export function createSamsunScheduleTable(times) {
  const table = new Table({
    head: [chalk.white.bold('Sefer Saatleri')],
    colWidths: [70],
    style: { head: [], border: ['gray'] },
    wordWrap: true,
  });

  if (times && times.length > 0) {
    const chunks = [];
    for (let i = 0; i < times.length; i += 10) {
      chunks.push(times.slice(i, i + 10).join(', '));
    }
    table.push([chunks.join('\n')]);
  } else {
    table.push(['-']);
  }

  return table.toString();
}

export function createSamsunStopsTable(stops) {
  const table = new Table({
    head: [chalk.white.bold('Durak Adı / Bilgisi')],
    colWidths: [70],
    style: { head: [], border: ['gray'] },
    wordWrap: true,
  });

  for (const stop of stops) {
    table.push([stop]);
  }

  return table.toString();
}

export function createMersinScheduleTable(schedule) {
  const table = new Table({
    head: [
      chalk.white.bold('Hafta İçi'),
      chalk.white.bold('Cumartesi'),
      chalk.white.bold('Pazar')
    ],
    colWidths: [20, 20, 20],
    style: { head: [], border: ['gray'] },
    wordWrap: true,
  });

  const maxLen = Math.max(
    schedule.haftaIci.length,
    schedule.cumartesi.length,
    schedule.pazar.length
  );

  for (let i = 0; i < maxLen; i++) {
    table.push([
      schedule.haftaIci[i] || '-',
      schedule.cumartesi[i] || '-',
      schedule.pazar[i] || '-'
    ]);
  }

  return table.toString();
}

export function createNobetciEczaneTable(eczaneler) {
  const table = new Table({
    head: [
      chalk.white.bold('İlçe'),
      chalk.white.bold('Eczane Adı'),
      chalk.white.bold('Telefon'),
      chalk.white.bold('Adres'),
      chalk.white.bold('Harita')
    ],
    colWidths: [12, 20, 14, 35, 30],
    style: { head: [], border: ['gray'] },
    wordWrap: true,
  });

  for (const ecz of eczaneler) {
    let mapLink = '-';
    if (ecz.LokasyonX && ecz.LokasyonY) {
      mapLink = `https://www.google.com/maps/search/?api=1&query=${ecz.LokasyonX},${ecz.LokasyonY}`;
    }
    table.push([
      ecz.Bolge || '-',
      chalk.cyan(ecz.Adi || '-'),
      ecz.Telefon || '-',
      ecz.Adres || '-',
      chalk.blue.underline(mapLink)
    ]);
  }

  return table.toString();
}

export function createEczaneListTable(eczaneler) {
  const table = new Table({
    head: [
      chalk.white.bold('İlçe'),
      chalk.white.bold('Eczane Adı'),
      chalk.white.bold('Telefon'),
      chalk.white.bold('Adres'),
      chalk.white.bold('Harita')
    ],
    colWidths: [12, 20, 14, 35, 30],
    style: { head: [], border: ['gray'] },
    wordWrap: true,
  });

  for (const ecz of eczaneler) {
    let mapLink = '-';
    if (ecz.LokasyonX && ecz.LokasyonY) {
      mapLink = `https://www.google.com/maps/search/?api=1&query=${ecz.LokasyonX},${ecz.LokasyonY}`;
    }
    table.push([
      ecz.Bolge || '-',
      chalk.cyan(ecz.Adi || '-'),
      ecz.Telefon || '-',
      ecz.Adres || '-',
      chalk.blue.underline(mapLink)
    ]);
  }

  return table.toString();
}
