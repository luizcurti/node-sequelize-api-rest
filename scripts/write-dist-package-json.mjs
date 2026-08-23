import { writeFileSync } from 'fs';
import { resolve } from 'path';

const distPackageJsonPath = resolve('dist', 'package.json');

writeFileSync(distPackageJsonPath, JSON.stringify({ type: 'commonjs' }, null, 2));
