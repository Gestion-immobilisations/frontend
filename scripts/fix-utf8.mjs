import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const ROOT = join(import.meta.dirname, '../src');
const EXT = new Set(['.jsx', '.js', '.css']);
const div = 'd' + 'i' + 'v';
const motion = 'm' + 'o' + 't' + 'i' + 'o' + 'n';

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) files.push(...walk(p, []));
    else if (EXT.has(extname(name))) files.push(p);
  }
  return files;
}

const replacements = [
  [`<${motion} `, `<${motion} `],
  [`</${motion}>`, `</${motion}>`],
];

const mojibake = [
  ['\u00c3\u00a9', '\u00e9'],
  ['\u00c3\u00a8', '\u00e8'],
  ['\u00c3\u00aa', '\u00ea'],
  ['\u00c3\u00b4', '\u00f4'],
  ['\u00c3\u00a7', '\u00e7'],
  ['\u00c3\u0089', '\u00c9'],
  ['\u00c3\u2030', '\u00c9'],
  ['\u00c3\u02c6', '\u00c8'],
  ['\u00c3\u00a0', '\u00e0'],
  ['\u00e2\u20ac\u201c', '\u2014'],
  ['\u00e2\u20ac\u00b9', '\u2039'],
  ['\u00e2\u20ac\u00ba', '\u203a'],
  ['\u00c2\u00b7', '\u00b7'],
];

// Fix: motion tag -> div tag
replacements[0] = [`<${motion} `, `<${div} `];
replacements[1] = [`</${motion}>`, `</${div}>`];

let count = 0;
for (const file of walk(ROOT)) {
  let c = readFileSync(file, 'utf8');
  const orig = c;
  for (const [from, to] of [...replacements, ...mojibake]) {
    c = c.split(from).join(to);
  }
  if (c !== orig) {
    writeFileSync(file, c, 'utf8');
    count++;
    console.log('fixed:', file);
  }
}

console.log('Total:', count);
