import { execSync } from 'child_process';
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Connects directly instead of shelling out to `docker exec`, so this works the same
// way against a local docker-compose container and a CI service container.
async function waitForDatabase(retries = 15, delayMs = 2000): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await createConnection({
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
      });
      await connection.end();
      return;
    } catch {
      if (i === retries - 1) throw new Error('MySQL not ready after retries');
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

export default async function globalSetup(): Promise<void> {
  await waitForDatabase();
  // Run migrations so the tables exist before the suite runs
  execSync('npx sequelize-cli db:migrate', {
    cwd: process.cwd(),
    stdio: 'pipe',
    env: process.env,
  });
}
