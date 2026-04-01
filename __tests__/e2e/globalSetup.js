import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

// Wait for MySQL to be ready
async function waitForDatabase(retries = 10, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      execSync(
        `docker exec mysql_database mysqladmin ping -uroot -p${process.env.DATABASE_PASSWORD} --silent`,
        { stdio: 'pipe' },
      );
      return;
    } catch {
      if (i === retries - 1) throw new Error('MySQL not ready after retries');
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

export default async function globalSetup() {
  await waitForDatabase();
  // Rodar migrations para garantir que as tabelas existam
  execSync('npx sequelize-cli db:migrate', {
    cwd: process.cwd(),
    stdio: 'pipe',
    env: process.env,
  });
}
