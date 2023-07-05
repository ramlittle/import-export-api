const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path')

let imageFileName='';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './Images')//this is the folder that would contain your images
    },
    filename: (req, file, cb) => {
        console.log('here is the file', file)
        imageFileName=Date.now() + path.extname(file.originalname);
        cb(null, imageFileName)//when the file is accepted, it will show as [date]-fileoriginalname

    }
})
const upload = multer({ storage: storage })

//the actual api to upload image, the one after upoad.single is the name of the input where you will grab the file
//ex. input name ='name'
router.post('/upload', upload.single('file'), (req, res) => {
    console.log('here is the file you gave',req.body)
    console.log('here is the image file name',imageFileName)
    res.send('image uploaded');
})


module.exports = router;