import { IAdminRepository } from "../Interface/admin/IRepository";
import { IData } from "../Interface/IData/iuser";
import adminModel from "../model/adminSchema";
import surveyModel from "../model/surveySchema";

class AdminRepository implements IAdminRepository {
  async getFormData(): Promise<{
    success: boolean;
    message?: string;
    formData?: IData[] | [];
  }> {
    try {
      const response = await surveyModel.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userData",
          },
        },
        {
          $unwind: "$userData",
        },
        {
          $project: {
            userName: "$userData.name",
            _id: 1,
            userId: 1,
            name: 1,
            gender: 1,
            nationality: 1,
            email: 1,
            phone: 1,
            address: 1,
            message: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ]);

      if (response.length === 0) {
        return { success: true, message: "empty", formData: [] };
      }

      return {
        success: true,
        message: "Successfull fetched",
        formData: response,
      };
    } catch (error) {
      console.log("Error in getFormData: ", error);
      throw error;
    }
  }

  async signInRepo(
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string; userId?: string }> {
    try {
      const findAdmin = await adminModel.findOne({ email });

      if (!findAdmin) {
        return { success: false, message: "User not found!!" };
      }

      const checkPassword = await adminModel.findOne({ email, password });

      if (!checkPassword) {
        return { success: false, message: "Invalid credentials!!" };
      }

      return {
        success: true,
        message: "Login Successfull",
        userId: findAdmin._id + "",
      };
    } catch (error) {
      console.log("Error in signInRepo; ", error);
      throw error;
    }
  }
}

export default AdminRepository;
