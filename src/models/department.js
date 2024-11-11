const mongoose = require('mongoose');

const departmentSchema  = mongoose.Schema({
    admin: {
        type: mongoose.Schema.ObjectId,
        ref: 'admin'
    },
    name: {     
        type: String,
        required: true 
    }, 
    date: {
        type: Date,
        default: Date.now
    }
});

const Department  = mongoose.model('department', departmentSchema) 

module.exports = Department;
