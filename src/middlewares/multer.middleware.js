import multer from "multer";

const upload =  multer.diskStorage({
    filename:function(req,file,callback){
        callback(null,"public/temp");
    },

    destination:function(req,file,callback){
        const uniqueFileName = Date.now + "_" +
         Math.floor(Math.random()*100) +
          "_" + file.originalname;
        callback(null,uniqueFileName);
    }
})

export { upload }