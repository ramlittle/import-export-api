const mongoose = require('mongoose');

const UserSchema=new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    contactNumber: String,
    sex: String,
    address: String,
    address: String,
    profilePicture: String,
    birthDate: Date,
})

module.exports=mongoose.model('User',UserSchema);