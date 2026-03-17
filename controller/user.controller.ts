
import { userModel } from "../models/user.models.ts"
import type { Request, Response } from "express"

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
    const {userName, email} = req.body
    if(!userName || !email){
        return res.status(404).send({
            message: "username and email required",
            success: false
        })
    }

    const user = await userModel.findOne({userName})

    if(!user){
        return res.status(404).send({
            message: "user not found",
            success: false
        })
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password)

}