import IORedis from "ioredis";

declare global {
  var redis: IORedis | undefined;
}

const redisUrl = process.env.REDIS_URL;

export const redis =
  global.redis ??
  (redisUrl
    ? new IORedis(redisUrl, {
        maxRetriesPerRequest: null,
      })
    : new IORedis({
        host: process.env.REDIS_HOST ?? "localhost",
        port: Number(process.env.REDIS_PORT ?? 6379),
        maxRetriesPerRequest: null,
      }));

if (process.env.NODE_ENV !== "production") {
  global.redis = redis;
}
