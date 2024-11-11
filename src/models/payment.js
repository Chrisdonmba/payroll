const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    refNo: {     
        type: String,
    },  
    paytype: {     
        type: String,
        required: true 
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now  
    }
});

const Payment = mongoose.model('payment', paymentSchema);

module.exports = Payment;
