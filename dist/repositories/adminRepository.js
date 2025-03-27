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
const adminSchema_1 = __importDefault(require("../model/adminSchema"));
const surveySchema_1 = __importDefault(require("../model/surveySchema"));
class AdminRepository {
    getFormData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield surveySchema_1.default.aggregate([
                    {
                        $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "userData",
                        },
                    },
                    {
                        $unwind: "$userData",
                    },
                    {
                        $project: {
                            userName: "$userData.name",
                            _id: 1,
                            userId: 1,
                            name: 1,
                            gender: 1,
                            nationality: 1,
                            email: 1,
                            phone: 1,
                            address: 1,
                            message: 1,
                            createdAt: 1,
                            updatedAt: 1,
                        },
                    },
                ]);
                if (response.length === 0) {
                    return { success: true, message: "empty", formData: [] };
                }
                return {
                    success: true,
                    message: "Successfull fetched",
                    formData: response,
                };
            }
            catch (error) {
                console.log("Error in getFormData: ", error);
                throw error;
            }
        });
    }
    signInRepo(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findAdmin = yield adminSchema_1.default.findOne({ email });
                if (!findAdmin) {
                    return { success: false, message: "User not found!!" };
                }
                const checkPassword = yield adminSchema_1.default.findOne({ email, password });
                if (!checkPassword) {
                    return { success: false, message: "Invalid credentials!!" };
                }
                return {
                    success: true,
                    message: "Login Successfull",
                    userId: findAdmin._id + "",
                };
            }
            catch (error) {
                console.log("Error in signInRepo; ", error);
                throw error;
            }
        });
    }
}
exports.default = AdminRepository;
