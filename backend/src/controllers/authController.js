import bcrypt from 'bcrypt'
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Session from '../models/Sessions.js';
import cookieParser from 'cookie-parser';

const ACCESS_TOKEN_TTL = '30m'; // Thời gian sống của access token
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // Thời gian sống của refresh token

export const signUp = async (req, res) => {
     try {
        const { username, email, password, firstName, lastName } = req.body;
        if(!username || !email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // kiem tra xem username da ton tai chua
        const dulicate = await User.findOne({ username });
        if(dulicate) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        //ma hoa password
        const hashedPassword = await bcrypt.hash(password, 10); //salt rounds = 10
        //tao user moi
        const newUser = new User({
            username,
            email,
            hashedPassword,
            displayName: `${firstName} ${lastName}`
            
        });

        await newUser.save();
return res.status(201).json({ message: 'User created successfully', user: newUser});
     } catch (error) {
        console.log(error, 'Error in signup controller');
        res.status(500).json({ message: 'Error occurred while signing up' });
     }

};

export const signIn = async (req, res) => {
    try {
        //lay input
        const { username, password } = req.body;
        if(!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        //kiem tra xem user co ton tai khong
        const user = await User.findOne({ username });
        if(!user) {
            return res.status(404).json({ message: 'User or password not found' });
        }
        //kiem tra password co dung khong
        const isMatch = await bcrypt.compare(password, user.hashedPassword);
        if(!isMatch) {
            return res.status(404).json({ message: 'User or password not found' });
        }
        //tao access token neu dang nhap thanh cong
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
        
        //tao refresh token
         const refreshToken = crypto.randomBytes(64).toString('hex');
         //tao session moi
         const session = new Session({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
         });
         await session.save();
         
    //tra refresh token ve cookie
res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none', //none khi backend va frontend khac domain, strict khi cung domain    
    maxAge: REFRESH_TOKEN_TTL
});

//tra access token ve res
return res.status(200).json({ message: `User ${user.displayName} signed in successfully`, accessToken });
    
        }catch (error) {
        console.log(error, 'Error in signin controller');
        res.status(500).json({ message: 'Error occurred while signing in' });
    }
};