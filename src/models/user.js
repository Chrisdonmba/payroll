const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    admin: {
        type: mongoose.Schema.ObjectId,
        ref: 'admin'
    },
    department: {
        type: mongoose.Schema.ObjectId,
        ref: 'department'
    },
    position: {
        type: mongoose.Schema.ObjectId,
        ref: 'position'
    },
    fName: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    gender: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    salary: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
})


const User = mongoose.model('user', userSchema); 

module.exports = User;