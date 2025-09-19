import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { getUserFromContext } from 'src/common/utils/authentication/get-user-id.utils';
import { VerificationService } from '../verification.service';

export class verificationGuard implements CanActivate {
  constructor(private readonly verificationService: VerificationService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { id: userId } = getUserFromContext(context);

    return this.verificationService.isUserVerified(userId);
  }
}
