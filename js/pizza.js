document.getElementById("pizza-form").onsubmit = () => {
    clearErrors();

    let isValid = true;
    // Validate first name
    let first_name = document.getElementById("first-name").value.trim();
    if(!first_name) {
        document.getElementById("err-first-name").style.display = "block";
        isValid = false;
    }

    // Validate last name
    let last_name = document.getElementById("last-name").value.trim();
    if(!last_name) {
        document.getElementById("err-last-name").style.display = "block";
        isValid = false;
    }

    // Validate email
    let email = document.getElementById("email-address").value.trim();
    if(!email) {
        document.getElementById("err-email").style.display = "block";
        isValid = false;
    }

    return isValid;
}

function clearErrors() {
    let errors = document.getElementsByClassName("err");
    for (let i = 0; i < errors.length; i++) {
        errors[i].style.display = "none";
    }
}