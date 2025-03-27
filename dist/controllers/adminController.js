"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = __importDefault(require("../utils/statusCode"));
class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    signIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res
                        .status(statusCode_1.default.BAD_REQUEST)
                        .json({ success: false, message: "Please provide all data" });
                    return;
                }
                const response = yield this.adminService.signInService(email, password);
                if (!response.success) {
                    res.status(statusCode_1.default.UNAUTHORIZED).json({
                        success: false,
                        message: response.message,
                    });
                    return;
                }
                res.cookie("adminAccessToken", response.accessToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 15 * 60 * 1000,
                });
                res.cookie("adminRefreshToken", response.refreshToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(statusCode_1.default.OK).json({
                    success: true,
                    message: response.message,
                    userId: response.userId,
                });
            }
            catch (error) {
                console.log("Error in Sigin: ", error);
                next(error);
            }
        });
    }
    logout(req, res, next) {
        try {
            res.clearCookie("adminAccessToken", {
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            res.clearCookie("adminRefreshToken", {
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            res
                .status(statusCode_1.default.OK)
                .json({ success: true, message: "Logged out successfully" });
        }
        catch (error) {
            next(error);
        }
    }
    getFormData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminService.getFromDataService();
                if (!response.success) {
                    res
                        .status(statusCode_1.default.BAD_REQUEST)
                        .json({ success: response.success, message: response.message });
                    return;
                }
                res.status(statusCode_1.default.OK).json({
                    success: response.success,
                    message: response.message,
                    formData: response.formData,
                });
            }
            catch (error) {
                console.log("Error in getFromData: ", error);
                next(error);
            }
        });
    }
}
exports.default = AdminController;
