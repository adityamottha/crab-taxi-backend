import env from "dotenv";
env.config({
    path:"./.env"
})
import { connectDB } from "./db/databaseConn.js";
import { app } from "./app.js";
const PORT = process.env.PORT || 8000

connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log("BACKEND RUNNING ON PORT ",PORT);
    })
})
.catch((error)=>{
    console.log("MONGO_DB CONNECTION ERROR:- ",error?.message);
});
