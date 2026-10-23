import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import { env } from "../config/env.ts";

const jwtAlgorithm = "HS256";
const secret = new TextEncoder().encode(env.jwtSecret);

export async function signAccessToken(userId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: jwtAlgorithm, typ: "JWT" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(env.jwtExpiresIn)
    .sign(secret);
}

export async function verifyAccessToken(token: string): Promise<string> {
  const { payload } = await jwtVerify(token, secret, {
    algorithms: [jwtAlgorithm],
    requiredClaims: ["exp", "sub"],
  });

  return z.uuid().parse(payload.sub);
}
