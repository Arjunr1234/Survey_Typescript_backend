export interface IUserData {
    name: string;
    email: string;
    phone: string;
    password: string;
  }

  export interface ISignInData{
     email:string,
     password:string
  }

  export interface IFormData {
    name: string;
    gender: "Male" | "Female" | "Other";
    nationality: string;
    email: string;
    phone: string;
    address: string;
    message: string;
  }
  export interface IData {
    _id: string; 
    userId: string; 
    name: string;
    gender: 'Male' | 'Female' | 'Other';
    nationality: string;
    email: string;
    phone: string;
    address: string;
    message?: string; 
    createdAt: Date | string;
    updatedAt: Date | string;
  }
  