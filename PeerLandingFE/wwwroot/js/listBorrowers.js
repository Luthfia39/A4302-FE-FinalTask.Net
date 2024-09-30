async function fetchBorrowers() {
    const token = localStorage.getItem('jwtToken');

    const response = await fetch(`/ApiLender/GetAllBorrowers`,
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }

        });

    if (!response.ok) {
        alert('Failed to fetch users');
        return;
    }

    const jsonData = await response.json();
    if (jsonData.success) {
        if (jsonData.data != null) {
            const repaidData = jsonData.data.filter(item => item.status == 'repaid');
            const otherData = jsonData.data.filter(item => item.status != 'repaid');

            if (otherData.length > 0) {
                showTable(otherData, 'borrowerTable');
            } else {
                document.getElementById('borrowerTable').innerHTML = '<h3 class="text-center">Data tidak ditemukan</h3>';
            }

            if (repaidData.length > 0) {
                showTable(repaidData, 'historyBorrowerTable');
            } else {
                document.getElementById('historyBorrowerTable').innerHTML = '<h3 class="text-center">Data tidak ditemukan</h3>';
            }
        } else {
            document.getElementById('borrowerTable').innerHTML = '<h3 class="text-center">Data tidak ditemukan</h3>';
        }
    } else {
        alert('No user!');
    }
}

function showTable(data, tableId) {
    const userTableBody = document.querySelector(`#${tableId} tbody`);
    //userTableBody.innerHTML = ' ';
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${item.borrowerName}</td>
        <td>${item.amount}</td>
        <td>${item.interestRate}</td>
        <td>${item.duration}</td>
        <td>${item.status}</td>
        <td>
            <button class="btn btn-primary btn-sm" ${tableId === 'borrowerTable' && (item.status !== 'Funded') ? `onclick="acceptLoan('${item.loanId}')"` : 'disabled'}>
    Approve
</button>
        </td>

        `;
        userTableBody.appendChild(row);
    })
}

function editStatus(id) {
    console.log(id)
    const confirmation = confirm("Apakah anda yakin meminjamkan uang?");

    if (!confirmation) {
        return;
    }

    const token = localStorage.getItem('jwtToken');

    const updateStatusBorrower = {
        status: 'funded'
    };

    fetch(`/ApiBorrower/UpdateStatusBorrower/${id}`,
    {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateStatusBorrower)

    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update borrrower\'s status!');
        }
        return response.json();
    })
    .then(data => {
        alert('Berhasil meminjamkan uang!');
        //$('#editUserModal').modal('hide');
        fetchBorrowers();
    })
    .catch(error => {
        alert('Error updating borrower\'s status ' + error.message);
    });
}

function acceptLoan(loanId) {
    const id = localStorage.getItem('id');

    const newFundingLoan = {
        loanId: loanId,
        lender: id
    };

    fetch(`/ApiLender/FundingLoan?loanId=${loanId}&lenderId=${id}`, {
        method: 'POST',
        headers: {
            //'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFundingLoan)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to process the loan');
            }
            return response.json();
        })
        .then(data => {
            alert('funding the loan successfully!');
            //$('#addUserModal').modal('hide');
            fetchBorrowers();
        })
        .catch(error => {
            alert('Error funding the loan user: ' + error.message);
        });
}

window.onload = function () {
    fetchBorrowers();
};