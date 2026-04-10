import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './libs/db.js';
import authRoute from './routes/authRoute.js';

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 5001;

//middlewares
app.use(cors());

//public routes
app.use('/api/auth', authRoute);


//private routes
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