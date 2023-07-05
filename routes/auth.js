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

//registration
router.post('/register', upload.single('file'),async (request, response) => {
   
    try {
        const hashedPassword = await bcrypt.hash(request.body.password, 10);
        const newUser = new User({
            ...request.body,
            password: hashedPassword,
            isAdmin: false,
            picture: imageFileName
        });

        //check if user is already existing
        const checkEmail = await User.findOne({ email: request.body.email });
        if (checkEmail != null) {
            return response.status(401).send({ status: 'User already exists' })//put return so that when true, does not read next line
        }
        //adds new user if email is not yet existing
        newUser.save().then(result => {
            response.status(201).send({ status: "User has been created" });
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
