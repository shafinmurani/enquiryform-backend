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
        expiresIn: "1200s",
      },
    );
  }

  public decode(token: string): string | jwt.JwtPayload | null {
    return jwt.decode(token);
  }

  public verifyToken(token: string): {} {
    var result:
      | { tokenStatus: boolean; token?: undefined }
      | { tokenStatus: boolean; token: string | jwt.JwtPayload }
      | {} = {};
    jwt.verify(
      token,
      process.env.TOKEN_SECRET || "secret_key",
      function (err, decoded) {
        if (err) {
          result = {
            tokenStatus: false,
          };
        } else if (decoded) {
          result = {
            tokenStatus: true,
            token: decoded,
          };
        }
      },
    );
    return result;
  }
}
