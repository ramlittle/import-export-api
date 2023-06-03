const mongoose = require('mongoose');

const UserSchema=new mongoose.Schema({
    firstName: String,
    lastName: String,
    sex: String,
    birthDate: Date,
    email: String,
    password: String,
    contactNumber: String,
    address: String,
    isAdmin: Boolean,
    profilePicture: String,
})

module.exports=mongoose.model('User',UserSchema);