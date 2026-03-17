import express from "express";
import { createUser, userLogin } from "../controller/user.controller.ts";
import authMiddleware from "../middleware/auth.middleware.ts";

const router = express.Router();

router.post("/create", createUser)

router.post("/login", authMiddleware, userLogin)


export default router;