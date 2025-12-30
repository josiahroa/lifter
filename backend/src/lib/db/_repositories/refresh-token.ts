// import type { DbLike } from "@/src/types";
// import { refreshTokens } from "@/src/schema/auth";
// import { z } from "zod";
// import {
//   // createInsertSchema,
//   createSelectSchema,
//   // createUpdateSchema,
// } from "drizzle-zod";
// import { eq } from "drizzle-orm";

// // drizzle-zod createInsertSchema is not working as expected, so use zod directly for now
// // export const RefreshTokenInsertSchema = createInsertSchema(refreshTokens);
// export const RefreshTokenInsertSchema = z.object({
//   id: z.uuid().optional(),
//   sessionId: z.uuid(),
//   tokenHash: z.string(),
//   expiresAt: z.date(),
//   replacedByHash: z.string().optional(),
//   revokedAt: z.date().optional(),
//   rotatedAt: z.date().optional(),
//   createdAt: z.date().optional(),
//   updatedAt: z.date().optional(),
// });
// export type RefreshTokenInsert = z.infer<typeof RefreshTokenInsertSchema>;

// export const RefreshTokenSelectSchema = createSelectSchema(refreshTokens);
// export type RefreshTokenSelect = z.infer<typeof RefreshTokenSelectSchema>;

// // drizzle-zod createUpdateSchema is not working as expected, so use zod directly for now
// // export const RefreshTokenUpdateSchema = createUpdateSchema(refreshTokens);
// export const RefreshTokenUpdateSchema = z.object({
//   id: z.uuid().optional(),
//   sessionId: z.uuid(),
//   tokenHash: z.string(),
//   expiresAt: z.date(),
//   replacedByHash: z.string().optional(),
//   revokedAt: z.date().optional(),
//   rotatedAt: z.date().optional(),
//   createdAt: z.date().optional(),
//   updatedAt: z.date().optional(),
// });
// export type RefreshTokenUpdate = z.infer<typeof RefreshTokenUpdateSchema>;

// export const FindRefreshTokenPayloadSchema = RefreshTokenSelectSchema.pick({
//   tokenHash: true,
// });
// export type FindRefreshTokenPayload = z.infer<
//   typeof FindRefreshTokenPayloadSchema
// >;

// export const RotateRefreshTokenPayloadSchema = RefreshTokenUpdateSchema.pick({
//   id: true,
//   rotatedAt: true,
//   replacedByHash: true,
// }).extend({
//   id: z.uuid(),
//   rotatedAt: z.date(),
//   replacedByHash: z.string(),
// });
// export type RotateRefreshTokenPayload = z.infer<
//   typeof RotateRefreshTokenPayloadSchema
// >;

// export const RevokeRefreshTokenPayloadSchema = RefreshTokenUpdateSchema.pick({
//   sessionId: true,
//   revokedAt: true,
// }).extend({
//   sessionId: z.uuid(),
//   revokedAt: z.date(),
// });
// export type RevokeRefreshTokenPayload = z.infer<
//   typeof RevokeRefreshTokenPayloadSchema
// >;

// export class RefreshTokenRepository {
//   constructor(private readonly db: DbLike) {}

//   /**
//    * Inserts a refresh token
//    * @param payload - The refresh token to insert
//    * @returns The inserted refresh token or null if the operation failed
//    */
//   async insertRefreshToken(
//     payload: RefreshTokenInsert
//   ): Promise<RefreshTokenSelect | null> {
//     try {
//       const { success, data } = RefreshTokenInsertSchema.safeParse(payload);

//       if (!success) return null;

//       const refreshToken = await this.db
//         .insert(refreshTokens)
//         .values(data)
//         .returning();

//       if (refreshToken.length === 0) return null;

//       const resParsed = RefreshTokenSelectSchema.safeParse(refreshToken[0]);

//       if (!resParsed.success) return null;

//       return resParsed.data;
//     } catch (error) {
//       // Throwing an error will allow the client to retry the operation
//       // TOOD: Determine errors that can retry, otherwise, return null
//       console.error(error);
//       return null;
//     }
//   }

//   /**
//    * Finds a refresh token by token hash
//    * @param payload - The token hash to find
//    * @returns The found refresh token or null if the operation failed
//    */
//   async findRefreshToken(
//     payload: FindRefreshTokenPayload
//   ): Promise<RefreshTokenSelect | null> {
//     try {
//       const { success, data } =
//         FindRefreshTokenPayloadSchema.safeParse(payload);

//       if (!success) return null;

//       const refreshToken = await this.db
//         .select()
//         .from(refreshTokens)
//         .where(eq(refreshTokens.tokenHash, data.tokenHash));

//       if (refreshToken.length === 0) return null;

//       const resParsed = RefreshTokenSelectSchema.safeParse(refreshToken[0]);

//       if (!resParsed.success) return null;

//       return resParsed.data;
//     } catch (error) {
//       // Throwing an error will allow the client to retry the operation
//       // TOOD: Determine errors that can retry, otherwise, return null
//       console.error(error);
//       return null;
//     }
//   }

//   /**
//    * Rotates a refresh token
//    * @param payload - The refresh token to rotate
//    * @returns The rotated refresh token or null if the operation failed
//    */
//   async rotateRefreshToken(
//     payload: RotateRefreshTokenPayload
//   ): Promise<RefreshTokenSelect | null> {
//     try {
//       const { success, data } =
//         RotateRefreshTokenPayloadSchema.safeParse(payload);

//       if (!success) return null;

//       const { id, ...rest } = data;
//       const rotatedRefreshToken = await this.db
//         .update(refreshTokens)
//         .set(rest)
//         .where(eq(refreshTokens.id, id))
//         .returning();

//       if (rotatedRefreshToken.length === 0) return null;

//       const resParsed = RefreshTokenSelectSchema.safeParse(
//         rotatedRefreshToken[0]
//       );

//       if (!resParsed.success) return null;

//       return resParsed.data;
//     } catch (error) {
//       // Throwing an error will allow the client to retry the operation
//       // TOOD: Determine errors that can retry, otherwise, return null
//       console.error(error);
//       return null;
//     }
//   }

//   /**
//    * Revokes all refresh tokens for a given session id
//    * @param payload - The session id to revoke refresh tokens for
//    * @returns The revoked refresh token or null if the operation failed
//    */
//   async revokeRefreshToken(
//     payload: RevokeRefreshTokenPayload
//   ): Promise<RefreshTokenSelect | null> {
//     try {
//       const { success, data } =
//         RevokeRefreshTokenPayloadSchema.safeParse(payload);

//       if (!success) return null;

//       const revokedRefreshToken = await this.db
//         .update(refreshTokens)
//         .set({ revokedAt: data.revokedAt })
//         .where(eq(refreshTokens.sessionId, data.sessionId))
//         .returning();

//       if (revokedRefreshToken.length === 0) return null;

//       const resParsed = RefreshTokenSelectSchema.safeParse(
//         revokedRefreshToken[0]
//       );

//       if (!resParsed.success) return null;

//       return resParsed.data;
//     } catch (error) {
//       // Throwing an error will allow the client to retry the operation
//       // TOOD: Determine errors that can retry, otherwise, return null
//       console.error(error);
//       return null;
//     }
//   }
// }
