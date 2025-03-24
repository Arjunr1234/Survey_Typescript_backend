import express from "express";
import AdminRepository from "../repositories/adminRepository";
import AdminService from "../services/adminService";
import AdminController from "../controllers/adminController";

const adminRoute = express.Router();


const respository = new AdminRepository();
const service = new AdminService(respository);
const controller = new AdminController(service);

//======= Route ========//

adminRoute.post('/login', controller.signIn.bind(controller));
adminRoute.get('/logout', controller.logout.bind(controller));

adminRoute.get('/form-data', controller.getFormData.bind(controller))


export default adminRoute