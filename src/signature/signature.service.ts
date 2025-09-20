import { Injectable } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';
import { InjectRepository } from '@nestjs/typeorm';
import { Signature } from './entities/signature.entity';
import { Repository } from 'typeorm';
import { CreateSignatureInput } from './dtos/create-signature.dto';
import { ConstatSession } from 'src/constats/types/constat-session.type';

@Injectable()
export class SignatureService {
  constructor(
    @InjectRepository(Signature)
    private readonly signatureRepo: Repository<Signature>,
  ) {}

  /**
   * @description Sanitizes the svg code .
   * @param svgCode The embeded code to sanitize.
   * @returns The sanitized svg code.
   */
  sanitizeSvgCode(svgCode: string) {
    return sanitizeHtml(svgCode, {
      allowedTags: [
        'svg',
        'g',
        'path',
        'circle',
        'ellipse',
        'line',
        'polyline',
        'polygon',
        'rect',
        'text',
        'tspan',
      ],
      allowedAttributes: {
        svg: ['xmlns', 'width', 'height', 'viewBox', 'fill', 'stroke'],
        g: ['transform', 'fill', 'stroke'],
        path: ['d', 'fill', 'stroke', 'stroke-width'],
        circle: ['cx', 'cy', 'r', 'fill', 'stroke'],
        ellipse: ['cx', 'cy', 'rx', 'ry', 'fill', 'stroke'],
        rect: ['x', 'y', 'width', 'height', 'rx', 'ry', 'fill', 'stroke'],
        line: ['x1', 'y1', 'x2', 'y2', 'stroke'],
        polyline: ['points', 'fill', 'stroke'],
        polygon: ['points', 'fill', 'stroke'],
        text: ['x', 'y', 'fill', 'font-size', 'font-family'],
        tspan: ['x', 'y'],
      },
      allowedSchemes: ['http', 'https', 'data'],
    });
  }

  async create(dto: CreateSignatureInput) {
    const signature = this.signatureRepo.create({
      ...dto,
      visualSignature: this.sanitizeSvgCode(dto.visualSignature),
      cryptoSignature: this.generateHash(),
    });
    return await this.signatureRepo.save(signature);
  }

  generateHash() {
    return 'strong hash';
  }

  getSignatureById(id: string) {
    return this.signatureRepo.findOneOrFail({ where: { id } });
  }

  getSignatureByUser(driverId: string) {
    return this.signatureRepo.findBy({ driverId });
  }

  async generateCryptoSignature(
    session: ConstatSession,
    userId: string,
  ): Promise<string> {
    // NOTE: Implement crypto signature logic here

    const sessionDataForSigning = {
      sessionId: session.sessionId,
      userId,
      timestamp: Date.now(),
      // Include relevant session data
    };
    return 'generate a hash';
  }
}
