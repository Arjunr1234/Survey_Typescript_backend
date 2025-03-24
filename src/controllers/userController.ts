import { Response, Request, NextFunction } from "express";
import IUserService from "../Interface/user/IService";
import HttpStatus from "../utils/statusCode";
import { AuthenticatedRequest } from "../middleware/verification";

class UserController {
  constructor(private readonly userService: IUserService) {}

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, phone, password } = req.body;

      if (!name || !email || !phone || !password) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Please provide all data!!" });
        return;
      }
      const data = { name, email, phone, password };

      const response = await this.userService.signupService(data);
      console.log("This is the response: ", response);
      if (!response.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: response.success, message: response.message });
        return;
      }
      res
        .status(HttpStatus.CREATED)
        .json({ success: response.success, createUser: response.createUser });
    } catch (error) {
      console.error("Error in signup: ", error);
      next(error);
    }
  }

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Please provide all data!!!" });
        return;
      }
      const userData = { email, password };

      const response = await this.userService.signInService(userData);

      if (!response.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
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

      res.status(HttpStatus.OK).json({
        success: true,
        message: response.message,
        userId: response.userId,
      });
    } catch (error) {
      console.error("Error in signUp: ", error);
      next(error);
    }
  }

  async googleSignIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Please provide all data" });
        return;
      }

      const response = await this.userService.googleSignInService(email, name);

      if (!response.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
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

      res.status(HttpStatus.OK).json({
        success: true,
        message: response.message,
        userId: response.userId,
      });
    } catch (error) {
      console.log("Error in google signIn : ", error);
      next(error);
    }
  }

  async checkUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;
      if (!email) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Please provide email" });
        return;
      }

      const response = await this.userService.checkUserService(email);

      if (!response.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: response.success, message: response.message });
        return;
      }

      res
        .status(HttpStatus.OK)
        .json({ success: response.success, message: response.message });
      return;
    } catch (error) {
      console.log("Error in checkUser: ", error);
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Please provide nessary data" });
        return;
      }

      const response = await this.userService.resetPasswordService(
        email,
        password
      );

      if (!response.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: response.success, message: response.message });
        return;
      }

      res
        .status(HttpStatus.OK)
        .json({ success: response.success, message: response.message });
      return;
    } catch (error) {
      console.log("Error in resetPassword :  ", error);
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
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
      .status(HttpStatus.OK)
      .json({ success: true, message: "Logged out successfully" });
  }

  async submitData(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, gender, nationality, email, phone, address, message } =
        req.body;

      if (
        !name ||
        !gender ||
        !nationality ||
        !email ||
        !phone ||
        !address ||
        !message
      ) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Please provide all the data" });
        return;
      }

      if (!req.user) {
        res
          .status(HttpStatus.BAD_REQUEST)
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
      const response = await this.userService.submitDataService(userId, data);
      console.log(response);
      if (!response.success) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: response.message,
        });
        return;
      }
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: response.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSubmissions(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "user data is not avaliable" });
        return;
      }
      const response = await this.userService.getSubmittedDataService(
        req.user.id
      );

      if (!response.success) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: response.message,
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: response.success,
        message: response.success,
        formData: response.formData,
      });
    } catch (error) {
      console.log("Error in getSubmissions: ", error);
      next(error);
    }
  }
}

export default UserController;
