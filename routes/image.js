const express=require('express');
const router = express.Router();
const multer =require('multer');
const path = require('path')
const Image = require('../models/Image');

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'../Images')//this is the folder that would contain your images
    },
    filename: (req,file,cb)=>{
        console.log('here is the file',file)
        cb(null, Date.now()+ path.extname(file.originalname))//when the file is accepted, it will show as [date]-fileoriginalname
    }
})
const upload=multer({storage: storage})

//the actual api to upload image, the one after upoad.single is the name of the input where you will grab the file
//ex. input name ='name'
router.post('/upload',upload.single('image'),(req,res)=>{
    console.log('here is the file you gave',req.image)
    res.send('image uploaded');
})


module.exports = router;