import { readdirSync, mkdirSync } from 'fs';
import { execFileSync } from 'child_process';
import { resolve, basename, extname } from 'path';

const mmdDir = resolve('docs', 'mmd');
const imgDir = resolve('docs', 'img');

mkdirSync(imgDir, { recursive: true });

const mmdFiles = readdirSync(mmdDir).filter((file) => extname(file) === '.mmd');

for (const file of mmdFiles) {
  const input = resolve(mmdDir, file);
  const output = resolve(imgDir, `${basename(file, '.mmd')}.png`);

  console.log(`Rendering ${file} -> docs/img/${basename(output)}`);
  execFileSync(
    'npx',
    ['mmdc', '-i', input, '-o', output, '-b', 'white', '-s', '2'],
    { stdio: 'inherit' },
  );
}
