import {
  IData,
  IFormData,
  ISignInData,
  IUserData,
} from "../Interface/IData/iuser";
import { IUserRepository } from "../Interface/user/IRepository";
import surveyModel from "../model/surveySchema";
import userModel from "../model/userSchema";
import bcryptjs from "bcryptjs";

class UserReposotory implements IUserRepository {
  async signupRepo(
    userData: IUserData
  ): Promise<{ success: boolean; message?: string; createUser?: any }> {
    try {
      const existingUser = await userModel.findOne({ email: userData.email });

      if (existingUser) {
        return { success: false, message: "Email already exists" };
      }

      const existPhone = await userModel.findOne({ phone: userData.phone });

      if (existPhone) {
        return { success: false, message: "Phone number already exists" };
      }

      const createUser = await userModel.create(userData);

      if (!createUser) {
        return { success: false, message: "Failed to create User" };
      }

      const { password, ...mainData } = createUser.toObject();

      return { success: true, createUser: mainData };
    } catch (error) {
      console.log("Error in signupRepo: ", error);
      return { success: false, message: "Something went wrong in signupRepo" };
    }
  }

  async signInRepo(
    signInData: ISignInData
  ): Promise<{ success: boolean; message?: string; userId?: string }> {
    try {
      const { email, password } = signInData;

      const findUser = await userModel.findOne({ email });

      if (!findUser) {
        return { success: false, message: "User is not found!!" };
      }

      const passwordValid = await bcryptjs.compare(password, findUser.password);

      if (!passwordValid) {
        return { success: false, message: "Incorrect password!!" };
      }

      return {
        success: true,
        message: "Login Successfull",
        userId: findUser._id + "",
      };
    } catch (error) {
      console.log("Error in signInRepo: ", error);
      throw error;
    }
  }

  async submitFormRepo(
    userId: string,
    formData: IFormData
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const savedSurvey = await surveyModel.create({ userId, ...formData });

      if (!savedSurvey) {
        return { success: false, message: "Failed to save the formDaa" };
      }
      return { success: true, message: "Successfully Submitted!!" };
    } catch (error) {
      console.log("Error in subitFormRepo: ", error);
      throw error;
    }
  }

  async getSubmittedDatasRepo(
    userId: string
  ): Promise<{ success: boolean; message?: string; formData?: IData[] | [] }> {
    try {
      const getDatas = await surveyModel.find({ userId });

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
    } catch (error) {
      console.log("Error in getSubmittedDatasRepo: ", error);
      throw error;
    }
  }

  async checkUserRepo(
    email: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return { success: false, message: "User not found" };
      }
      return { success: true, message: "user is found" };
    } catch (error) {
      throw error;
    }
  }

  async resetPasswordRepo(
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return { success: false, message: "User not found" };
      }

      const hashedPassword = await bcryptjs.hash(password, 10);

      await userModel.updateOne({ email }, { password: hashedPassword });

      return { success: true, message: "Password reset successfully" };
    } catch (error) {
      console.error("Error resetting password:", error);
      return {
        success: false,
        message: "An error occurred while resetting password",
      };
    }
  }

  async googleSignInRepo(
    email: string,
    name: string
  ): Promise<{ success: boolean; message?: string; userId?: string }> {
    try {
      const existingUser = await userModel.findOne({ email });

      if (existingUser) {
        return {
          success: true,
          message: "User already exists",
          userId: existingUser._id + "",
        };
      }
      const hashedPassword = await bcryptjs.hash(email, 10);

      const newUser = new userModel({
        name,
        email,
        phone: "9999999999",
        password: hashedPassword,
      });
      const savedUser = await newUser.save();

      return {
        success: true,
        message: "User created successfully",
        userId: savedUser._id + "",
      };
    } catch (error) {
      console.log("Error in googleSignInRepo: ", error);
      throw error;
    }
  }
}

export default UserReposotory;
