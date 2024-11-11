const express = require('express');
require('dotenv').config();
const authRoute = require('./src/routes/authRoute');
const adminRoute = require('./src/routes/adminRoute');
const pageRoute = require('./src/routes/pageRoute');

const { dbConnection } = require('./src/config/dbConn');
const cookieParser = require('cookie-parser');

const path = require('path')  
   
const app = express();  

const port = process.env.AAP_PORT || 2091;

app.use(express.json());
app.use(cookieParser()); 

// ==========configuref route=================

app.use('/auth', authRoute);
app.use('/admin', adminRoute);
app.use('/', pageRoute);

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/public')));

//=================Db connection========
dbConnection()
 .then(() =>console.log('connected'))
 .catch((e)=>console.log('Error:', e));


app.listen(port, () => {
    console.log('Server started on port', port);
})