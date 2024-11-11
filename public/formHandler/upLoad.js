document.getElementById('multiMultiplpleUser').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('upload-file-input');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select an Excel file.');
        return;   
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });


        if (validateExcelData(jsonData)) {
            jsonData.forEach((row, index) => {
                if (index === 0) return; // Skip the header row

                // Convert the date formats
                row[3] = formatDate(row[3]); // Assuming the dob is in the 6th column (index 5)
                // row[14] = formatDate(row[14]); // Assuming the startdate is in the 15th column (index 14)
            });

            uploadExcelData(jsonData);
        } else {
            alert('Invalid data in the Excel sheet.');
        }
    };
    reader.readAsArrayBuffer(file);
});

function validateExcelData(data) {
    const expectedHeaders = ['fName', 'email', 'phone', 'dob', 
        'age', 'salary', 'department', 'position', 'gender' ]; // Adjust according to your template
    const headers = data[0];
    return expectedHeaders.every((header, index) => headers[index] === header);
}

function formatDate(excelDate) {
    const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}

function uploadExcelData(data) {   
    fetch('/admin/upload-multiple', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
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
            $(document).ready(() => {
                $('.toast-body').html(data.error);
                $('.toast').css('background-color', 'red');
                $('.toast').css('color', 'red');
                $('.toast').toast('show');
            });
        }
    })
    .catch(e => {
        console.log(e);
    });
}
