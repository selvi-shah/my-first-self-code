import express from "express";
import type{Request, Response} from "express";
import dotenv from "dotenv";
import connectDb from "./db/db.ts";
import router from "./routes/user.routes.ts";

const app = express();

dotenv.config();

app.use(express.json());

const db = await connectDb();

app.use("/api/v1/user", router)


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})

