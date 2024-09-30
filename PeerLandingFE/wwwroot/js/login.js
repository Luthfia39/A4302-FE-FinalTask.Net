async function submitLogin() {
    try {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        console.log(JSON.stringify({ email, password }));
        //console.log(password);

        const response = await fetch('/ApiLogin/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        //console.log(result.data.role);

        if (response.ok) {
            localStorage.setItem('jwtToken', result.data.token);
            localStorage.setItem('id', result.data.id);
            if (result.data.role == 'Lender') {
                window.location.href = 'Lender/Index';
            } else if (result.data.role == 'Borrower') {
                window.location.href = 'Borrower/Index';
            } else {
                window.location.href = 'Home/Index';
            }
            
        } else {
            alert(result.message || 'Login Failed. Please try again');
        }
    }
    catch (error) {
        alert('An error occured while logging in ' + error.message);
    }
}