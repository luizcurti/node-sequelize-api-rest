import dotenv from 'dotenv';

dotenv.config();

// Raise the timeout for tests that hit a real database
jest.setTimeout(30000);
