const express = require('express');
const router = express.Router();

//storing images
const multer = require('multer')
const path = require('path');

//Model
const User = require('../models/Users')

// BCrypt
const bcrypt = require('bcrypt');

//Storing images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('here is the file1', req)
        cb(null, '../uploads/');//specify destination folder where files will be saved
    },
    filename: function (req, file, cb) {
        console.log('here is the file2', req)
        cb(null, file.originalname);//use the original file name for saving
    }
});
const upload = multer({ storage: storage })

router.post('/upload', upload.single('file'), (req, res) => {
    console.log('here is the file', req)
    if (!req.file) {
        return res.status(400).json({ message: 'no file uploaded' })
    }
    const filePath = path.join(__dirname, '../uploads', req.file.filename)
    res.status(200).json({ message: 'File uploaded successfully', filePath: filePath })
})


//registration
router.post('/register', async (request, response) => {
    try {
        const hashedPassword = await bcrypt.hash(request.body.password, 10);
        const newUser = new User({
            ...request.body,
            password: hashedPassword,
            isAdmin: false
        });

        //check if user is already existing
        const checkEmail = await User.findOne({ email: request.body.email });
        if (checkEmail != null) {
            return response.send({ status: 'User already exists' })//put return so that when true, does not read next line
        }
        //adds new user if email is not yet existing
        newUser.save().then(result => {
            response.send({ status: "User has been created" });
        })

    } catch (error) {
        response.status(500).send({ status: 'server error' })
    }

});

//login
router.post('/login', async (request, response) => {
    const { email } = request.body; //needed for checking if email exists, code was given by chatgpt
    try {
        const findEmail = await User.findOne({ email });

        if (!findEmail) {
            return response.send({ status: 'Email not yet registered' });
        }

        //If email exists, compare the password and hashed password if matched
        const obtainedEmail = User.findOne({ email: request.body.email })//need this to get what was entered by user

        obtainedEmail.then(result => {
            bcrypt.compare(request.body.password, result.password, (err, match) => {

                console.log('result password', result.password)
                console.log('request.body.password', request.body.password)
                if (match) {
                    // Autheticated, valid email and password
                    response.send({
                        status: "Valid Credentials",
                        id: result._id,
                        email: result.email,
                        isAdmin: result.isAdmin,
                        firstName: result.firstName,
                        lastName: result.lastName,
                        birthDate: result.birthDate
                    });
                } else {
                    response.send({
                        status: "Invalid password"
                    })
                }
            });
        });


    } catch (error) {
        response.status(500).send({ status: 'server error' })
    }
});


module.exports = router;
