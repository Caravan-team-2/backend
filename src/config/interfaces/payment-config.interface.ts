export interface PaymentConfig {
  gateway: {
    baseURL: string;
    apiKey: string;
    apiSecret: string;
  };
  redirect: {
    successUrl: string;
    failureUrl: string;
  };
}