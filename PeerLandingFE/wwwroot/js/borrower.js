function getBalance() {
    const token = localStorage.getItem('jwtToken');
    const id = localStorage.getItem('id');

    fetch(`/ApiMstUser/GetUserById?id=${id}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (!response.ok) {

                throw new Error('Failed to fetch balance!');

            }
            return response.json();
            console.log(response);
        })
        .then(data => {
            if (data.success) {
                const user = data.data;
                console.log(user.balance);
                if (user.balance != null) {
                    document.getElementById('borrower-balance').innerHTML = (user.balance).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
                } else {
                    document.getElementById('borrower-balance').innerHTML = `Rp0.00`;
                }

            } else {
                alert('User not found!');
            }
        })
        .catch(error => {
            alert('Error fetching balance ' + error.message);
        })
}

async function fetchLoan() {
    //const token = localStorage.getItem('jwtToken');
    const borrowerId = localStorage.getItem('id');

    const response = await fetch(`/ApiBorrower/GetLoanByBorrowerId?borrowerId=${borrowerId}`,
        {
            method: 'GET',
            //headers: {
            //    'Authorization': 'Bearer ' + token
            //}

        });

    //console.log(response);

    if (!response.ok) {
        alert('Failed to get loans!');
        return;
    }

    const jsonData = await response.json();
    if (jsonData.success) {
        showTable(jsonData.data);
    } else {
        alert('No loan!');
    }
}

function showTable(data) {
    const tableBody = document.querySelector('#borrowerTable tbody');
    tableBody.innerHTML = '';
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${item.borrowerName}</td> 
        <td>${item.amount}</td>
        <td>${item.interestRate}</td>
        <td>12 bulan</td>
        <td>${item.status}</td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="getPayment('${item.loanId}')" ${item.status !== 'Funded' ? 'disabled' : ''}>Edit</button>
        </td>
        `;
        tableBody.appendChild(row);
    });
}


function addLoan() {
    const amount = document.getElementById('userAmount').value;
    const interestRate = document.getElementById('userInterestRate').value;

    const borrowerId = localStorage.getItem('id');

    const reqLoanDto = {
        BorrowerId: borrowerId,
        Amount: amount,
        InterestRate: interestRate,
        Duration: 12
    };

    fetch(`/ApiBorrower/AddNewLoan`, {
        method: 'POST',
        headers: {
            //'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqLoanDto)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add loan');
            }
            return response.json();
        })
        .then(data => {
            alert('add new loan successfully!');
            $('#addLoanModal').modal('hide');
            fetchLoan();
        })
        .catch(error => {
            alert('Error adding loan: ' + error.message);
        });
}

// show data cicilan
function getPayment(loanId) {
    console.log(loanId);

    fetch(`/ApiBorrower/GetPaymentById?id=${loanId}`, {
        method: 'GET',
        //headers: {
        //    'Authorization': 'Bearer ' + token
        //}
    })
        .then(response => {
            if (!response.ok) {
                console.log(response);
                throw new Error('Failed to get data!');

            }
            return response.json();
            console.log(response);
        })
        .then(data => {
            if (data.success) {
                showPaymentModal(data.data);

            } else {
                alert('data not found!');
            }
        })
        .catch(error => {
            alert('Error get data ' + error.message);
        })

        localStorage.setItem('loanId', loanId);
}

function showPaymentModal(data) {
    console.log(data.amount);

    var modal = new bootstrap.Modal(document.getElementById('paymentModal'));

    var installment = data.amount / 12;
    var formattedInstallment = installment.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });

    const tableBody = document.querySelector('#paymentTable tbody');
    tableBody.innerHTML = '';

    for (let month = 1; month <= 12; month++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${month}</td>
            <td>${formattedInstallment}</td>
            <td><input type="checkbox" class="payment-check" data-nominal="${installment}"></td>
        `;
        tableBody.appendChild(row);
    }

    modal.show();

    initializeCheckboxListeners();
}

let total = 0;
function initializeCheckboxListeners() {
    const checkboxes = document.querySelectorAll('.payment-check');
    const totalCicilanElement = document.getElementById('totalPayment');

    checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                for (let i = 0; i <= index; i++) {
                    checkboxes[i].checked = true;
                }
            } else {
                for (let i = index + 1; i < checkboxes.length; i++) {
                    checkboxes[i].checked = false;
                }
            }
            updateTotalCicilan();
        });
    });

    function updateTotalCicilan() {
        total = 0;
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                total = total + parseFloat(checkbox.getAttribute('data-nominal'));
            }
        });
        totalCicilanElement.textContent = total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    }
}

document.addEventListener('DOMContentLoaded', initializeCheckboxListeners);

// input cicilan
function pay() {
    const loanId = localStorage.getItem('loanId');
    console.log('yang akan dibayar :' + loanId);

    //const borrowerId = localStorage.getItem('id');

    const newPaymentProcess = {
        LoanId: loanId,
        AmountOfPayment: total
    };
    console.log('total : ' + JSON.stringify(newPaymentProcess));

    fetch(`/ApiBorrower/ProcessLoanPayment?loanId=${loanId}&amountOfPayment=${total}`, {
        method: 'POST',
        headers: {
            //'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPaymentProcess)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to pay loan');
            }
            return response.json();
        })
        .then(data => {
            alert('pay loan successfully!');
            //$('#addLoanModal').modal('hide');
            //fetchLoan();
        })
        .catch(error => {
            alert('Error paying the loan: ' + error.message);
        });
}

window.onload = function () {
    fetchLoan();
    getBalance();
};
