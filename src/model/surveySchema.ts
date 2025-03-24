import mongoose, { Schema, Document } from 'mongoose';


interface ISurvey extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  nationality: string;
  email: string;
  phone: string;
  address: string;
  message?: string;
  createdAt: Date; 
  updatedAt: Date;
}


const surveySchema = new Schema<ISurvey>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'],
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true } 
);


const surveyModel = mongoose.model<ISurvey>('Survey', surveySchema);

export default surveyModel;
