import { IAdminRepository } from "../Interface/admin/IRepository";
import { IAdminService } from "../Interface/admin/IService";
import { IData } from "../Interface/IData/iuser";
import jwt from "jsonwebtoken";

class AdminService implements IAdminService {
  constructor(private readonly adminRepository: IAdminRepository) {}

  async getFromDataService(): Promise<{
    success: boolean;
    message?: string;
    formData?: IData[] | [];
  }> {
    try {
      const response = await this.adminRepository.getFormData();
      return response;
    } catch (error) {
      console.log("Error in getFormDataService; ", error);
      throw error;
    }
  }

  async signInService(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    message?: string;
    userId?: string;
    accessToken?: string;
    refreshToken?: string;
  }> {
    try {
      const response = await this.adminRepository.signInRepo(email, password);

      if (!response.success) {
        return { success: response.success, message: response.message };
      }

      const payload = { id: response.userId, role: "admin" };

      const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_KEY as string,
        {
          expiresIn: "15m",
        }
      );

      const refreshToken = jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_KEY as string,
        {
          expiresIn: "7d",
        }
      );

      return {
        success: true,
        message: response.message,
        accessToken,
        refreshToken,
        userId: response.userId,
      };
    } catch (error) {
      console.log("Error in signInService; ", error);
      throw error;
    }
  }
}

export default AdminService;
