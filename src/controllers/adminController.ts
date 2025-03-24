import { Request, Response, NextFunction } from "express";
import { IAdminService } from "../Interface/admin/IService";
import HttpStatus from "../utils/statusCode";
import { AuthenticatedRequest } from "../middleware/verification";

class AdminController {
  constructor(private readonly adminService: IAdminService) {}

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Please provide all data" });
        return;
      }

      const response = await this.adminService.signInService(email, password);

      if (!response.success) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: response.message,
        });
        return;
      }

      res.cookie("adminAccessToken", response.accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("adminRefreshToken", response.refreshToken, {
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
      console.log("Error in Sigin: ", error);
      next(error);
    }
  }

  logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("adminAccessToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      res.clearCookie("adminRefreshToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  }

  async getFormData(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.adminService.getFromDataService();

      if (!response.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: response.success, message: response.message });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: response.success,
        message: response.message,
        formData: response.formData,
      });
    } catch (error) {
      console.log("Error in getFromData: ", error);
      next(error);
    }
  }
}

export default AdminController;
