"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verification = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verification = (role) => {
    return (req, res, next) => {
        try {
            const token = role === "admin"
                ? req.cookies.adminAccessToken
                : req.cookies.userAccessToken;
            const refreshToken = role === "admin"
                ? req.cookies.adminRefreshToken
                : req.cookies.userRefreshToken;
            if (!token) {
                res.status(401).json({ message: "Unauthorized: No token provided" });
                return;
            }
            jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
                if (err) {
                    if (!refreshToken) {
                        res
                            .status(401)
                            .json({ message: "Unauthorized: No refresh token provided" });
                        return;
                    }
                    jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (refreshErr, refreshDecoded) => {
                        if (refreshErr) {
                            res
                                .status(403)
                                .json({ message: "Forbidden: Invalid refresh token" });
                            return;
                        }
                        const newAccessToken = jsonwebtoken_1.default.sign({ id: refreshDecoded.id, role: refreshDecoded.role }, process.env.ACCESS_TOKEN_KEY, { expiresIn: "15m" });
                        res.cookie(role === "admin" ? "adminAccessToken" : "userAccessToken", newAccessToken, {
                            httpOnly: true,
                            sameSite: "none",
                            secure: true,
                            maxAge: 15 * 60 * 1000,
                        });
                        req.user = refreshDecoded;
                        next();
                    });
                }
                else {
                    req.user = decoded;
                    next();
                }
            });
        }
        catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
            return;
        }
    };
};
exports.verification = verification;
