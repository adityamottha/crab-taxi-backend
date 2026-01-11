import multer from "multer";

const storage =  multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,"public/temp");
    },

    filename:function(req,file,callback){
        const uniqueFileName = Date.now() + "_" +
         Math.floor(Math.random()*100) +
          "_" + file.originalname;
        callback(null,uniqueFileName);
    }
})

export const upload = multer({storage});