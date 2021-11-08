import { v4 } from "uuid";
import { RedisService } from "../redis/redis.service";

// => https://my-site.com/verify/<id>
export const createVerifyEmailLink = async (
  url: string,
  userId: string,
  redis: RedisService,
): Promise<string> => {
  const id = v4();
  await redis.set(id, userId, 60 * 60 * 24 * 30); // 30 day expired time
  return `${url}/api/v1/auth/verify/${id}`;
};

export const createForgotPasswordLink = async (
  url: string,
  userId: string,
  redis: RedisService,
): Promise<string> => {
  const id = v4();
  await redis.set(`forgotPassword:${id}`, userId, 60 * 60 * 24); // 1 day expired time
  return `${url}/change-password/${id}`;
};
