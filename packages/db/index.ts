import {
  drizzle,
  PlanetScaleDatabase,
} from "drizzle-orm/planetscale-serverless";

export interface ConnectionConfig {
  host: string;
  username: string;
  password: string;
}

export function createDb(config: ConnectionConfig): PlanetScaleDatabase {
  return drizzle({
    connection: {
      host: config.host,
      username: config.username,
      password: config.password,
    },
  });
}

export * from "./schema";
