import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{
    try {

        const instanceConnection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("DATABASE CONNECTED SUCCESSFULLY! ",instanceConnection.connection.host);
        
    } catch (error) {

        console.log("DATABASE CONNECTION FAILED! ",error?.message);
        process.exit(1)
    }
}

export { connectDB }


