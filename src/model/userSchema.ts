import mongoose, { Document, Schema } from 'mongoose';


interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
}


const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true } 
);


const userModel = mongoose.model<IUser>('User', UserSchema);

export default userModel;
