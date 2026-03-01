import crypto from "crypto";

const ENCODING: BufferEncoding = "hex";

export const generateRefreshToken = (): string => {
  return crypto.randomBytes(32).toString(ENCODING);
};

export const hashRefreshToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest(ENCODING);
};
