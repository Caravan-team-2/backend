
import { Controller, Post, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Constat Gateway')
@Controller('constat-gateway-docs')
export class ConstatGatewayDocsController {
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
}
