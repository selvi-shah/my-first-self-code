import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface IUser extends Document {
    userName: string
    email: string
    password: string
    isPasswordCorrect(password: string): Promise<boolean>
    generateAccessToken(): string
    generateRefreshToken(): string
}

const userSchema = new mongoose.Schema<IUser>({
    userName:{
        type:String,
        required: [true, "Name is required"]
    },
    email:{
        type:String,
        unique: true,
        required: [true, "Email is required"]
    },
    password:{
        type:String,
        required: [true, "password is required"]
    }
}, {timestamps: true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function (password:any){
    return await bcrypt.compare(password, this.password)
    
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        userName: this.userName,
        email: this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}

export const userModel = mongoose.model("User", userSchema)