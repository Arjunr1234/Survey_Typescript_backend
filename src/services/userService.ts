import { IFormData, ISignInData, IUserData } from "../Interface/IData/iuser";
import { IUserRepository } from "../Interface/user/IRepository";
import IUserService from "../Interface/user/IService";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { response } from "express";

dotenv.config();

class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async signupService(
    userData: IUserData
  ): Promise<{ success: boolean; message?: string; createUser?: any }> {
    try {
      const hashedPassword = await bcryptjs.hash(userData.password, 10);

      const data = {
        ...userData,
        password: hashedPassword,
      };

      const response = await this.userRepository.signupRepo(data);

      return response;
    } catch (error) {
      console.log("Error in signupService: ", error);
      throw error;
    }
  }

  async signInService(userData: ISignInData): Promise<{
    success: boolean;
    message?: string;
    accessToken?: string;
    refreshToken?: string;
    userId?: string;
  }> {
    try {
      const response = await this.userRepository.signInRepo(userData);

      if (!response.success) {
        return { success: false, message: response.message };
      }

      const payload = { id: response.userId, role: "user" };

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
      console.log("Error in signInService: ", error);
      throw error;
    }
  }

  async submitDataService(
    userId: string,
    formData: IFormData
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await this.userRepository.submitFormRepo(
        userId,
        formData
      );

      return response;
    } catch (error) {
      console.log("Error in submitDataService: ", error);
      throw error;
    }
  }

  async getSubmittedDataService(
    userId: string
  ): Promise<{ success: boolean; message?: string; formData?: any }> {
    try {
      const response = await this.userRepository.getSubmittedDatasRepo(userId);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async checkUserService(
    email: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await this.userRepository.checkUserRepo(email);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async resetPasswordService(
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await this.userRepository.resetPasswordRepo(
        email,
        password
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async googleSignInService(
    email: string,
    name: string
  ): Promise<{
    success: boolean;
    message?: string;
    accessToken?: string;
    refreshToken?: string;
    userId?: string;
  }> {
    try {
      const response = await this.userRepository.googleSignInRepo(email, name);

      if (!response.success) {
        return { success: false, message: response.message };
      }

      const payload = { id: response.userId, role: "user" };

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
      throw error;
    }
  }
}

export default UserService;
