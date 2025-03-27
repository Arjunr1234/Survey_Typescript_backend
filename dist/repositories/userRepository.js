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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const surveySchema_1 = __importDefault(require("../model/surveySchema"));
const userSchema_1 = __importDefault(require("../model/userSchema"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserReposotory {
    signupRepo(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield userSchema_1.default.findOne({ email: userData.email });
                if (existingUser) {
                    return { success: false, message: "Email already exists" };
                }
                const existPhone = yield userSchema_1.default.findOne({ phone: userData.phone });
                if (existPhone) {
                    return { success: false, message: "Phone number already exists" };
                }
                const createUser = yield userSchema_1.default.create(userData);
                if (!createUser) {
                    return { success: false, message: "Failed to create User" };
                }
                const _a = createUser.toObject(), { password } = _a, mainData = __rest(_a, ["password"]);
                return { success: true, createUser: mainData };
            }
            catch (error) {
                console.log("Error in signupRepo: ", error);
                return { success: false, message: "Something went wrong in signupRepo" };
            }
        });
    }
    signInRepo(signInData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = signInData;
                const findUser = yield userSchema_1.default.findOne({ email });
                if (!findUser) {
                    return { success: false, message: "User is not found!!" };
                }
                const passwordValid = yield bcryptjs_1.default.compare(password, findUser.password);
                if (!passwordValid) {
                    return { success: false, message: "Incorrect password!!" };
                }
                return {
                    success: true,
                    message: "Login Successfull",
                    userId: findUser._id + "",
                };
            }
            catch (error) {
                console.log("Error in signInRepo: ", error);
                throw error;
            }
        });
    }
    submitFormRepo(userId, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedSurvey = yield surveySchema_1.default.create(Object.assign({ userId }, formData));
                if (!savedSurvey) {
                    return { success: false, message: "Failed to save the formDaa" };
                }
                return { success: true, message: "Successfully Submitted!!" };
            }
            catch (error) {
                console.log("Error in subitFormRepo: ", error);
                throw error;
            }
        });
    }
    getSubmittedDatasRepo(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getDatas = yield surveySchema_1.default.find({ userId });
                if (getDatas.length === 0) {
                    return {
                        success: true,
                        message: "No data found for the given userId",
                        formData: [],
                    };
                }
                const formattedData = getDatas.map((form) => ({
                    _id: form._id + "",
                    userId: form.userId.toString(),
                    name: form.name,
                    gender: form.gender,
                    nationality: form.nationality,
                    email: form.email,
                    phone: form.phone,
                    address: form.address,
                    message: form.message,
                    createdAt: form.createdAt.toISOString(),
                    updatedAt: form.updatedAt.toISOString(),
                }));
                console.log("This is the formDatas: ", formattedData);
                return {
                    success: true,
                    message: "Successfully fetched",
                    formData: formattedData,
                };
            }
            catch (error) {
                console.log("Error in getSubmittedDatasRepo: ", error);
                throw error;
            }
        });
    }
    checkUserRepo(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userSchema_1.default.findOne({ email });
                if (!user) {
                    return { success: false, message: "User not found" };
                }
                return { success: true, message: "user is found" };
            }
            catch (error) {
                throw error;
            }
        });
    }
    resetPasswordRepo(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userSchema_1.default.findOne({ email });
                if (!user) {
                    return { success: false, message: "User not found" };
                }
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                yield userSchema_1.default.updateOne({ email }, { password: hashedPassword });
                return { success: true, message: "Password reset successfully" };
            }
            catch (error) {
                console.error("Error resetting password:", error);
                return {
                    success: false,
                    message: "An error occurred while resetting password",
                };
            }
        });
    }
    googleSignInRepo(email, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield userSchema_1.default.findOne({ email });
                if (existingUser) {
                    return {
                        success: true,
                        message: "User already exists",
                        userId: existingUser._id + "",
                    };
                }
                const hashedPassword = yield bcryptjs_1.default.hash(email, 10);
                const newUser = new userSchema_1.default({
                    name,
                    email,
                    phone: "9999999999",
                    password: hashedPassword,
                });
                const savedUser = yield newUser.save();
                return {
                    success: true,
                    message: "User created successfully",
                    userId: savedUser._id + "",
                };
            }
            catch (error) {
                console.log("Error in googleSignInRepo: ", error);
                throw error;
            }
        });
    }
}
exports.default = UserReposotory;
