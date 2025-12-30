import { z } from "zod";

export const AuthRefreshDtoSchema = z.object({
  refreshToken: z.string(),
});
export type AuthRefreshDto = z.infer<typeof AuthRefreshDtoSchema>;

export const AuthSessionResponseDtoSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.date(),
  user: z.object({
    id: z.uuid(),
  }),
});
export type AuthSessionResponseDto = z.infer<
  typeof AuthSessionResponseDtoSchema
>;
