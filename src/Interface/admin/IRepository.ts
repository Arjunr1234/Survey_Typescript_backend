import { IData } from "../IData/iuser";


export interface IAdminRepository{
    signInRepo(email:string, password:string):Promise<{success:boolean, message?:string, userId?:string}>
    getFormData():Promise<{success:boolean, message?:string, formData?:IData[] | []}>
}