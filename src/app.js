import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();
 
// set the cors (frontend url allow)
app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,
        credentials:true
    }
));

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({limit:"16kb",extended:true}));
app.use(express.static("public/temp"));
app.use(cookieParser());

//AUTH
import auth from "./modules/auth/authUsers.routes.js";
app.use("/api/v1/users",auth);

// ADMIN ROUTE
import admin from "./modules/admin/admin.routes.js";
app.use("/api/v1/admin",admin)

// RIDER ROUTE 
import rider from "./modules/rider/rider.route.js";
app.use("/api/v1/rider",rider);

//DRIVER ROUTE
import driver from "./modules/driver/driver.route.js";
app.use("/api/v1/driver",driver);

// CHAT
import chatRoutes from "./modules/chatRoom/chat.routes.js";
app.use("/api/v1/chat", chatRoutes);

// ERROR MIDDLEWARE
import errorMiddleware from "./middlewares/error.middleware.js";
app.use(errorMiddleware);

export { app }