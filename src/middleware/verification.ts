import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: "admin" | "user" };
}

export const verification = (role: "admin" | "user"): RequestHandler => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const token =
        role === "admin"
          ? req.cookies.adminAccessToken
          : req.cookies.userAccessToken;
      const refreshToken =
        role === "admin"
          ? req.cookies.adminRefreshToken
          : req.cookies.userRefreshToken;

      if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
      }

      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_KEY as string,
        (err: any, decoded: any) => {
          if (err) {
            if (!refreshToken) {
              res
                .status(401)
                .json({ message: "Unauthorized: No refresh token provided" });
              return;
            }

            jwt.verify(
              refreshToken,
              process.env.REFRESH_TOKEN_KEY as string,
              (refreshErr: any, refreshDecoded: any) => {
                if (refreshErr) {
                  res
                    .status(403)
                    .json({ message: "Forbidden: Invalid refresh token" });
                  return;
                }

                const newAccessToken = jwt.sign(
                  { id: refreshDecoded.id, role: refreshDecoded.role },
                  process.env.ACCESS_TOKEN_KEY as string,
                  { expiresIn: "15m" }
                );

                res.cookie(
                  role === "admin" ? "adminAccessToken" : "userAccessToken",
                  newAccessToken,
                  {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 15 * 60 * 1000,
                  }
                );

                req.user = refreshDecoded;
                next();
              }
            );
          } else {
            req.user = decoded;
            next();
          }
        }
      );
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
  };
};
