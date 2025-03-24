import { IFormData, ISignInData, IUserData } from "../IData/iuser";


export default interface IUserService{
    signupService(userData:IUserData):Promise<{success:boolean, message?:string, createUser?:any}>
    signInService(userData:ISignInData):Promise<{success:boolean, message?:string, accessToken?:string, refreshToken?:string, userId?:string}>
    submitDataService(userId:string,formData:IFormData):Promise<{success:boolean, message?:string}>
    getSubmittedDataService(userId:string):Promise<{success:boolean, message?:string, formData?:any}>
    checkUserService(email:string):Promise<{success:boolean, message?:string}>
    resetPasswordService(email:string, password:string):Promise<{success:boolean, message?:string}>
    googleSignInService(email:string, name:string):Promise<{success:boolean, message?:string, accessToken?:string, refreshToken?:string, userId?:string}>
}

