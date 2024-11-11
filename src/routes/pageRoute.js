
const route = require('express').Router();
const pageCont = require('../controllers/pageCont')


route.get('/', pageCont.get_home),


module.exports = route;
