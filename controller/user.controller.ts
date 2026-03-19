
import { userModel } from "../models/user.models.ts"
import type { Request, Response } from "express"

const generateAccessAndRefreshToken = async(userId:any) => {
    try {
        console.log(userId);
        const user = await userModel.findOne({_id:userId})

        if(!user){
            throw Error("User not found")
        }

        const accessToken = user.generateAccessToken()

        const refreshToken = user.generateRefreshToken()

        return {accessToken, refreshToken}

        
    } catch (error) {
        console.log(error)
        throw Error("Error while generatig token")

    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const {userName, email, password} = req.body
        console.log(req.body)

        if(!userName ||!email || !password){
           return res.status(400).send({
            message: "All feilds are required",
            success: false,
        })
        }
        console.log(req.body)

        const existingUser = await userModel.findOne({email:email})

        if(existingUser){
           return res.status(400).send({
            message: "User already existed",
            success: false,
        }) 
        }

        const user = await userModel.create({
            userName,
            email,
            password
        })
        return res.status(200).send({
            message: "User created",
            success: true,
            user
        })
        
    } catch (error) {
       return res.status(500).send({
            message: "Error in create user API",
            success: false,
            error
        })
        console.log(error);
    }
}

export const userLogin = async (req:Request, res:Response) => {
    const {userName, email, password} = req.body
    if(!userName || !email){
        return res.status(404).send({
            message: "username and email required",
            success: false
        })
    }

    const user = await userModel.findOne({userName})
    console.log(user)

    if(!user){
        return res.status(404).send({
            message: "user not found",
            success: false
        })
    }
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        return res.status(401).send({
            message: "Wrong password",
            success: false
        })
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    res.status(200).send({
        message: "User logged in successfully",
        success: true,
        accessToken, 
        refreshToken
    })
}


export const updateUserPassword = async (req:Request, res:Response) => {
    const{email, oldPassword, newPassword} = req.body

    if(!email || !oldPassword){
        return res.status(401).send({
            message: "All fields are required",
            success: false
        })
    }

    const user = await userModel.findOne({email:email})

    if(!user){
        return res.status(404).send({
            message: "user not found",
            success: false
        })
    }
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordValid){
        return res.status(401).send({
            message: "Invalid old password",
            success: false
        })
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res.status(200).send({
        message: "password changed successfully",
        success: true
    })
}

export const getAllUsers = async(req:Request, res:Response) => {
    try {
        let users = await userModel.find({})
        if(!users || users.length == 0){
            users = []
        }
        return res.status(200).send({
            message: "Users found",
            success: true,
            users
        })
    } catch (error) {
        console.log(error)
        throw Error("Error in get all users API")
    }
}

export const deleteUserById = async(req:Request, res:Response) => {
    const {id} = req.params
    const deleteUser = await userModel.findByIdAndDelete({_id:id})
    if(!deleteUser){
        throw Error("User not found by Id")
    }
    return res.status(200).send({
        message: "User deleted successfully",
        success: true
    })

}