import mongoose, { Document, Schema } from 'mongoose';


interface IAdmin extends Document {
  email: string;
  password: string;
}


const adminSchema: Schema<IAdmin> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    
  },
  { timestamps: true }
);


const adminModel = mongoose.model<IAdmin>('Admin', adminSchema);

export default adminModel;
