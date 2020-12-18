const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const { count } = require('console');

const port = process.env.PORT || 7100;
let persist_count = 0;  //later can be stored in persistent datastore for counting
app.use(express.bodyParser());
const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

app.use(express.static(__dirname + '/public'));  // serving static frontend from here so website will be from same source 

// storage definition for our img files
app.use(express.json())
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '/uploads/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

app.get('/',(req,res)=>{
    console.log("root");
    res.json("send files");
})

app.post('/data',(req,res)=>{

    let upload = multer({ storage: storage, fileFilter: imageFilter }).single('pic');
    upload(req, res, (error)=>{
     if(!req.file){
         return res.send("empty file upload please upload the image");
     }
   });

});
const path_text = "C:\\Users\\pranay\\Desktop\\data_backend\\text_uploads"
app.post('/text', (req,res) => {
    console.log("no error ");
    const text_name = String(persist_count) +"text_file";
    persist_count+=1; 
    fs.writeFile(text_name, req.body, (error)=>{
        console.log("error occured in file creation ", error);
        
    });
    res.send("storing the text");
})






const current_path = path.parse(__dirname);
console.log(current_path);

app.listen(port,()=> {
    console.log(`app is listening on port ${port}`);
});