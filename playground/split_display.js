import fs from 'fs';
import path from 'path';

const srcFile = path.join(process.cwd(), 'src/utils/display.js');
let content = fs.readFileSync(srcFile, 'utf8');

const getFnRegex = (name) => new RegExp(`export function ${name}\\([\\s\\S]*?\\n}\\n`, 'g');

const splitFile = (filename, imports, fns) => {
    let out = imports + '\n';
    fns.forEach(fn => {
        const regex = getFnRegex(fn);
        const match = content.match(regex);
        if (match) {
            out += match[0] + '\n';
            content = content.replace(regex, '');
        }
    });
    fs.writeFileSync(path.join(process.cwd(), 'src/displays', filename), out);
};

splitFile('weatherDisplay.js',
    "import Table from 'cli-table3';\nimport chalk from 'chalk';\nimport asciichart from 'asciichart';\n",
    ['createCurrentWeatherTable', 'createHourlyWeatherTable', 'createAirQualityTable']
);

splitFile('earthquakeDisplay.js',
    "import Table from 'cli-table3';\nimport chalk from 'chalk';\n",
    ['createEarthquakeTable']
);

splitFile('financeDisplay.js',
    "import Table from 'cli-table3';\nimport chalk from 'chalk';\n",
    ['createDovizTable']
);

splitFile('pharmacyDisplay.js',
    "import Table from 'cli-table3';\nimport chalk from 'chalk';\n",
    ['createNobetciEczaneTable', 'createEczaneListTable']
);

// Everything left goes to transportDisplay.js
// but wait, what about the // ─── Yeni İBB SOAP API Tabloları ────────────────────────────────────── comments?
// Let's just create transportDisplay.js manually with everything remaining except imports.
const displayRem = content.split('\n').filter(line => !line.startsWith('import ') && !line.startsWith('//')).join('\n');
const transportContent = "import Table from 'cli-table3';\nimport chalk from 'chalk';\n" + displayRem;
fs.writeFileSync(path.join(process.cwd(), 'src/displays/transportDisplay.js'), transportContent);

// Rewrite display.js
const newDisplayContent = `export * from '../displays/weatherDisplay.js';
export * from '../displays/earthquakeDisplay.js';
export * from '../displays/financeDisplay.js';
export * from '../displays/pharmacyDisplay.js';
export * from '../displays/transportDisplay.js';
`;
fs.writeFileSync(srcFile, newDisplayContent);

console.log('display.js split completed successfully.');
