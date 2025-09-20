import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { EmailModule } from './email/email.module';
import { HealthModule } from './health/health.module';
import { QueueModule } from './queue/queue.module';
import mailConfig from './config/mail.config';
import redisConfig from './config/redis.config';
import authConfig from './config/auth.config';
import { RedisModule } from 'nestjs-redis-client';
import cloudConfig from './config/cloud.config';
import appConfig from './config/app.config';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationModule } from './verification/verification.module';
import { ConstatsModule } from './constats/constats.module';
import { InsurranceCompanyModule } from './insurrance_company/insurrance_company.module';
import { SignatureModule } from './signature/signature.module';
import { PdfGeneratorModule } from './pdf-generator/pdf-generator.module';
import databaseConfig from './config/database.config';
import { Attachment } from './constats/entities/attachment.entity';
import { WithdrawModule } from './withdraw/withdraw.module';
import { PaymentModule } from './payment/payment.module';
import { UserInsurranceModule } from './user_insurrance/user_insurrance.module';
import aiConfig from './config/ai.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
@Module({
  imports: [
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    TypeOrmModule.forFeature([Attachment]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      path: '/graphql',
      playground: true,
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res }),
      driver: ApolloDriver,
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (appConf: ConfigType<typeof appConfig>) => ({
        throttlers: [
          {
            name: 'Main throttler',
            ...appConf.throttler,
          },
        ],
      }),
      inject: [appConfig.KEY],
    }),
    RedisModule.registerAsync(redisConfig.asProvider()),
    ConfigModule.forRoot({
      expandVariables: true,

      cache: true,
      isGlobal: true, // Makes the configuration available globally
      validationSchema: null, // You can define a Joi schema here for validation if needed
      load: [
        mailConfig,
        redisConfig,
        authConfig,
        appConfig,
        cloudConfig,
        aiConfig,
      ],
    }),
    ClientsModule.register([
      {
        name: 'AI_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
          
            clientId: 'ai_service',
            brokers: ['kafka:9092'],
          },
          consumer: {
            allowAutoTopicCreation: true,
            groupId: 'ai-consumer',
          },
          producerOnlyMode: true,
          
          
        },
      },
    ]),

    AuthenticationModule,
    UserModule,
    EmailModule,
    HealthModule,
    QueueModule,
    VerificationModule,
    ConstatsModule,
    InsurranceCompanyModule,
    SignatureModule,
    PdfGeneratorModule,
    PaymentModule,
    UserInsurranceModule,
    WithdrawModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
