const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();


    const email = loginForm.email.value;
    const password = loginForm.password.value;

    const emailErr = document.querySelector('.emailErr');
    const pwdErr = document.querySelector('.pwdErr')

    emailErr.innerHTML = '';
    pwdErr.innerHTML = '';
 

    const emailPattern = /^[a-z0-9]([a-z0-9_\.\-])*\@(([a-z0-9])+(\-[a-z0-9]+)*\.)+([a-z0-9]{2,4})/;
    const pwdPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;


    if (!emailPattern.test(email)) {
        emailErr.innerHTML = 'Enter a valid email'   
        throw Error('Terminating')
    }
    if (!pwdPattern.test(password)) {
        pwdErr.innerHTML = 'Enter a valid password'
        throw Error('Terminating')
    }
    let data = { email, password };

    fetch('/auth/login', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
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

                    setInterval(() => {
                        window.location.href = data.redirectURL
                    }, 2000);
                });
            }
            // Check server errors
            if (data.error) {
                $(document).ready(() => {
                    $('.toast-body').html(data.error);
                    $('.toast').css('background-color', 'red');
                    $('.toast').toast('show');
                });
            }
        })
        .catch(e => {
            console.log(e)
        })
})