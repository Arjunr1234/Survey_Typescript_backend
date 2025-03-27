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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    signupService(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 10);
                const data = Object.assign(Object.assign({}, userData), { password: hashedPassword });
                const response = yield this.userRepository.signupRepo(data);
                return response;
            }
            catch (error) {
                console.log("Error in signupService: ", error);
                throw error;
            }
        });
    }
    signInService(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.signInRepo(userData);
                if (!response.success) {
                    return { success: false, message: response.message };
                }
                const payload = { id: response.userId, role: "user" };
                const accessToken = jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_KEY, {
                    expiresIn: "15m",
                });
                const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.REFRESH_TOKEN_KEY, {
                    expiresIn: "7d",
                });
                return {
                    success: true,
                    message: response.message,
                    accessToken,
                    refreshToken,
                    userId: response.userId,
                };
            }
            catch (error) {
                console.log("Error in signInService: ", error);
                throw error;
            }
        });
    }
    submitDataService(userId, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.submitFormRepo(userId, formData);
                return response;
            }
            catch (error) {
                console.log("Error in submitDataService: ", error);
                throw error;
            }
        });
    }
    getSubmittedDataService(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.getSubmittedDatasRepo(userId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    checkUserService(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.checkUserRepo(email);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    resetPasswordService(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.resetPasswordRepo(email, password);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    googleSignInService(email, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.googleSignInRepo(email, name);
                if (!response.success) {
                    return { success: false, message: response.message };
                }
                const payload = { id: response.userId, role: "user" };
                const accessToken = jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_KEY, {
                    expiresIn: "15m",
                });
                const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.REFRESH_TOKEN_KEY, {
                    expiresIn: "7d",
                });
                return {
                    success: true,
                    message: response.message,
                    accessToken,
                    refreshToken,
                    userId: response.userId,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = UserService;
