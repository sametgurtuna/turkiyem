import fs from 'fs';
import path from 'path';
import axios from 'axios';
import AdmZip from 'adm-zip';
import { parse } from 'csv-parse';
import readline from 'readline';
import { CONFIG_DIR } from '../utils/config.js';

const IZMIR_GTFS_URL = 'https://www.eshot.gov.tr/gtfs/bus-eshot-gtfs.zip';
const IZMIR_DIR = path.join(CONFIG_DIR, 'izmir_gtfs');
const ZIP_PATH = path.join(IZMIR_DIR, 'bus-eshot-gtfs.zip');
const EXTRACT_DIR = path.join(IZMIR_DIR, 'extracted');
const CACHE_HOURS = 24 * 7; // Update weekly

async function ensureGtfsData(spinner) {
    if (!fs.existsSync(IZMIR_DIR)) {
        fs.mkdirSync(IZMIR_DIR, { recursive: true });
    }

    let needsDownload = true;
    if (fs.existsSync(ZIP_PATH) && fs.existsSync(EXTRACT_DIR)) {
        const stat = fs.statSync(ZIP_PATH);
        const ageHours = (Date.now() - stat.mtimeMs) / (1000 * 60 * 60);
        if (ageHours < CACHE_HOURS) {
            needsDownload = false;
        }
    }

    if (needsDownload) {
        if (spinner) spinner.text = 'İzmir ESHOT GTFS verisi indiriliyor (bu işlem birkaç dakika sürebilir)...';

        const writer = fs.createWriteStream(ZIP_PATH);
        const response = await axios({
            url: IZMIR_GTFS_URL,
            method: 'GET',
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        await new Promise((resolve, reject) => {
            response.data.pipe(writer);
            let error = null;
            writer.on('error', err => {
                error = err;
                writer.close();
                reject(err);
            });
            writer.on('close', () => {
                if (!error) resolve(true);
            });
        });

        if (spinner) spinner.text = 'Zipli dosya çıkarılıyor...';
        if (!fs.existsSync(EXTRACT_DIR)) {
            fs.mkdirSync(EXTRACT_DIR, { recursive: true });
        }
        const zip = new AdmZip(ZIP_PATH);
        zip.extractAllTo(EXTRACT_DIR, true);
    }
}

async function parseCsvFast(filePath, filterFn) {
    const results = [];
    if (!fs.existsSync(filePath)) return results;

    const parser = fs.createReadStream(filePath).pipe(
        parse({
            columns: true,
            skip_empty_lines: true,
            trim: true,
            bom: true
        })
    );

    for await (const row of parser) {
        if (filterFn(row)) {
            results.push(row);
        }
    }

    return results;
}

export async function searchIzmirRoutes(keyword, spinner) {
    await ensureGtfsData(spinner);

    const kw = keyword.toUpperCase();
    const routesPath = path.join(EXTRACT_DIR, 'routes.txt');

    const matches = await parseCsvFast(routesPath, (row) => {
        return row.route_short_name?.toUpperCase().includes(kw) ||
            row.route_long_name?.toUpperCase().includes(kw);
    });

    return matches;
}

export async function getIzmirRouteStopsAndSchedule(routeId, spinner) {
    await ensureGtfsData(spinner);

    if (spinner) spinner.text = 'Seferler (trips) analiz ediliyor...';
    const tripsPath = path.join(EXTRACT_DIR, 'trips.txt');
    let firstTripIdGidis = null;
    let firstTripIdDonus = null;

    const trips = await parseCsvFast(tripsPath, (row) => {
        if (row.route_id === routeId) {
            if (row.direction_id === '0' && !firstTripIdGidis) firstTripIdGidis = row.trip_id;
            if (row.direction_id === '1' && !firstTripIdDonus) firstTripIdDonus = row.trip_id;
            return true;
        }
        return false;
    });

    const tripIds = new Set(trips.map(t => t.trip_id));
    if (tripIds.size === 0) return { stops: [], schedule: [] };

    if (spinner) spinner.text = 'Durak geçiş süreleri (stop_times) analiz ediliyor (bu biraz sürebilir)...';
    const stopTimesPath = path.join(EXTRACT_DIR, 'stop_times.txt');

    const tripStopTimes = {};
    const sampleTripStops = []; // We will get the stops of the first trip (gidiş)

    const fileStream = fs.createReadStream(stopTimesPath);
    const parser = fileStream.pipe(
        parse({
            columns: true,
            skip_empty_lines: true,
            trim: true,
            bom: true
        })
    );

    for await (const row of parser) {
        const tripId = row.trip_id;

        if (tripIds.has(tripId)) {
            const arrivalTime = row.arrival_time;
            const stopId = row.stop_id;
            const stopSequence = row.stop_sequence;

            if (!tripStopTimes[tripId]) tripStopTimes[tripId] = [];
            tripStopTimes[tripId].push({ stopId, arrivalTime, stopSequence: parseInt(stopSequence, 10) });

            if (tripId === firstTripIdGidis) {
                sampleTripStops.push({ stopId, stopSequence: parseInt(stopSequence, 10) });
            } else if (!firstTripIdGidis && tripId === firstTripIdDonus) {
                // fallback if no gidiş
                sampleTripStops.push({ stopId, stopSequence: parseInt(stopSequence, 10) });
            }
        }
    }

    sampleTripStops.sort((a, b) => a.stopSequence - b.stopSequence);

    if (spinner) spinner.text = 'Durak isimleri (stops) alınıyor...';
    const stopsPath = path.join(EXTRACT_DIR, 'stops.txt');
    const usedStopIds = new Set(sampleTripStops.map(s => s.stopId));
    const stopNames = {};

    await parseCsvFast(stopsPath, (row) => {
        if (usedStopIds.has(row.stop_id)) {
            stopNames[row.stop_id] = row.stop_name;
        }
        return false; // we just need mapping
    });

    const finalStops = sampleTripStops.map((s, idx) => ({
        seq: idx + 1,
        id: s.stopId,
        name: stopNames[s.stopId] || 'Bilinmeyen Durak'
    }));

    // Create a simple schedule list: Start times of the trips from the first stop
    const schedules = [];
    for (const tid of Object.keys(tripStopTimes)) {
        const times = tripStopTimes[tid];
        times.sort((a, b) => a.stopSequence - b.stopSequence);
        if (times.length > 0) {
            schedules.push(times[0].arrivalTime);
        }
    }

    // Deduplicate and sort schedule times
    const uniqueSchedules = [...new Set(schedules)];
    uniqueSchedules.sort();

    return { stops: finalStops, schedule: uniqueSchedules };
}

export async function searchIzmirStops(stopKeyword, spinner) {
    await ensureGtfsData(spinner);

    const kw = stopKeyword.toUpperCase();
    const stopsPath = path.join(EXTRACT_DIR, 'stops.txt');

    const matches = await parseCsvFast(stopsPath, (row) => {
        return row.stop_id === kw || row.stop_name?.toUpperCase().includes(kw);
    });

    return matches;
}

export async function getIzmirStopSchedule(stopId, spinner) {
    await ensureGtfsData(spinner);

    if (spinner) spinner.text = 'Durak geçiş süreleri inceleniyor...';
    const stopTimesPath = path.join(EXTRACT_DIR, 'stop_times.txt');

    const tripArrivals = [];
    await parseCsvFast(stopTimesPath, (row) => {
        if (row.stop_id === stopId) {
            tripArrivals.push({ tripId: row.trip_id, arrivalTime: row.arrival_time });
        }
        return false;
    });

    const tripIds = new Set(tripArrivals.map(t => t.tripId));
    if (tripIds.size === 0) return [];

    if (spinner) spinner.text = 'İlgili hatlar bulunuyor...';
    const tripsPath = path.join(EXTRACT_DIR, 'trips.txt');
    const tripToRouteMap = {};
    const routeIds = new Set();
    await parseCsvFast(tripsPath, (row) => {
        if (tripIds.has(row.trip_id)) {
            tripToRouteMap[row.trip_id] = row.route_id;
            routeIds.add(row.route_id);
        }
        return false;
    });

    const routesPath = path.join(EXTRACT_DIR, 'routes.txt');
    const routeNames = {};
    await parseCsvFast(routesPath, (row) => {
        if (routeIds.has(row.route_id)) {
            routeNames[row.route_id] = row.route_short_name + ' - ' + row.route_long_name;
        }
        return false;
    });

    const stopSchedule = tripArrivals.map(t => ({
        time: t.arrivalTime,
        route: routeNames[tripToRouteMap[t.tripId]] || 'Bilinmeyen Hat'
    }));

    // Sort by arrival time
    stopSchedule.sort((a, b) => a.time.localeCompare(b.time));

    return stopSchedule;
}
