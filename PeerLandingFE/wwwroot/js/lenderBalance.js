function getBalance() {
    const token = localStorage.getItem('jwtToken');
    const id = localStorage.getItem('id');

    fetch(`/ApiLender/GetBalance?id=${id}`, {
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
                    document.getElementById('lender-balance').innerHTML = `Rp${user.balance}`;
                } else {
                    document.getElementById('lender-balance').innerHTML = `Rp0`;
                }

            } else {
                alert('User not found!');
            }
        })
        .catch(error => {
            alert('Error fetching balance ' + error.message);
        })
}

function editBalance() {
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('jwtToken');

    fetch(`/ApiMstUser/GetUserById?id=${id}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log(response);
                throw new Error('Failed to update balance!');

            }
            return response.json();
            //console.log(response);
        })
        .then(data => {
            if (data.success) {
                const user = data.data;

                $('#editBalanceModal').modal('show');

            } else {
                alert('User not found!');
            }
        })
        .catch(error => {
            alert('Error update balance ' + error.message);
        })
}

function updateBalance() {
    const balance = document.getElementById('userBalance').value;

    const reqMstUserDto = {
        balance: parseFloat(balance)
    };
    console.log(reqMstUserDto);

    const id = localStorage.getItem('id');
    const token = localStorage.getItem('jwtToken');

    fetch(`/ApiBorrower/UpdateBalance/${id}`,
        {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqMstUserDto)

        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update balance!');
            }
            return response.json();
        })
        .then(data => {
            alert('Balance update successfully!');
            $('#editBalanceModal').modal('hide');
            getBalance();
        })
        .catch(error => {
            alert('Error updating balance ' + error.message);
        });
}

window.onload = getBalance;