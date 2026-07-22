import crypto from "crypto";

export function generateToken(size: number) {
  return crypto.randomBytes(size).toString("hex");
}

export function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
