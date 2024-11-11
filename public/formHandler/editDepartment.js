const editDepartment = document.getElementById('editDepartment');
editDepartment.addEventListener('submit', (e) => {
    e.preventDefault();

    // get form inputs
    const name = editDepartment.name.value;
    const department_id = editDepartment.department_id.value;

    const nameErr = document.querySelector('.nameErr');
 
    nameErr.innerHTML = '';

    const namePattern = /^[a-zA-Z\s]+$/;

    if (!namePattern.test(name)) {
        nameErr.innerHTML = 'Invalid Name Format';
        throw Error('Terminating')
    }

    const formData = { name, department_id };    

    fetch('/admin/edit-department', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
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