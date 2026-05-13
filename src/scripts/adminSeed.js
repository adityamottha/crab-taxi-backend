import dotenv from "dotenv"
dotenv.config();
import { ApiError } from "../utils/ApiError.js";

// console.log("MONGODB_URI: ",process.env.MONGODB_URI); 
import { connectDB } from "../db/databaseConn.js";
import { AuthUser } from "../modules/auth/authUsers.models.js";
import { AdminProfile } from "../modules/admin/models/AdminProfile.model.js";
const seedAdmin = async ()=>{
    try {

        // connect database 
        const databaseConnection = await connectDB();
        if(databaseConnection){
            console.log("Database connected successfully!");
        }

        // check if admin already existed
        const existedAdmin = await AuthUser.findOne({role:"ADMIN"});
        if(existedAdmin){
           throw new ApiError(408,"ADMIN ALREADY EXISTED")
        };

        // create admin in AuthUser
        const admin = await AuthUser.create({
            email:process.env.ADMIN_EMAIL,
            password:process.env.ADMIN_PASSWORD,
            role:"ADMIN",
            phoneNumber:process.env.ADMIN_PHONE_NUMBER,
            refreshTokenVersion:0
        });

        if(admin){
            console.log("Admin Created SuccessFully!");
        }
        
        // create admin profile in Profile
        const adminProfile= await AdminProfile.create({
            authUserId:admin._id,
            name:process.env.FULL_NAME,
        });

        if(adminProfile){
            console.log("Admin profile has been created!");
        };

    } catch (error) {
        console.log("Admin Seed Error :- ", error?.message);
        process.exit(1)
    }
};

seedAdmin();

// node --env-file=.env src/scripts/adminSeed.js (RUN THIS COMMAND FOR CREATING ADMIN)