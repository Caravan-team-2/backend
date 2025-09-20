import { Module } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Integration } from './entities/integration.entity';
import { IntegrationResolver } from './integration.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Integration])],
  providers: [IntegrationResolver, IntegrationService],
})
export class IntegrationModule {}
