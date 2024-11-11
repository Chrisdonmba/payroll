const mongoose = require('mongoose');

const positionSchema  = mongoose.Schema({
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

const Position  = mongoose.model('position', positionSchema) 

module.exports = Position;
