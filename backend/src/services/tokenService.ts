import jwt from "jsonwebtoken";

export type JwtPayload = {
  userId: number;
}

export class TokenService {
  private readonly tokenSecret: string;
  private readonly tokenDuration: string;

  constructor(secret: string, duration = "1h") {
    this.tokenSecret = secret;
    this.tokenDuration = duration;
  }

  public generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.tokenSecret, {
      expiresIn: this.tokenDuration as any, // Type assertion
    });
  }

  public verifyToken(token: string): JwtPayload {
    if (!token) throw new Error("Token missing");

    try {
      const decoded = jwt.verify(token, this.tokenSecret);

      if (typeof decoded === "object" && decoded !== null && "userId" in decoded) {
        return decoded as JwtPayload;
      }

      throw new Error("Invalid token payload");
    } catch (err) {
      throw new Error("Invalid or expired token");
    }
  }
}
