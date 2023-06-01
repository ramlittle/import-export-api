const express = require('express');
const router = express.Router();


// Model
const User = require('../models/Users');


router.get('/:id', ( request, response ) => {
    User.findOne(
        { _id: request.params.id },
        {
            password: 0
        })
    .populate({ path: 'posts' })
    .exec( (err, result) => {
        console.log( result );
        if( typeof result === 'object' ){
            response.send( result );
        }
    });
});


// Update a post
router.put('/:id', ( request, response ) => {
    const userId = request.params.id;
    User.updateOne(
        { _id: userId },
        { $set: { ...request.body } })
    .then( result => {
        if( result.modifiedCount === 1 ){
            response.send({ status: "User has been updated" });
        }
    });
});


// Delete a post
router.delete('/:id', ( request, response ) => {
    User.deleteOne({ _id: request.params.id })
    .then( result => {
        if( result.deletedCount === 1 ){
            response.send({
                status: "User has been deleted"
            });
        }
    });
});




module.exports = router;


