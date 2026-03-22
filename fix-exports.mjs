import fs from 'fs';

const lines = fs.readFileSync('knip-report-all.txt', 'utf8').split('\n');
const fileEdits = {};

for (const line of lines) {
    const match = line.match(/(src\/[a-zA-Z0-9_./-]+):(\d+):\d+/);
    if (match) {
        const file = match[1];
        const lineNum = parseInt(match[2], 10);
        if (!fileEdits[file]) fileEdits[file] = [];
        fileEdits[file].push(lineNum);
    }
}

for (const [file, lineNums] of Object.entries(fileEdits)) {
    const content = fs.readFileSync(file, 'utf8').split('\n');
    for (const lineNum of lineNums) {
        const idx = lineNum - 1;
        if (content[idx]) {
             if (content[idx].includes('export type {')) {
                 content[idx] = content[idx].replace(/export\s+type\s+\{.*\}\s*;?/, '');
             } else {
                 content[idx] = content[idx].replace(/^(\s*)export\s+/, '$1');
             }
        }
    }
    fs.writeFileSync(file, content.join('\n'), 'utf8');
}
console.log('Fixed unused exports!');
