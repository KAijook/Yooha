import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './libs/db.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import { protectedRoute } from './middlewares/authMiddleware.js';
dotenv.config();

const app = express();

const port = process.env.PORT || 5001;

//middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
//public routes
app.use('/api/auth', authRoute);


//private routes
app.use('/api/users', protectedRoute);
app.use('/api/users', userRoute);


//connect to db and start server
const maskMongoUri = (uri) => {
    if (!uri) return 'undefined';
    return uri.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:***@');
};
console.log("Mongo URI:", maskMongoUri(process.env.MONGODB_CONNECTIONSTRING));


(async () => {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})();