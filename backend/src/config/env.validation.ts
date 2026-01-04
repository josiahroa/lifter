import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  OTP_SECRET: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  POWERSYNC_BASE64_PRIVATE_KEY: z.string(),
  POWERSYNC_BASE64_PUBLIC_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
