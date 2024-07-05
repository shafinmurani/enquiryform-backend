import jwt from "jsonwebtoken";
import dotenv from "dotenv";
//For env File
dotenv.config();
export class JWT {
  public generateAccessToken(
    email: string,
    result: { vFirstName: string; vLastName: string; iAdminID: string }[],
  ): string {
    return jwt.sign(
      {
        email: email,
        signInTime: Date.now(),
        name: result[0].vFirstName + " " + result[0].vLastName,
        id: result[0].iAdminID,
      },
      process.env.TOKEN_SECRET || "secret_key",
      {
        expiresIn: "86400s",
      },
    );
  }

  public decode(token: string): string | jwt.JwtPayload | null {
    return jwt.decode(token);
  }
}
