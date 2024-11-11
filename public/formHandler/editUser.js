
const editUser = document.getElementById('editUser');
editUser.addEventListener('submit', (e) => {
    e.preventDefault();


    const fName = editUser.fName.value;
    const email = editUser.email.value;
    const phone = editUser.phone.value;
    const dob = editUser.dob.value;
    const age = editUser.age.value;
    const salary = editUser.salary.value;
    const department = editUser.department.value;
    const position = editUser.position.value;
    const gender = editUser.gender.value;
    const user_id = editUser.user_id.value;


    const fNameErr = document.querySelector('.fNameErr');
    const emailErr = document.querySelector('.emailErr');
    const phoneErr = document.querySelector('.phoneErr');
    const dobErr = document.querySelector('.dobErr');
    const ageErr = document.querySelector('.ageErr');
    const salaryErr = document.querySelector('.salaryErr');
    const depatErr = document.querySelector('.depatErr');
    const posiErr = document.querySelector('.posiErr');
    const genderErr = document.querySelector('.genderErr');


    fNameErr.innerHTML = '';
    emailErr.innerHTML = '';
    phoneErr.innerHTML = '';
    dobErr.innerHTML = '';
    ageErr.innerHTML = '';
    salaryErr.innerHTML = '';
    depatErr.innerHTML = '';
    posiErr.innerHTML = '';
    genderErr.innerHTML = '';


    const namePattern = /^[a-zA-Z\s]+$/;
    const emailPattern = /^[a-z0-9]([a-z0-9_\.\-])*\@(([a-z0-9])+(\-[a-z0-9]+)*\.)+([a-z0-9]{2,4})/;
    const phone_noPattern = /^[0-9,]+$/;
    const dob_Reg = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])+$/;


    if (!namePattern.test(fName)) {
        fNameErr.innerHTML = 'Invalid Name Format';
        throw Error('Terminating')
    }
    if (!emailPattern.test(email)) {
        emailErr.innerHTML = 'Enter a valid email';
        throw Error('Terminating')
    }
    if (!phone_noPattern.test(phone)) {
        phoneErr.innerHTML = 'Enter a valid Phone Number';
        throw Error('Terminating')
    }
    if (!dob_Reg.test(dob)) {
        dobErr.innerHTML = 'Enter a valid Date of Birth';
        throw Error('Terminating')
    }
    if (!phone_noPattern.test(age)) {
        ageErr.innerHTML = 'Enter a valid Phone Number';
        throw Error('Terminating')
    }
    if (!phone_noPattern.test(salary)) {
        salaryErr.innerHTML = 'Enter a valid Phone Number';
        throw Error('Terminating')
    }
    if (department == "") {
        depatErr.innerHTML = 'Select Department';
        throw Error('Terminating')
    }
    if (position == "") {
        posiErr.innerHTML = 'Select Position';
        throw Error('Terminating')
    }
    if (!namePattern.test(gender)) {
        genderErr.innerHTML = 'Select Gender';
        throw Error('Terminating')
    }



    const formData = { fName, email, phone, dob, age, salary, department, position, gender, user_id };

    fetch('/admin/edit-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                $(document).ready(() => {
                    $('.toast-body').html(data.msg);
                    $('.toast').css('background-color', 'green');
                    $('.toast').toast('show');
                });

                setInterval(() => {
                    window.location.href = data.redirectURL;
                }, 4000);
            }
            if (data.error) {
                // Invoke the toast component  
                $(document).ready(() => {
                    $('.toast-body').html(data.error);
                    $('.toast').css('background-color', 'red');
                    $('.toast').css('color', 'red');
                    $('.toast').toast('show');
                })
            }
        })
        .catch(e => {
            console.log(e);
        })

})