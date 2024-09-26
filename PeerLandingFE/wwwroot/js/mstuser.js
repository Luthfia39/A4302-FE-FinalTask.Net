async function fetchUser() {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('ApiMstUser/GetAllUsers',
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }

        });

    console.log(response);

    if (!response.ok) {
        alert('Failed to fetch users');
        return;
    }

    const jsonData = await response.json();
    if (jsonData.success) {
        populateUserTable(jsonData.data);
    } else {
        alert('No user!');
    }
}

function populateUserTable(users) {
    const userTableBody = document.querySelector('#userTable tbody');
    userTableBody.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>${user.balance}</td>
        <td>
            <button class="btn btn-primary btn-sm">Edit</button>
            <button class="btn btn-danger btn-sm">Delete</button>
        </td>
        `;
        userTableBody.appendChild(row);
    })
}

window.onload = fetchUser;