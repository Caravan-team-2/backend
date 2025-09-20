import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Integration } from './entities/integration.entity';
import { CreateIntegrationInput } from './dtos/create-integration.input';
import { UpdateIntegrationInput } from './dtos/update-integration.input';

@Injectable()
export class IntegrationService {
  constructor(
    @InjectRepository(Integration)
    private readonly integrationRepository: Repository<Integration>,
  ) {}

  create(createIntegrationInput: CreateIntegrationInput): Promise<Integration> {
    const integration = this.integrationRepository.create(
      createIntegrationInput,
    );
    return this.integrationRepository.save(integration);
  }

  findAll(): Promise<Integration[]> {
    return this.integrationRepository.find();
  }

  async findOne(id: string): Promise<Integration> {
    const integration = await this.integrationRepository.findOne({
      where: { id },
    });
    if (!integration) {
      throw new NotFoundException(`Integration with ID "${id}" not found`);
    }
    return integration;
  }

  async update(
    id: string,
    updateIntegrationInput: UpdateIntegrationInput,
  ): Promise<Integration> {
    const integration = await this.integrationRepository.preload({
      id,
      ...updateIntegrationInput,
    });
    if (!integration) {
      throw new NotFoundException(`Integration with ID "${id}" not found`);
    }
    return this.integrationRepository.save(integration);
  }

  async remove(id: string): Promise<Integration> {
    const integration = await this.findOne(id);
    await this.integrationRepository.remove(integration);
    // Create a new object to avoid returning a reference to the removed entity
    return { ...integration, id };
  }
}
