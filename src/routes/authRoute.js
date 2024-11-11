const route = require('express').Router();
const authCont = require('../controllers/authCont');



route.get('/login', authCont.get_login);
route.post('/login', authCont.login);  
route.post('/register', authCont.register);
route.get('/login', authCont.logout);    
                    
module.exports = route;