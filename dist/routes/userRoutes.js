"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const userService_1 = __importDefault(require("../services/userService"));
const verification_1 = require("../middleware/verification");
const constants_1 = require("../utils/constants");
const userRouter = express.Router();
const repository = new userRepository_1.default();
const service = new userService_1.default(repository);
const controller = new userController_1.default(service);
userRouter.post('/signup', controller.signup.bind(controller));
userRouter.post('/signin', controller.signIn.bind(controller));
userRouter.put('/google-signin', controller.googleSignIn.bind(controller));
userRouter.get('/verify-user/:email', controller.checkUser.bind(controller));
userRouter.put('/reset-password', controller.resetPassword.bind(controller));
userRouter.get('/logout', controller.logout.bind(controller));
userRouter.post('/submit', (0, verification_1.verification)(constants_1.role.user), controller.submitData.bind(controller));
userRouter.get('/submissions', (0, verification_1.verification)(constants_1.role.user), controller.getSubmissions.bind(controller));
exports.default = userRouter;
