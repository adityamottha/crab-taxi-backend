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

export { app }