import { registerAs } from '@nestjs/config';
import { PaymentConfig } from './interfaces/payment-config.interface';

export default registerAs(
  'payment',
  (): PaymentConfig => ({
    gateway: {
      baseURL: process.env.PAYMENT_GATEWAY_BASE_URL || 'https://epay.guiddini.dz',
      apiKey: process.env.PAYMENT_GATEWAY_API_KEY || 'apiKeyHere',
      apiSecret: process.env.PAYMENT_GATEWAY_API_SECRET || 'apiSecretHere',
    },
    redirect: {
      successUrl: process.env.PAYMENT_SUCCESS_REDIRECT_URL || 'https://your-frontend-app.com/payment-success',
      failureUrl: process.env.PAYMENT_FAILURE_REDIRECT_URL || 'https://your-frontend-app.com/payment-failure',
    },
  }),
);