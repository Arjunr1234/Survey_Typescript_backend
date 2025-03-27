"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminRepository_1 = __importDefault(require("../repositories/adminRepository"));
const adminService_1 = __importDefault(require("../services/adminService"));
const adminController_1 = __importDefault(require("../controllers/adminController"));
const adminRoute = express_1.default.Router();
const respository = new adminRepository_1.default();
const service = new adminService_1.default(respository);
const controller = new adminController_1.default(service);
//======= Route ========//
adminRoute.post('/login', controller.signIn.bind(controller));
adminRoute.get('/logout', controller.logout.bind(controller));
adminRoute.get('/form-data', controller.getFormData.bind(controller));
exports.default = adminRoute;
