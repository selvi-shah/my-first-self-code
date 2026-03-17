import mongoose, {connect} from "mongoose";

const connectDb = async () => {
    try {
        const dbUrl = process.env.MONGODB_URL || ""
        await connect(dbUrl)
        console.log("MongoDb connected")
        
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

export default connectDb;