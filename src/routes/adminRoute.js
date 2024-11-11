const route = require('express').Router();
const adminCont = require('../controllers/adminCont');
const {auth} = require('../middlewares/authMiddlewares'); 

        
route.get('/dashboard', auth, adminCont.dashboard);
route.get('/get-salaries',  auth, adminCont.get_salaries_for_chart);
route.get('/get-paid-users', auth, adminCont.get_paid_users);
route.get('/department', auth, adminCont.get_department);
route.post('/register-department', auth, adminCont.registerDepartment);
route.get('/edit-department', auth, adminCont.get_editdepartment);  
route.post('/edit-department', auth, adminCont.editDepartment);
route.post('/delete-department', auth, adminCont.delete_department);
route.get('/position', auth, adminCont.get_position);
route.post('/register-position', auth, adminCont.registerPosition);
route.get('/edit-position', auth, adminCont.get_editposition);  
route.post('/edit-position', auth, adminCont.editPosition);
route.post('/delete-position', auth, adminCont.delete_position);
route.get('/employee', auth, adminCont.get_employee); 
route.post('/register-user', auth, adminCont.registerUser);
route.get('/edit-user', auth, adminCont.get_editUser);
route.post('/edit-user', auth, adminCont.editUser);  
route.post('/upload-multiple', auth, adminCont.upLoadUser);
route.post('/delete-user', auth, adminCont.delete_user);  
route.get('/payroll', auth, adminCont.get_payroll);   
route.post('/save-payment', auth, adminCont.payment); 
route.get('/profile', auth, adminCont.get_profile);
route.post('/edit-profile', auth, adminCont.edit_profile);
route.post('/change-password', auth, adminCont.change_password);

 
module.exports = route;  
  
