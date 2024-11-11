

function deletePosition(position_id) {
    
    if (position_id === '') {
        msg.innerHTML = data.error;
        msg.style.backgroundColor = 'red';   
        msg.style.padding = '10px'
        msg.style.marginBottom = '4px';
        msg.style.textAlign = 'center'
    }

    const data = { position_id }

    fetch('/admin/delete-position', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ position_id })
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
                window.location.href = '/admin/position';
            }, 2000);
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
}

