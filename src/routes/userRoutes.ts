import * as express from "express";
import UserController from "../controllers/userController";
import UserReposotory from "../repositories/userRepository";
import UserService from "../services/userService";
import { verification } from "../middleware/verification";
import { role } from "../utils/constants";

const userRouter = express.Router();
    

 const repository = new UserReposotory();
 const service  = new UserService(repository);
 const controller = new UserController(service);
  

userRouter.post('/signup', controller.signup.bind(controller));
userRouter.post('/signin', controller.signIn.bind(controller));
userRouter.put('/google-signin', controller.googleSignIn.bind(controller))
userRouter.get('/verify-user/:email', controller.checkUser.bind(controller));
userRouter.put('/reset-password', controller.resetPassword.bind(controller))
userRouter.get('/logout', controller.logout.bind(controller));

userRouter.post('/submit', verification(role.user), controller.submitData.bind(controller));
userRouter.get('/submissions', verification(role.user), controller.getSubmissions.bind(controller));
   


export default userRouter




