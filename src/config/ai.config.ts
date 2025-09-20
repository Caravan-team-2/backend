import { registerAs } from '@nestjs/config';

export default registerAs('ai', () => ({
  baseUrl: process.env.AI_BASE_URL,
  ApiKey: process.env.AI_API_KEY,
}));
