import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { RedisService } from 'nestjs-redis-client';
import { Server, Socket } from 'socket.io';
import { v4 as uuid } from 'uuid';
import { ConstatSession } from './types/constat-session.type';
import { ConstatsService } from './constats.service';
import { SignatureType } from '../signature/entities/signature.entity';
import { SignatureService } from 'src/signature/signature.service';

@WebSocketGateway({ cors: true })
//TODO extend auth here
export class ConstatGateway {
  @WebSocketServer() server: Server;

  constructor(
    private readonly redisService: RedisService,
    private readonly constatService: ConstatsService,
    private readonly signatureService: SignatureService,
  ) {}

  @SubscribeMessage('create_session')
  async handleCreateSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { role: string; userId: string },
  ) {
    const sessionId = uuid();

    const session: ConstatSession = {
      sessionId,
      //TODO get this from socket
      driverAId: payload.userId,
      draft: {},
      accepted: [],
      signatureValidation: {},
      status: 'draft',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    //NOTE:maybe extract this to a static method
    await this.redisService.set(`constat:session:${sessionId}`, session, 86400);
    await client.join(`constat:${sessionId}`);
    client.emit('session_created', { sessionId });
  }

  @SubscribeMessage('join_session')
  async handleJoinSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { sessionId: string; userId: string },
  ) {
    const key = `constat:session:${payload.sessionId}`;
    const session = await this.redisService.get<ConstatSession>(key);
    if (!session) return client.emit('error', { msg: 'Session not found' });

    session.driverBId = payload.userId;
    session.updatedAt = Date.now();

    // Initialize signature validation for driver B
    if (!session.signatureValidation) {
      session.signatureValidation = {};
    }
    session.signatureValidation[payload.userId] = {
      visualSignatureProvided: false,
      cryptoSignatureGenerated: false,
    };

    await this.redisService.set(key, session, 86400);
    await client.join(`constat:${payload.sessionId}`);

    this.server
      .to(`constat:${payload.sessionId}`)
      .emit('driver_joined', { userId: payload.userId });
  }

  @SubscribeMessage('update_draft')
  async handleUpdateDraft(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { sessionId: string; field: string; value: any },
  ) {
    const key = `constat:session:${payload.sessionId}`;
    const session = await this.redisService.get<ConstatSession>(key);
    if (!session) return client.emit('error', { msg: 'Session not found' });

    session.draft[payload.field] = payload.value;
    session.updatedAt = Date.now();

    await this.redisService.set(key, session, 86400);

    this.server.to(`constat:${payload.sessionId}`).emit('draft_updated', {
      draft: session.draft,
      updatedAt: session.updatedAt,
    });
  }
  @SubscribeMessage('submit_signature')
  async handleSubmitSignature(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      sessionId: string;
      userId: string;
      visualSignatureData: string; // base64 image or svg code
    },
  ) {
    const key = `constat:session:${payload.sessionId}`;
    const session = await this.redisService.get<ConstatSession>(key);
    if (!session) return client.emit('error', { msg: 'Session not found' });

    // Initialize signatures array if not exists
    if (!session.draft.signatures) {
      session.draft.signatures = [];
    }

    // Add visual signature
    const visualSignature = {
      id: uuid(),
      driverId: payload.userId,
      signatureType: SignatureType.VISUAL,
      signatureData: payload.visualSignatureData,
    };

    // Generate crypto signature (you'll need to implement this based on your crypto logic)
    const cryptoSignatureData = this.signatureService.generateHash();
    const cryptoSignature = {
      id: uuid(),
      driverId: payload.userId,
      signatureType: SignatureType.CRYPTO,
      signatureData: cryptoSignatureData,
    };

    // Add both signatures to session
    session.draft.signatures.push(visualSignature, cryptoSignature);

    // Update signature validation
    if (!session.signatureValidation) {
      session.signatureValidation = {};
    }
    session.signatureValidation[payload.userId] = {
      visualSignatureProvided: true,
      cryptoSignatureGenerated: true,
      validatedAt: Date.now(),
    };

    session.updatedAt = Date.now();
    await this.redisService.set(key, session, 86400);

    client.emit('signature_submitted', {
      userId: payload.userId,
      validated: true,
    });
  }

  @SubscribeMessage('accept')
  async handleAccept(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { sessionId: string; userId: string },
  ) {
    const key = `constat:session:${payload.sessionId}`;
    const session = await this.redisService.get<ConstatSession>(key);
    if (!session) return client.emit('error', { msg: 'Session not found' });

    // Validate signature before accepting
    const signatureValidation = session.signatureValidation?.[payload.userId];
    if (
      !signatureValidation?.visualSignatureProvided ||
      !signatureValidation?.cryptoSignatureGenerated
    ) {
      return client.emit('error', {
        msg: 'Signature required before acceptance',
      });
    }

    if (!session.accepted.includes(payload.userId)) {
      session.accepted.push(payload.userId);
    }

    if (session.accepted.length === 2) {
      const allDriversSigned = [session.driverAId, session.driverBId]
        .filter((driverId): driverId is string => driverId !== undefined)
        .every((driverId) => {
          const validation = session.signatureValidation?.[driverId];
          return (
            this.hasValidSignature(validation) &&
            validation.visualSignatureProvided
          );
        });

      if (!allDriversSigned) {
        return client.emit('error', {
          msg: 'All drivers must sign before submission',
        });
      }

      session.status = 'submitted';
      const savedConstat =
        await this.constatService.finalizeFromSession(session);

      this.server.to(`constat:${payload.sessionId}`).emit('constat_submitted', {
        constatId: savedConstat.id,
        status: savedConstat.status,
        createdAt: savedConstat.createdAt,
      });

      await this.redisService.del(key);
      return;
    }

    await this.redisService.set(key, session, 86400);
    this.server.to(`constat:${payload.sessionId}`).emit('session_status', {
      status: session.status,
      accepted: session.accepted,
    });
  }

  hasValidSignature(
    validation: unknown,
  ): validation is { visualSignatureProvided: boolean } {
    return (
      validation !== null &&
      validation !== undefined &&
      typeof validation === 'object' &&
      'visualSignatureProvided' in validation &&
      typeof (validation as any).visualSignatureProvided === 'boolean'
    );
  }
}
