import dotenv from 'dotenv';

dotenv.config();

// Aumentar timeout para testes de integração com banco real
jest.setTimeout(30000);
