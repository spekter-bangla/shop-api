import { CanActivate, ExecutionContext, mixin } from "@nestjs/common";
import { Role } from "../../users/user.model";

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}
//   canActivate(context: ExecutionContext): boolean {
//     // get the role of the request
//     const roles = this.reflector.get<Role[]>("roles", context.getHandler());
//     if (!roles) {
//       return true;
//     }

//     // now get the current user
//     const request = context.switchToHttp().getRequest();
//     const requestData = request;

//     return roles.some((role) => requestData.user.role.toLowerCase() === role);
//   }
// }

export const RolesGuard = (...roles: Role[]) => {
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest();

      return roles.some((role) => req.user.role.toLowerCase() === role);
    }
  }

  return <any>mixin(RolesGuardMixin);
};
