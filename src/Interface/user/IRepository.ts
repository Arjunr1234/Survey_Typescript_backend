import { IData, IFormData, ISignInData, IUserData } from "../IData/iuser";

  
  export interface IUserRepository {
    signupRepo(userData: IUserData): Promise<{ success: boolean; message?: string, createUser?:any }>;
    signInRepo(signInData:ISignInData):Promise<{success:boolean, message?:string, userId?:string}>
    submitFormRepo(userId:string, formData:IFormData):Promise<{success:boolean, message?:string}>
    getSubmittedDatasRepo(userId:string):Promise<{success:boolean, message?:string, formData?:IData[] | []}>
    checkUserRepo(email:string):Promise<{success:boolean, message?:string}>
    resetPasswordRepo(email:string, password:string):Promise<{success:boolean, message?:string}>
    googleSignInRepo(email:string, name:string):Promise<{success:boolean, message?:string, userId?:string}>
  }
  