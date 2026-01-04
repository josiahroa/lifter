import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { importSPKI, exportJWK } from "jose";

import { Env } from "@/src/config/env.validation";

export interface JWKSKey {
  kty: string;
  kid: string;
  alg: string;
  use: string;
  n: string;
  e: string;
}

export interface GetJWKSResult {
  keys: JWKSKey[];
}

@Injectable()
export class JWKSService {
  private alg = "RS512";
  private kid = "powersync";
  private kty = "RSA";

  constructor(private readonly configService: ConfigService<Env, true>) {}

  async getJWKS(): Promise<GetJWKSResult> {
    const publicKey = Buffer.from(
      this.configService.get("POWERSYNC_BASE64_PUBLIC_KEY", {
        infer: true,
      }),
      "base64"
    ).toString("utf-8");

    const key = await importSPKI(publicKey, this.alg);

    const jwk = await exportJWK(key);

    const jwsKey = {
      ...jwk,
      kid: this.kid,
      kty: this.kty,
      alg: this.alg,
    };

    return {
      keys: [jwsKey as JWKSKey],
    };
  }
}
