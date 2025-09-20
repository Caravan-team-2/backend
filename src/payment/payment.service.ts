import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { Transaction, TransactionStatus, TransactionType } from './entities/payment.entity';
import { PaymentHttpService } from './payment-http.service';
import { InitPaymentReqDto } from './dto/init-paymet-req.dto';
import { ConstatPaymentDto } from './dto/constat-payment.dto';
import { isAxiosError } from '@nestjs/terminus/dist/utils';
import { Constat } from 'src/constats/entities/constat.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Constat)
    private readonly constatRepository: Repository<Constat>,
    private readonly entityManager: EntityManager,
    private readonly paymentHttpService: PaymentHttpService,
  ) {}

  /**
   * EXTERNAL PAYMENT: Step 1
   * Initiates a payment via the gateway for a user top-up.
   * A pending transaction is created with the initial details from the gateway.
   */
  async initiatePayment(
    userId: string,
    { amount, language }: InitPaymentReqDto,
  ): Promise<Transaction> {
    const paymentDetails = await this.paymentHttpService.initPayment({
      amount,
      language,
    });

    if (!paymentDetails) {
      throw new InternalServerErrorException('Failed to initiate payment');
    }

    const transaction = this.transactionRepository.create({
      userId,
      amount: String(amount),
      type: TransactionType.EXTERNAL,
      transaction_id: paymentDetails.id, // Temporary ID from init
      order_number: `topup-${Date.now()}`,
      form_url: paymentDetails.attributes.form_url,
      status: TransactionStatus.PENDING,
    });

    return this.transactionRepository.save(transaction);
  }

  /**
   * EXTERNAL PAYMENT: Step 2
   * Handles the callback from the payment gateway after the user completes the payment.
   */
  async handlePaymentCallback(orderNumber: string): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      try {
        const transactionRepo = manager.getRepository(Transaction);
        const userRepo = manager.getRepository(User);

        const transaction = await transactionRepo.findOne({
          where: { order_number: orderNumber },
        });

        if (!transaction || transaction.status !== TransactionStatus.PENDING) {
          return; // Transaction already processed or does not exist
        }

        // Get the final payment details from the gateway
        const paymentDetails =
          await this.paymentHttpService.getPaymentDetails(orderNumber);

        if (!paymentDetails) {
          transaction.status = TransactionStatus.FAILED;
          transaction.error_message = 'Failed to fetch payment details.';
          await transactionRepo.save(transaction);
          return;
        }

        // Update the transaction with the final details from the gateway
transaction.order_number=paymentDetails.data.attributes.order_number;

        if (paymentDetails.data.attributes.status === 'SUCCESS') {
          transaction.status = TransactionStatus.SUCCESS;
          // Atomically increment the user's balance
          await userRepo.increment(
            { id: transaction.userId },
            'balance',
            parseFloat(transaction.amount),
          );
        }
        await transactionRepo.save(transaction);
      } catch (error) {
        if (isAxiosError(error)) {
          await manager.update(
            Transaction,
            { order_number: orderNumber },
            {
              status: TransactionStatus.FAILED,
              error_message: `Payment gateway error: ${error.message}`,
            },
          );
        }
      }
    });
  }

  /**
   * INTERNAL CREDIT
   * Credits a user's balance for internal operations (e.g., insurance payout).
   * This does NOT involve the payment gateway.
   */
  async creditUserBalance(
    userId: string,
    amount: string,
    order_number: string, // Represents the source of the credit, e.g., constatId
  ): Promise<Transaction> {
    return this.entityManager.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      await manager.increment(
        User,
        { id: userId },
        'balance',
        parseFloat(amount),
      );

      // Create a transaction record for this internal credit
      const transaction = manager.create(Transaction, {
        status: TransactionStatus.SUCCESS,
        userId,
        amount,
        type: TransactionType.INTERNAL,
        order_number, // The reference for the internal credit (e.g., constatId)
        transaction_id: 'internal-' + Date.now(), // Unique internal ID
        form_url: '', // Not needed for internal transactions
      });

      return manager.save(transaction);
    });
  }

  /**
   * CONSTAT PAYMENT
   * Initiates payment for a constat and updates the isPaid status to true.
   * This method handles the payment flow for constat processing fees.
   */
  async processConstatPayment(
    userId: string,
    { constatId, language }: ConstatPaymentDto,
  ): Promise<Transaction> {
    return this.entityManager.transaction(async (manager) => {
      // Find the constat and verify it exists and belongs to the user
      const constat = await manager.findOne(Constat, {
        where: { id: constatId },
      });

      if (!constat) {
        throw new NotFoundException('Constat not found');
      }

      // Verify the user is involved in this constat
      if (constat.driverAId !== userId && constat.driverBId !== userId) {
        throw new NotFoundException('Constat not found for this user');
      }

      // Check if constat is already paid
      if (constat.isPaid) {
        throw new InternalServerErrorException('Constat is already paid');
      }

      // Get the cost from the constat (should be set by an expert)
      if (!constat.cost) {
        throw new InternalServerErrorException('Constat cost not estimated yet');
      }

      // Initiate payment with the gateway
      const paymentDetails = await this.paymentHttpService.initPayment({
        amount: constat.cost,
        language,
      });

      if (!paymentDetails) {
        throw new InternalServerErrorException('Failed to initiate payment');
      }

      // Create transaction record
      const transaction = manager.create(Transaction, {
        userId,
        amount: constat.cost,
        type: TransactionType.EXTERNAL,
        transaction_id: paymentDetails.id,
        form_url: paymentDetails.attributes.form_url,
        status: TransactionStatus.PENDING,
      });

      const savedTransaction = await manager.save(transaction);

      // Update constat isPaid status to true
      await manager.update(Constat, { id: constatId }, { isPaid: true });

      return savedTransaction;
    });
  }
}
