import { SetMetadata } from "@nestjs/common";
import { Role } from "../../users/user.model";

export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);