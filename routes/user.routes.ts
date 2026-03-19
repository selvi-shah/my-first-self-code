import express from "express";
import { createUser, deleteUserById, getAllUsers, updateUserPassword, userLogin } from "../controller/user.controller.ts";
import authMiddleware from "../middleware/auth.middleware.ts";

const router = express.Router();

router.post("/create", createUser)

router.post("/login", userLogin)

router.patch("/update-password", authMiddleware, updateUserPassword)

router.get("/all-users", authMiddleware, getAllUsers)

router.delete("/delete/:id", authMiddleware, deleteUserById)


export default router;