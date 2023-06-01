const express = require('express');
const router = express.Router();


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

//return one user
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

// Update a user
router.put('/:id', ( request, response ) => {
    try{
    const userId = request.params.id;
    User.updateOne(
        { _id: userId },
        { $set: { ...request.body } })
    .then( result => {
        if( result.modifiedCount === 1 ){
            response.send({ status: "User has been updated" });
        }
    });
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




module.exports = router;


