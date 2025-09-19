import { CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { getUserFromContext } from 'src/common/utils/authentication/get-user-id.utils';
import { AuthenticationService } from '../authentication.service';

export class assAdminGuard implements CanActivate {
  constructor(private readonly authService: AuthenticationService) {}
  canActivate(context: ExecutionContext): Promise<boolean> {
    const user = getUserFromContext(context);

    const companyId = GqlExecutionContext.create(context).getArgs()
      .companyId as string;

    if (!companyId) {
      return Promise.resolve(true);
    }
    return this.authService.isAssAdmin(user.id, companyId);
  }
}
