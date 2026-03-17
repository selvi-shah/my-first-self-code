import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const authMiddleware = async(req: Request, res:Response, next:NextFunction) =>{
    try {
        const token = req.headers["authorization"]?.split(" ")[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
            if(err){
                return res.status(401).send({
                    success: false,
                    message: "Unauthorised User"
                })
                } else {
                    req.body.id = decode.id;
                    next()
                }
            })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Error in auth middleware API",
            success: false
        })
    }
}

export default authMiddleware;