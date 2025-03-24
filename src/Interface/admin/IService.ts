import { IData } from "../IData/iuser";


export  interface IAdminService{
    signInService(email:string, password:string):Promise<{success:boolean, message?:string, userId?:string, accessToken?:string, refreshToken?:string}>
   getFromDataService():Promise<{success:boolean, message?:string, formData?:IData[] | []}>
}