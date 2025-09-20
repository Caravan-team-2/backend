
import { Controller, Post, Patch, Delete } from '@nestjs/common';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Constat } from './entities/constat.entity';
import { ConstatSession } from './types/constat-session.type';
import { ConstatsService } from './constats.service';

@ApiTags('Constat ')
@Controller('constat')
export class ConstatGatewayDocsController {
  constructor(
    private readonly constatService: ConstatsService
  ) {}
  @ApiOperation({
    summary: 'Create a new constat session',
    description: 'Event: create_session',
  })
  @ApiBody({
    schema: {
      properties: {
        role: { type: 'string' },
        userId: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Emits session_created event with sessionId',
  })
  @Post('create-session')
  createSession() {}

  @ApiOperation({
    summary: 'Join an existing constat session',
    description: 'Event: join_session',
  })
  @ApiBody({
    schema: {
      properties: {
        sessionId: { type: 'string' },
        userId: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Emits driver_joined event with userId',
  })
  @Post('join-session')
  joinSession() {}

  @ApiOperation({
    summary: 'Update the draft of a constat session',
    description: 'Event: update_draft',
  })
  @ApiBody({
    schema: {
      properties: {
        sessionId: { type: 'string' },
        field: { type: 'string' },
        value: { type: 'any' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Emits draft_updated event with the updated draft and timestamp',
  })
  @Patch('update-draft')
  updateDraft() {}

  @ApiOperation({
    summary: 'Accept the terms of a constat session',
    description: 'Event: accept',
  })
  @ApiBody({
    schema: {
      properties: {
        sessionId: { type: 'string' },
        userId: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description:
      'Emits session_status with accepted users or constat_submitted if both users accepted',
  })
  @Post('accept')
  accept() {}
  public extractProviderFromTopic(topic: string, suffix: string): string {
    return topic.replace(suffix, '');
  }
@MessagePattern('*-constat.created')
  async handleConstatCreated(
    @Payload() data: ConstatSession,
    @Ctx() context: KafkaContext
  ) {
    const topic = context.getTopic();
    const providerId = this.extractProviderFromTopic(topic, '-constat.created');
    
    console.log(`Received constat from provider: ${providerId}`);
    console.log(`Topic: ${topic}`);
    console.log(`Data:`, data);
    
    // Route to provider-specific handler
    return this.(providerId, data);
  }
}
