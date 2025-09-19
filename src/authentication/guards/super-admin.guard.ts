import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthenticationService } from '../authentication.service';
import { getUserFromContext } from 'src/common/utils/authentication/get-user-id.utils';

export class SuperAdminGuard implements CanActivate {
  constructor(private readonly authService: AuthenticationService) {}
  canActivate(context: ExecutionContext): Promise<boolean> {
    const { id: userId } = getUserFromContext(context);
    return this.authService.isSuperAdmin(userId);
  }
}
