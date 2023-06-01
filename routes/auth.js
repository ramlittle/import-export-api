const express = require('express');
const router = express.Router();

//Model
const User=require('../models/Users')

// BCrypt
const bcrypt = require('bcrypt');

//registration
router.post('/register', async ( request, response ) => {
    try{
        const hashedPassword = await bcrypt.hash( request.body.password, 10 );
        const newUser = new User({
            ...request.body,
            password: hashedPassword,
            isAdmin:false
        });
 
    //check if user is already existing
        const checkEmail=await User.findOne({email:request.body.email});
        if(checkEmail!=null){
            return response.send({status: 'user already exists '})//put return so that when true, does not read next line
        }
        //adds new user if email is not yet existing
            newUser.save().then( result => {
                response.send({ status: "User has been created" });
            })
 
    }catch(error){
        response.status(500).send({status: 'server error'})
    }
  
});

//login
router.post('/login', ( request, response ) => {
    User.findOne({ email: request.body.email }).then( result => {
        bcrypt.compare( request.body.password, result.password, ( err, match ) => {
            if( match ){
                // Autheticated, valid email and password
                response.send({
                    status: "Valid crendentials",
                    id: result._id
                });
            }else{
                response.send({
                    status: "Invalid credentials"
                })
            }    
        });
    });
});


module.exports = router;
