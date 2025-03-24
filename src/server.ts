import express, { Application } from 'express';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import userRouter from './routes/userRoutes';
import adminRoute from './routes/adminRoutes';


const app :Application =  express();


//const originUrl: string = 'https://survey-app-frontend-red.vercel.app';
 //const originUrl: string = 'http://localhost:5173';
 const originUrl :string  = "https://survey-typescript-frontend.vercel.app"

const corsOptions: CorsOptions = {
    origin:originUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

connectDB() 

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', userRouter);
app.use('/api/admin', adminRoute)

const PORT: number = parseInt(process.env.PORT as string, 10) || 5002;
  

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
  