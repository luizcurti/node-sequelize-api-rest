import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export default async function globalTeardown(): Promise<void> {
  const sequelize = new Sequelize(
    process.env.DATABASE as string,
    process.env.DATABASE_USERNAME as string,
    process.env.DATABASE_PASSWORD,
    {
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      dialect: 'mysql',
      logging: false,
    },
  );
  try {
    // Clean up test data in the correct order to respect foreign keys
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.query('TRUNCATE TABLE photos');
    await sequelize.query('TRUNCATE TABLE students');
    await sequelize.query('TRUNCATE TABLE users');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  } finally {
    await sequelize.close();
  }
}
