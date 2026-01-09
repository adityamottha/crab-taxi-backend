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
import auth from "./routes/authRoute/auth.routes.js";
app.use("/api/v1/users",auth);

// ADMIN ROUTE
import admin from "./routes/adminRoute/admin.routes.js";
app.use("/api/v1/admin",admin)

// RIDER ROUTE 
import { riderProfile } from "./controllers/riderController/riderProfile.controller.js";
app.use("/api/v1/rider",riderProfile)

// ERROR MIDDLEWARE
import errorMiddleware from "./middlewares/error.middleware.js";
app.use(errorMiddleware);

export { app }