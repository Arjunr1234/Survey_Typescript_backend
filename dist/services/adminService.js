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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AdminService {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    getFromDataService() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepository.getFormData();
                return response;
            }
            catch (error) {
                console.log("Error in getFormDataService; ", error);
                throw error;
            }
        });
    }
    signInService(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepository.signInRepo(email, password);
                if (!response.success) {
                    return { success: response.success, message: response.message };
                }
                const payload = { id: response.userId, role: "admin" };
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
                console.log("Error in signInService; ", error);
                throw error;
            }
        });
    }
}
exports.default = AdminService;
