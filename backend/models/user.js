import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
     photo: {
        type: String, // This will store the Cloudinary URL
        default: ""
    },
    bio: {
        type: String,
        trim: true
    },
    verifyOtp: {
        type: String,
        default: ""
    },
    verifyOtpExpiresAt: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post" // Changed to lowercase to match model name
    }],
    resetOtp: {
        type: String,
        default: ""
    },
    resetOtpExpiresAt: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const userModel = mongoose.model('user', userSchema); // Registered as 'user' (lowercase)
export default userModel;