import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { RedisService } from 'nestjs-redis-client';
import { Server, Socket } from 'socket.io';
import { v4 as uuid } from 'uuid';
import { ConstatSession } from './types/constat-session.type';
import { ConstatsService } from './constats.service';

@WebSocketGateway({ cors: true })
export class ConstatGateway {
  @WebSocketServer() server: Server;

  constructor(
    private readonly redisService: RedisService,
    private readonly constatService: ConstatsService,
  ) {}

  @SubscribeMessage('create_session')
  async handleCreateSession(
    client: Socket,
    payload: { role: string; userId: string },
  ) {
    const sessionId = uuid();

    const session: ConstatSession = {
      sessionId,
      driverAId: payload.userId,
      draft: {},
      accepted: [],
      status: 'draft',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await this.redisService.set(`constat:session:${sessionId}`, session, 86400);

    await client.join(`constat:${sessionId}`);
    client.emit('session_created', { sessionId });
  }

  @SubscribeMessage('join_session')
  async handleJoinSession(
    client: Socket,
    payload: { sessionId: string; userId: string },
  ) {
    const key = `constat:session:${payload.sessionId}`;
    const session = await this.redisService.get<ConstatSession>(key);
    if (!session) return client.emit('error', { msg: 'Session not found' });

    session.driverBId = payload.userId;
    session.updatedAt = Date.now();

    await this.redisService.set(key, session, 86400);

    await client.join(`constat:${payload.sessionId}`);
    this.server
      .to(`constat:${payload.sessionId}`)
      .emit('driver_joined', { userId: payload.userId });
  }

  @SubscribeMessage('update_draft')
  async handleUpdateDraft(
    client: Socket,
    payload: { sessionId: string; field: string; value: any },
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

  @SubscribeMessage('accept')
  async handleAccept(
    client: Socket,
    payload: { sessionId: string; userId: string },
  ) {
    const key = `constat:session:${payload.sessionId}`;
    const session = await this.redisService.get<ConstatSession>(key);
    if (!session) return client.emit('error', { msg: 'Session not found' });

    if (!session.accepted.includes(payload.userId)) {
      session.accepted.push(payload.userId);
    }

    if (session.accepted.length === 2) {
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
}
