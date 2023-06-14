// Dependencies
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Model
const User = require('../models/Users');

//return all users
router.get('/', async (request, response)=>{
    try{
   const results = await User.find({})
   .exec();
   response.send(results);
   }catch(error){
       response.status(500).send({status:'server error'})
   }
});

//return one user by ID
router.get('/:id', async (request, response)=>{
    try{
    const userId=request.params.id;
   const results = await User.findOne({_id:userId})
   .exec();
   response.send(results);
   }catch(error){
       response.status(500).send({status:'server error'})
   }
});

//return all users by last Name
router.get('/search/:lastName', async (request, response)=>{
    try{
    const lastName=request.params.lastName;

    //regular expression for search, using i as flagger to not
    //consider case sensitivity
    const regex = new RegExp(lastName,'i')

    //Why have search, be on the backend? because backend is stronger than frontend
    const results = await User.find({lastName:regex})
    .exec();
    response.send(results);
    }catch(error){
        response.status(500).send({status:'server error'})
    }
});

// Update a user
router.put('/:id', ( request, response ) => {
    try{
        const userId = request.params.id;
        User.updateOne(
            { _id: userId },
            { $set: { ...request.body } })
        .then( result => {
            if( result.modifiedCount === 1 ){
                response.send({ status: "User Information has been updated Successfully" });
            }
        });
    }catch(error){
        response.status(500).send({status:'server error'})
    }
});

//Update a user password
router.put('/password/:id', async (request, response) => {
    try{
        const hashedPassword = await bcrypt.hash( request.body.password, 10 );
        const userId = request.params.id;
        let result = await User.updateOne(
            { _id: userId },
            { $set: { ...request.body,
                    password: hashedPassword
            }}
        );
        if (result.modifiedCount === 1) {
        response.status(200).send({ status: "Password Update is successful!" });
        } 
    }catch(error){
        response.status(500).send({status:'server error'})
    }
});



// Delete a user
router.delete('/:id', ( request, response ) => {
    try{
        User.deleteOne({ _id: request.params.id })
        .then( result => {
            if( result.deletedCount === 1 ){
                response.send({
                    status: "User has been deleted"
                });
            }
        });
    }catch(error){
        response.status(500).send({status:'server error'})
    }
});

//Delete Multiple Users
//ref:https://stackoverflow.com/questions/17826082/how-to-delete-multiple-ids-in-mongodb
//ref2: https://stackoverflow.com/questions/55065598/how-to-delete-multiple-data-with-with-the-req-params-ids-multiple-ids
//ref3: https://www.youtube.com/watch?v=HuprZMswvjw
router.post('/delete/many/',(request,response) => {
    try{
        const idsToDelete = request.body //obtain the data from the api call reactjs
        console.log('userIDs',idsToDelete)
        User.deleteMany({_id:{$in:idsToDelete}})
        .then(result=>{
            if(result.deletedCount===idsToDelete.length){
                response.status(200).send({
                    status:'Users have been deleted'
                })
            }
        })
    }catch(error){
        response.status(500).send({status:'unable to delete server error'})
    }
});


module.exports = router;


