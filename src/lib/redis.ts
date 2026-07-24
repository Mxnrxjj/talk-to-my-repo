import IORedis from "ioredis";

declare global {
  // Prevent multiple Redis connections during development
  var redis: IORedis | undefined;
}

export const redis =
  global.redis ??
  new IORedis({
    host: "localhost",
    port: 6379,
    maxRetriesPerRequest: null,
  });

if (process.env.NODE_ENV !== "production") {
  global.redis = redis;
}
