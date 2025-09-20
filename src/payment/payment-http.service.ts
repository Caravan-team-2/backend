import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { isAxiosError } from '@nestjs/terminus/dist/utils';
import { initPaymentResponse } from './interfaces/init-payment.init';
import { PaymentDetails } from './interfaces/payment-details.interface';
import { ReceiptResponse } from './interfaces/receipt-response.interface';
import { EmailReceiptResponse } from './interfaces/email-receipt.interface';
import { InitPaymentReqDto } from './dto/init-paymet-req.dto';

@Injectable()
export class PaymentHttpService {
  constructor(private readonly httpService: HttpService) {}
  async getPaymentDetails(order_number: string) {
    try {
      const res = await this.httpService

        .get<PaymentDetails>('/api/payment/show', {
          params: {
            order_number,
          },
        })
        .toPromise();
      return res?.data;
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('Axios error details:', {
          message: error.message,
          code: error.code,
        });
      } else {
        console.error('Unexpected error:', error);
      }
      throw new Error('Failed to fetch payment details');
    }
  }
  async initPayment({ language, amount }: InitPaymentReqDto) {
    try {
      const res = await this.httpService
        .post<initPaymentResponse>('/api/payment/initiate', {
          amount,
          language,
        })
        .toPromise();
      return res?.data;
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('Axios error details:', {
          message: error.message,
          code: error.code,
        });
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }
  async createPdfInvoice(order_number: string) {
    try {
      const response = await this.httpService
        .get<ReceiptResponse>('https://epay.guiddini.dz/api/payment/receipt', {
          data: { order_number },
        })
        .toPromise();
      return response?.data;
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('Axios error details:', {
          message: error.message,
          code: error.code,
        });
      } else {
        console.error('Unexpected error:', error);
      }
      throw new Error('Failed to create PDF invoice');
    }
  }
  async sendEmailInvoice(order_number: string, email: string) {
    try {
      const response = await this.httpService
        .post<EmailReceiptResponse>(
          'https://epay.guiddini.dz/api/payment/email',
          {
            order_number,
            email,
          },
        )
        .toPromise();
      return response?.data;
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('Axios error details:', {
          message: error.message,
          code: error.code,
        });
      } else {
        console.error('Unexpected error:', error);
      }
      throw new Error('Failed to send email invoice');
    }
  }
}
