import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { IntegrationService } from './integration.service';
import { Integration } from './entities/integration.entity';
import { CreateIntegrationInput } from './dtos/create-integration.input';
import { UpdateIntegrationInput } from './dtos/update-integration.input';


@Resolver(() => Integration)
export class IntegrationResolver {
  constructor(private readonly integrationService: IntegrationService) {}

  @Mutation(() => Integration)
  createIntegration(
    @Args('createIntegrationInput')
    createIntegrationInput: CreateIntegrationInput,
  ) {
    return this.integrationService.create(createIntegrationInput);
  }

  @Query(() => [Integration], { name: 'integrations' })
  findAll() {
    return this.integrationService.findAll();
  }

  @Query(() => Integration, { name: 'integration' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.integrationService.findOne(id);
  }

  @Mutation(() => Integration)
  updateIntegration(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateIntegrationInput')
    updateIntegrationInput: UpdateIntegrationInput,
  ) {
    return this.integrationService.update(id, updateIntegrationInput);
  }

  @Mutation(() => Integration)
  removeIntegration(@Args('id', { type: () => ID }) id: string) {
    return this.integrationService.remove(id);
  }
}
