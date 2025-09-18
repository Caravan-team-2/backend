import { Inject, Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { AccessTokenPayload } from '../interfaces/access-token-payload.interface';
import { User } from 'src/user/entities/user.entity';
import authConfig from 'src/config/auth.config';
import { AuthConfig } from 'src/config/interfaces/auth-config.interface';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor(
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: config.jwt.accessTokenSecret,
    });
  }

  
  validate(payload: AccessTokenPayload): AccessTokenPayload['user'] {
    return payload.user;
  }
}
