import "reflect-metadata";
import { INestApplication, VersioningType } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { AuthController } from "@/src/modules/auth/auth.controller";
import { AuthService } from "@/src/modules/auth/auth.service";

describe("Auth Module E2E Tests", () => {
  let app: INestApplication;

  const mockAuthService = {
    startOTPChallenge: vi
      .fn()
      .mockResolvedValue({ challengeId: "test-challenge-id" }),
    verifyOTPChallenge: vi.fn().mockResolvedValue({
      accessToken: "test-access-token",
      refreshToken: "test-refresh-token",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      user: { id: "test-user-id" },
    }),
    refreshSession: vi.fn().mockResolvedValue({
      accessToken: "test-access-token",
      refreshToken: "test-refresh-token",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      user: { id: "test-user-id" },
    }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    app = moduleRef.createNestApplication();
    app.enableVersioning({
      type: VersioningType.URI,
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("OTP Start Challenge", () => {
    it("POST /v1/auth/otp/start-challenge", async () => {
      const response = await request(app.getHttpServer())
        .post("/v1/auth/otp/start-challenge")
        .send({
          channel: "email",
          identifier: "test@example.com",
          purpose: "sign_in",
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        challengeId: expect.any(String),
      });
      expect(mockAuthService.startOTPChallenge).toHaveBeenCalledWith({
        channel: "email",
        identifier: "test@example.com",
        purpose: "sign_in",
      });
    });
  });
});
