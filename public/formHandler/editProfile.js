
const editForm = document.getElementById('editForm');
editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fName = editForm.fName.value;
    const email = editForm.email.value;
    const phone = editForm.phone.value;
    const admin_id = editForm.admin_id.value

    const fNameErr = document.querySelector('.fNameErr');
    const emailErr = document.querySelector('.emailErr');
    const phoneErr = document.querySelector('.phoneErr');

    fNameErr.innerHTML = '';
    emailErr.innerHTML = '';
    phoneErr.innerHTML = '';

    const namePattern = /^[a-zA-Z\s]+$/;
    const emailPattern = /^[a-z0-9]([a-z0-9_\.\-])*\@(([a-z0-9])+(\-[a-z0-9]+)*\.)+([a-z0-9]{2,4})/;
    const phone_noPattern = /^[0-9]+$/;

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

    const data = { fName, email, phone, admin_id };

    fetch('/admin/edit-profile', {   
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)  
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