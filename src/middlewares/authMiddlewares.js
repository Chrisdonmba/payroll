
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {

    const token = req.cookies.jwt;

    if (!token || token === undefined) {
        return res.redirect('/auth/login');    
    }         

    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (error, decodedToken) =>{
            if (error) {
                if (error.message === 'jwt expired') {
                    return res.redirect('/auth/login');
                }
                return res.redirect('/auth/login');
            }
            else{
                req.admin = decodedToken.id;
                res.locals._admin = req.admin   
                next();
            }
        });
    }
    else{
        return res.redirect('/auth/login');
    }
}
module.exports = {auth}