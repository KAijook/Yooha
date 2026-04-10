import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    avatarUrl: {
        type: String, //Link ảnh đại diện, có thể là URL hoặc đường dẫn đến file trên server
    },
    avatarId:{
        type: String, //ID của ảnh đại diện trên dịch vụ lưu trữ 
    },
    bio:{
        type: String,
    },
    phone:{
        type: String,
        sparse: true, // Cho phép giá trị trống nhưng độc nhất
    },
}   , { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
