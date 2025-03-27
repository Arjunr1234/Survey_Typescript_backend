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
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone, password } = req.body;
                if (!name || !email || !phone || !password) {
                    res
                        .status(statusCode_1.default.BAD_REQUEST)
                        .json({ success: false, message: "Please provide all data!!" });
                    return;
                }
                const data = { name, email, phone, password };
                const response = yield this.userService.signupService(data);
                console.log("This is the response: ", response);
                if (!response.success) {
                    res
                        .status(statusCode_1.default.BAD_REQUEST)
                        .json({ success: response.success, message: response.message });
                    return;
                }
                res
                    .status(statusCode_1.default.CREATED)
                    .json({ success: response.success, createUser: response.createUser });
            }
            catch (error) {
                console.error("Error in signup: ", error);
                next(error);
            }
        });
    }
    signIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res
                        .status(statusCode_1.default.BAD_REQUEST)
                        .json({ success: false, message: "Please provide all data!!!" });
                    return;
                }
                const userData = { email, password };
                const response = yield this.userService.signInService(userData);
                if (!response.success) {
                    res
                        .status(statusCode_1.default.BAD_REQUEST)
                        .json({ success: response.success, message: response.message });
                    return;
                }
                res.cookie("userAccessToken", response.accessToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 15 * 60 * 1000,
                });
                res.cookie("userRefreshToken", response.refreshToken, {
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
                console.error("Error in signUp: ", error);
                next(error);
            }
        });
    }
    googleSignIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email } = req.body;
                if (!name || !email) {
                    res
                        .status(statusCode_1.default.BAD_REQUEST)
                        .json({ success: false, message: "Please provide all data" });
                    return;
                }
                const response = yield this.userService.googleSignInService(email, name);
                if (!response.success) {
                    res
                        .status(statusCode_1.default.BAD_REQUEST)
                        .json({ success: response.success, message: response.message });
                    return;
                }
                res.cookie("userAccessToken", response.accessToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 15 * 60 * 1000,
                });
                res.cookie("userRefreshToken", response.refreshToken, {
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
                console.log("Error in google signIn : ", error);
                next(error);
            }
        });
    }
    checkUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.params;
                if (!email) {
                    res
                        .status(statusCode_1.default.BAD_REQUEST)
                        .json({ success: false, message: "Please provide email" });
                    return;
                }
                const response = yield this.userService.checkUserService(email);
                if (!response.success) {
                    res
                        .status(statusCode_1.default.BAD_REQUEST)
                        .json({ success: response.success, message: response.message });
                    return;
                }
                res
                    .status(statusCode_1.default.OK)
                    .json({ success: response.success, message: response.message });
                return;
            }
            catch (error) {
                console.log("Error in checkUser: ", error);
                next(error);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res
                        .status(statusCode_1.default.BAD_REQUEST)
                        .json({ success: false, message: "Please provide nessary data" });
                    return;
                }
                const response = yield this.userService.resetPasswordService(email, password);
                if (!response.success) {
                    res
                        .status(statusCode_1.default.BAD_REQUEST)
                        .json({ success: response.success, message: response.message });
                    return;
                }
                res
                    .status(statusCode_1.default.OK)
                    .json({ success: response.success, message: response.message });
                return;
            }
            catch (error) {
                console.log("Error in resetPassword :  ", error);
                next(error);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            res.clearCookie("userAccessToken", {
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            res.clearCookie("userRefreshToken", {
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            res
                .status(statusCode_1.default.OK)
                .json({ success: true, message: "Logged out successfully" });
        });
    }
    submitData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, gender, nationality, email, phone, address, message } = req.body;
                if (!name ||
                    !gender ||
                    !nationality ||
                    !email ||
                    !phone ||
                    !address ||
                    !message) {
                    res
                        .status(statusCode_1.default.BAD_REQUEST)
                        .json({ success: false, message: "Please provide all the data" });
                    return;
                }
                if (!req.user) {
                    res
                        .status(statusCode_1.default.BAD_REQUEST)
                        .json({ success: false, message: "user data is not avaliable" });
                    return;
                }
                const userId = req.user.id;
                const data = {
                    name,
                    gender,
                    nationality,
                    email,
                    phone,
                    address,
                    message,
                };
                console.log("This is the data: ", data);
                const response = yield this.userService.submitDataService(userId, data);
                console.log(response);
                if (!response.success) {
                    res.status(statusCode_1.default.BAD_REQUEST).json({
                        success: false,
                        message: response.message,
                    });
                    return;
                }
                res.status(statusCode_1.default.CREATED).json({
                    success: true,
                    message: response.message,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getSubmissions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res
                        .status(statusCode_1.default.BAD_REQUEST)
                        .json({ success: false, message: "user data is not avaliable" });
                    return;
                }
                const response = yield this.userService.getSubmittedDataService(req.user.id);
                if (!response.success) {
                    res.status(statusCode_1.default.BAD_REQUEST).json({
                        success: false,
                        message: response.message,
                    });
                    return;
                }
                res.status(statusCode_1.default.OK).json({
                    success: response.success,
                    message: response.success,
                    formData: response.formData,
                });
            }
            catch (error) {
                console.log("Error in getSubmissions: ", error);
                next(error);
            }
        });
    }
}
exports.default = UserController;
