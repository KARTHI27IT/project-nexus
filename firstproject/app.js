const form = document.querySelector('form');
    const Uname = document.getElementById('Uname');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const dob = document.getElementById('dob');
    const gender = document.getElementById('gender');
    const con = document.getElementById('confirm');

    form.addEventListener('submit', e => {
        e.preventDefault();
        checkInput();
    });

    function checkInput() {
        const nameval = Uname.value.trim();
        const emailval = email.value.trim();
        const passwordval = password.value.trim();
        const dobval = dob.value.trim();
        const genderval = gender.value.trim();
        const confirmval = con.value.trim();

        if (nameval === "") {
            setError(Uname, 'Username cannot be blank');
        } else {
            setSuccess(Uname);
        }

        if (emailval === "") {
            setError(email, 'Email cannot be blank');
        } else if (!isValidEmail(emailval)) {
            setError(email, 'Not a valid email');
        } else {
            setSuccess(email);
        }

        if (passwordval === "") {
            setError(password, 'Password cannot be blank');
        } else {
            setSuccess(password);
        }
        if (dobval === "") {
            setError(dob, 'DOB cannot be blank');
        } else {
            setSuccess(dob);
        }
        if (confirmval === "") {
            setError(con, 'Password cannot be blank');
        }else if(passwordval != confirmval){
            setError(con,"Enter correct password");
        }else{
            setSuccess(con);
        }
        if (genderval === "--") {
            setError(gender, 'Choose gender');
        } else {
            setSuccess(gender);
        }
        
    }

    function setError(input, message) {
        const formControl = input.parentElement;
        const small = formControl.querySelector('small');
        formControl.className = 'form-control error';
        small.innerText = message;
    }

    function setSuccess(input) {
        const formControl = input.parentElement;
        const small = formControl.querySelector('small');
        formControl.className = 'form-control success';
    }

    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
        return re.test(String(email).toLowerCase());
    }