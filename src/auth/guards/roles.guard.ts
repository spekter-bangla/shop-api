import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../../users/user.model";
import { AllCustomErrors } from "../../utils/product.custom-errors";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    // get the role of the request
    const roles = this.reflector.get<Role[]>("roles", context.getHandler());
    if (!roles) {
      return true;
    }

    // now get the current user
    const request = context.switchToHttp().getRequest();

    if (!roles.some((role) => request.user.role.toLowerCase() === role)) {
      throw new UnauthorizedException();
    }

    return roles.some((role) => request.user.role.toLowerCase() === role);
  }
}
