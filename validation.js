export function validateForm(data) {
    console.log("Server side validation happens here");
    console.log(data);

    const errors = [];

    if (data['first-name'].trim() == "") {
        errors.push("First name is required.");
    }

    if (data['last-name'].trim() == "") {
        errors.push("Last name is required.");
    }

    if (data['email-address'].trim() == "") {
        errors.push("Email address is required.");
    }

    console.log(errors);
    return {
        isValid: errors.length === 0,
        errors
    }
}