const mongoose = require('mongoose');

const dbConnection = async () => {
        await mongoose.connect('mongodb://127.0.0.1/payroll_sys');       
    
};

module.exports = { dbConnection };
