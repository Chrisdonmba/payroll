
const Admin = require('../models/admin');
const User = require('../models/user');
const Department = require('../models/department');
const Position = require('../models/position');
const Payment = require('../models/payment');
const bcryptjs = require('bcryptjs');
const axios = require('axios');
const { default: mongoose } = require('mongoose');

module.exports = {

    dashboard: async (req, res) => {
        try {

            const registeredUserCount = await User.countDocuments();

            const registeredDepartmentCount = await Department.countDocuments();

            const registeredPositionCount = await Position.countDocuments();

            const payments = await Payment.find().populate('user'); // Assuming you're using a payment model

            const context = {
                payments: payments, // Pass the payments data
                // Add any other data needed for the view
            };


            return res.render('./adminViews/dashboard', { context, registeredUserCount, registeredDepartmentCount, registeredPositionCount })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },

    get_salaries_for_chart: async (req, res) => {
        try {
            // Fetch all users and their salaries
            const users = await User.find({}, 'fName lName salary'); // Fetch names and salary

            // Prepare data for the chart
            const salaries = users.map(user => user.salary); // Extract salaries
            const userNames = users.map(user => `${user.fName}`); // Combine first and last names

            // Send the data as a JSON response
            res.json({
                salariesForChart: salaries,
                userNamesForChart: userNames
            });
        } catch (error) {
            console.error('Error fetching salaries:', error);
            res.status(500).json({ error: 'Failed to fetch salaries.' });
        }
    },

    // Controller to fetch paid users for the Excel generation
    get_paid_users: async (req, res) => {
        try {
            const payments = await Payment.find()
                .populate({
                    path: 'user',
                    populate: { path: 'department position', select: 'name' } // Fetching department and position
                });

            // Prepare the paid users data for the frontend
            const paidUsers = payments.map(payment => ({
                fName: payment.user.fName,
                department: payment.user.department ? payment.user.department.name : 'N/A',
                position: payment.user.position ? payment.user.position.name : 'N/A',
                amount: payment.amount,
                date: payment.date
            }));

            // Return the data as JSON
            res.json({ paidUsers });
        } catch (error) {
            console.error('Error fetching paid users:', error);
            res.status(500).json({ error: 'Failed to fetch paid users.' });
        }
    },

    get_department: async (req, res) => {

        const context = {}
        try {
            const allDepartment = await Department.find();
            context['departments'] = allDepartment

            return res.render('./adminViews/department', { context })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }

    },

    registerDepartment: async (req, res) => {
        const { name } = req.body;
        console.log(req.body);

        const _admin = req.admin

        try {
            const namePattern = /^[a-zA-Z\s]+$/;

            if (!namePattern.test(name)) {
                throw Error('Invalid name!');
            }

            // Create Department
            const departmentCreated = await Department.create({
                admin: _admin,
                name
            })

            return res.status(200).json({
                success: true,
                msg: 'Department Added Successfully',
                redirectURL: '/admin/department'
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    },

    get_editdepartment: async (req, res) => {

        const context = {}
        try {

            const _departmentById = await Department.findOne({ _id: req.query.department_id });
            context['department'] = _departmentById

            return res.render('./adminViews/editdepartment', { context })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }

    },

    editDepartment: async (req, res) => {
        const { name, department_id } = req.body;

        try {
            const namePattern = /^[a-zA-Z\s]+$/;

            if (!namePattern.test(name)) {
                throw Error('Invalid name!');
            }

            // Create Department
            const Updatedepartment = await Department.findOneAndUpdate({ _id: department_id }, {
                name,
                department_id
            })

            return res.status(200).json({
                success: true,
                msg: 'Department Updated Successfully',
                redirectURL: '/admin/department'
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    },

    delete_department: async (req, res) => {
        const { department_id } = req.body
        try {
            if (!department_id == mongoose.Schema.ObjectId) {
                throw Error('Invalid Data')
            }
            const _deleteDepartment = await Department.findOneAndDelete({ _id: department_id });

            return res.status(200).json(
                {
                    success: true,
                    msg: 'Department Deleted Successfully',
                    redirectURL: '/admin/department'
                })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message })
        }
    },

    get_position: async (req, res) => {

        const context = {}
        try {
            const allPosition = await Position.find();
            context['position'] = allPosition

            return res.render('./adminViews/position', { context })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }

    },

    registerPosition: async (req, res) => {
        const { name } = req.body;
        const _admin = req.admin

        try {
            const namePattern = /^[a-zA-Z\s]+$/;

            if (!namePattern.test(name)) {
                throw Error('Invalid name!');
            }

            // Create Department
            const positionCreated = await Position.create({
                admin: _admin,
                name
            })

            return res.status(200).json({
                success: true,
                msg: 'Position Added Successfully',
                redirectURL: '/admin/position'
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    },

    get_editposition: async (req, res) => {

        const context = {}
        try {

            const _positionById = await Position.findOne({ _id: req.query.position_id });
            context['position'] = _positionById

            return res.render('./adminViews/editposition', { context })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }

    },

    editPosition: async (req, res) => {
        const { name, position_id } = req.body;

        try {
            const namePattern = /^[a-zA-Z\s]+$/;

            if (!namePattern.test(name)) {
                throw Error('Invalid name!');
            }

            // Create position
            const UpdatePosition = await Position.findOneAndUpdate({ _id: position_id }, {
                name,
                position_id
            })

            return res.status(200).json({
                success: true,
                msg: 'Position Updated Successfully',
                redirectURL: '/admin/position'
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    },

    delete_position: async (req, res) => {
        const { position_id } = req.body
        try {
            if (!position_id == mongoose.Schema.ObjectId) {
                throw Error('Invalid Data')
            }
            const _deletePosition = await Position.findOneAndDelete({ _id: position_id });

            return res.status(200).json(
                {
                    success: true,
                    msg: 'Position Deleted Successfully',
                    redirectURL: '/admin/position'
                })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message })
        }
    },

    get_employee: async (req, res) => {
        const context = {}
        try {
            const _admin = await Admin.findOne();
            context['admin'] = _admin

            const allDepartment = await Department.find();
            context['departments'] = allDepartment

            const allPosition = await Position.find();
            context['positions'] = allPosition

            const allUser = await User.find();
            context['users'] = allUser


            return res.render('./adminViews/employee', { context })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },

    registerUser: async (req, res) => {

        const { fName, email, gender, phone, dob, age, salary, department, position } = req.body;


        //    ==========Data cleaning======    
        const NameReg = /^[a-zA-Z\s]+$/;
        const email_Reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneNoReg = /^[0-9,]+$/;
        const dob_Reg = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])+$/;


        try {
            if (!NameReg.test(fName)) {
                throw new Error('Enter a Vaild Name');
            }
            if (!email_Reg.test(email)) {
                throw new Error('Enter a valid Email');
            }
            if (!NameReg.test(gender)) {
                throw new Error('Enter a valid gender');
            }
            if (!phoneNoReg.test(phone)) {
                throw new Error('Enter a valid Phone number');
            }
            if (!dob_Reg.test(dob)) {
                throw new Error('Enter a valid Date of Birth');
            }
            if (!phoneNoReg.test(age)) {
                throw new Error('Enter a valid Age number');
            }
            if (!phoneNoReg.test(salary)) {
                throw new Error('Salary must not be Empty');
            }
            if (department == "") {
                throw new Error('Invalid name format');
            }
            if (position == "") {
                throw new Error('Invalid Format');
            }


            const _user = await User.create({
                fName, email, gender, phone, dob, age, salary, department: department, position: position
            });

            return res.status(200).json({
                success: true,
                msg: 'User Registered Successfully',
                redirectURL: '/admin/employee'
            });

        } catch (error) {

            return res.status(501).json({ error: error.message });
        }
    },

    get_editUser: async (req, res) => {

        const context = {}
        try {

            const _user = await User.findOne({ _id: req.query.user_id })
                .populate('department')
                .populate('position')
            context['user'] = _user

            const allDepartment = await Department.find();
            context['departments'] = allDepartment

            const allPosition = await Position.find();
            context['positions'] = allPosition

            return res.render('./adminViews/editUser', { context })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }

    },

    editUser: async (req, res) => {

        const { fName, email, gender, phone, dob, age, salary, department, position, user_id } = req.body;


        //    ==========Data cleaning======    
        const NameReg = /^[a-zA-Z\s]+$/;
        const email_Reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneNoReg = /^[0-9,]+$/;
        const dob_Reg = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])+$/;


        try {
            if (!NameReg.test(fName)) {
                throw new Error('Enter a Vaild Name');
            }
            if (!email_Reg.test(email)) {
                throw new Error('Enter a valid Email');
            }
            if (!NameReg.test(gender)) {
                throw new Error('Enter a valid gender');
            }
            if (!phoneNoReg.test(phone)) {
                throw new Error('Enter a valid Phone number');
            }
            if (!dob_Reg.test(dob)) {
                throw new Error('Enter a valid Date of Birth');
            }
            if (!phoneNoReg.test(age)) {
                throw new Error('Enter a valid Phone number');
            }
            if (!phoneNoReg.test(salary)) {
                throw new Error('Enter a valid Phone number');
            }
            if (department == "") {
                throw new Error('Invalid name format');
            }
            if (position == "") {
                throw new Error('Invalid Format');
            }


            const _user = await User.findOneAndUpdate({ _id: user_id }, {
                fName, email, gender, phone, dob, age, salary, department: department, position: position
            });

            return res.status(200).json({
                success: true,
                msg: 'User Updated Successfully',
                redirectURL: '/admin/employee'
            });

        } catch (error) {

            return res.status(501).json({ error: error.message });
        }
    },

    upLoadUser: async (req, res) => {
        try {
            const { data } = req.body;

            // Log the received data to check its structure


            // Ensure data is an array and contains user data
            if (!Array.isArray(data) || data.length < 2) {
                return res.status(400).json({ error: 'Invalid data format' });
            }

            // Extract field names
            const fieldNames = data[0];

            // Validation regular expressions
            const NameReg = /^[a-zA-Z\s]+$/;
            const email_Reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const phoneNoReg = /^[0-9]+$/;
            const dob_Reg = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])+$/;
            const address_Reg = /^[a-zA-Z0-9\s,.-/]+$/;
   
            const validateUserData = (user) => {
                if (!NameReg.test(user.fName)) throw new Error('Enter a Valid First Name');
                if (!email_Reg.test(user.email)) throw new Error('Enter a valid Email');
                if (!phoneNoReg.test(user.phone)) throw new Error('Enter a valid Phone number');
                if (!user.dob) throw new Error('Invalid Date of Birth');
                if (!user.age) throw new Error('Enter a valid Age');
                if (!user.salary) throw new Error('Enter a valid Salary Amount');
                if (!user.department) throw new Error('Invalid department format');
                if (!user.position) throw new Error('Invalid area command format');
                if (!NameReg.test(user.gender)) throw new Error('Enter a valid gender');
            };

            // Iterate over each user data array, starting from index 1
            for (let i = 1; i < data.length; i++) {
                const userValues = data[i];
                let user = {};

                // Map the user values to the field names
                fieldNames.forEach((field, index) => {
                    user[field] = userValues[index];
                });

                try {
                    validateUserData(user);



                    // Retrieve the ObjectIds for department, position
                    const _departmentName = await Department.findOne({ name: user.department });
                    const _positionName = await Position.findOne({ name: user.position });
                    console.log(_positionName);
                    


                    const newUser = new User({
                        fName: user.fName,
                        email: user.email,
                        phone: user.phone,
                        dob: user.dob,
                        age: user.age,
                        salary: user.salary,
                        department: _departmentName,
                        position: _positionName,
                        gender: user.gender,
                        admin: req.admin,
                    });

                    await newUser.save();
                    console.log('User created:', newUser);
                } catch (error) {
                    console.error('Error in user data processing:', error.message, 'Data:', user);
                    return res.status(501).json({ error: error.message });
                }
            }

            return res.status(200).json({
                success: true,
                msg: 'Users Registered Successfully',
                redirectURL: '/admin/employee'
            });
        } catch (error) {
            console.error('Error in upLoadUser function:', error.message);
            return res.status(501).json({ error: error.message });
        }
    },

    delete_user: async (req, res) => {
        const { user_id } = req.body
        try {
            if (!user_id == mongoose.Schema.ObjectId) {
                throw Error('Invalid Data')
            }
            const _deleteUser = await User.findOneAndDelete({ _id: user_id });

            return res.status(200).json(
                {
                    success: true,
                    msg: 'User Deleted Successfully',
                    redirectURL: '/admin/employee'
                })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message })
        }
    },

    get_payroll: async (req, res) => {
        const context = {}
        try {
            const users = await User.find().populate('department position');
            context['users'] = users;

            const payments = await Payment.find()
                .populate({
                    path: 'user',
                    populate: {
                        path: 'department position', // Populate both department and position
                        select: 'name', // Assuming 'name' is a field in both models
                    }
                });
            context['payments'] = payments;

            return res.render('./adminViews/payroll', { context });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    payment: async (req, res) => {
        try {
            const { refNo, paytype, users } = req.body; // Now receive `users` array containing id and salary

            if (!refNo || !paytype || !users || users.length === 0) {
                throw new Error('Missing required payment fields (refNo, paytype, or users).');
            }

            // Loop through selected users and create a payment record for each one with their respective salary
            for (const user of users) {
                const payment = new Payment({
                    user: user.id, // Associate the payment with the user
                    refNo: refNo,   // Paystack reference number
                    paytype: paytype,  // Payment type
                    amount: user.salary   // Use individual user salary
                });

                await payment.save(); // Save payment for each user
            }

            return res.status(200).json({ success: true, message: 'Payment saved for selected users.' });
        } catch (error) {
            console.error('Error saving payment for selected users:', error.message); // Log detailed error message
            return res.status(500).json({ success: false, message: `Failed to save payment for selected users: ${error.message}` });
        }
    },

    get_profile: async (req, res) => {

        const context = {}
        try {
            const _admin = await Admin.findOne();
            context['admin'] = _admin

            return res.render('./adminViews/profile', { context })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },

    edit_profile: async (req, res) => {

        const { fName, email, phone, admin_id } = req.body;

        //    ==========Data cleaning======    
        const NameReg = /^[a-zA-Z\s]+$/;
        const email_Reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneNoReg = /^[0-9]+$/;


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


            //  ========== Insert the user to the bd======
            const admin = await Admin.findOneAndUpdate({ _id: admin_id }, { fName, email, phone });
            return res.status(200).json({
                success: true,
                msg: 'Admin Created Successfully',
                redirectURL: '/admin/profile'
            });
        } catch (error) {
            return res.status(501).json({ error: error.message });
        }
    },

    change_password: async (req, res) => {
        const { old_password, newPassword } = req.body;

        try {
            const passwordPattern = /^[a-zA-Z0-9!@#$%^&*]+$/;

            if (!passwordPattern.test(newPassword)) {
                throw Error = 'Enter a valid password'
            }

            const admin = await Admin.findOne({ _id: req.admin })

            if (admin) {
                auth = await bcryptjs.compare(old_password, admin.password)
                console.log(auth);
                if (auth) {
                    const salt = await bcryptjs.genSalt();
                    console.log(salt);

                    const _newPassword = await bcryptjs.hash(newPassword, salt);

                    const chngedPassword = await Admin.findOneAndUpdate({ _id: req.admin }, { password: _newPassword })

                    return res.status(200).json({ success: true, msg: 'Password Changed Successfully', redirectURL: '/admin/profile' })
                }
                throw Error('Incorrect Password')
            } else {
                throw Error('User Not Found')
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message })
        }
    }

}