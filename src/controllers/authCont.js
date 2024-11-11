const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');


module.exports = {

     get_login: (req, res) => {
          res.render('./login')
     },

     register: async (req, res) => {

          const { fName, email, phone, password } = req.body;

          //    ==========Data cleaning======    
          const NameReg = /^[a-zA-Z\s]+$/;
          const email_Reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          const phoneNoReg = /^[0-9]+$/;
          const pwdReg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/;


          try {
               if (!NameReg.test(fName)) {
                    throw new Error('Enter a Vaild Organization Name');
               }
               if (!email_Reg.test(email)) {
                    throw new Error('Enter a valid Organization Email');
               }
               if (!phoneNoReg.test(phone)) {
                    throw new Error('Enter a valid Organization Phone number');
               }
               if (!pwdReg.test(password)) {
                    throw new Error('Password must contain uppercase, lowercasre and digit');
               }



               //  ========== Insert the user to the bd======
               const admin = await Admin.create({ fName, email, phone, password });
               console.log(admin);
               return res.status(200).json({
                    success: true,
                    msg: 'Admin Created Successfully',
                    redirectURL: '/auth/login'
               });
          } catch (error) {
               return res.status(501).json({ error: error.message });
          }
     },

     login: async (req, res) => {
          const { email, password } = req.body;

          // ==========Data cleaning======
          const email_Reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          const pwdReg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/;

          try {
               if (!email_Reg.test(email)) {
                    throw new Error('Enter a valid Organization Reg Number');
               }
               if (!pwdReg.test(password)) {
                    throw new Error('Password must contain uppercase, lowercasre and digit');
               }

               // ======Call login methodes========
               const _admin = await Admin.login(email, password);

               const token = jwt.sign({ id: _admin._id },
                    process.env.SECRET_KEY,
               )
          
              
               res.cookie('jwt', token, { maxAge: 1000 * 60 * 60 });

               return res.status(200).json({
                    success: true,
                    msg: 'Login Successfully',
                    redirectURL: '/admin/dashboard',  
               });

          } catch (error) {
               console.log(error);
               return res.status(501).json({ error: error.message });
          }
     },


     logout: async (req, res) => {
          res.cookie('jwt', '', { maxAge: 4 })
          return res.redirect('/login');
     }
}         