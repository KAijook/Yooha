import jwt from 'jsonwebtoken';
import User from '../models/User.js';
//middleware to protect routes
export const protectedRoute = async (req, res, next) => {
    //lay token tu header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        //verify token va lay user tu token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId).select('-hashedPassword');
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        //gan user vao req de controller co the su dung
        req.user = user;
        //next la cho phep chay den middleware tiep theo neu co, neu khong thi se chay den controller
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token or timed out' });
    }
};