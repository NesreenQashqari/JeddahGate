document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contactForm");

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const message = document.getElementById("message");
    const mobile = document.getElementById("mobile");
    const dobInput = document.getElementById("dob");
    const languageInputs = document.querySelectorAll('input[name="language"]');

    // set max date on dob to today
    dobInput.max = new Date().toISOString().split("T")[0];

    // -----------------------------
    // EMAIL (STRONG VALIDATION)
    // -----------------------------
    function isValidEmail(value) {
        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return pattern.test(value);
    }

    // -----------------------------
    // LIVE VALIDATION
    // -----------------------------
    firstName.addEventListener("input", validateFirstName);
    lastName.addEventListener("input", validateLastName);
    email.addEventListener("input", validateEmail);
    message.addEventListener("input", validateMessage);
    mobile.addEventListener("input", validateMobile);
    dobInput.addEventListener("change", validateDob);
    document.querySelectorAll('input[name="gender"]').forEach(input => {
        input.addEventListener("change", validateGender);
    });
    languageInputs.forEach(input => {
        input.addEventListener("change", validateLanguage);
    });

    // -----------------------------
    // VALIDATION FUNCTIONS
    // -----------------------------
    function validateFirstName() {
        const value = firstName.value.trim();

        if (value === "") {
            showError("firstNameError", "First name is required");
            return false;
        }
        if (value.length < 2) {
            showError("firstNameError", "At least 2 characters");
            return false;
        }
        if (!/^[A-Za-z ]+$/.test(value)) {
            showError("firstNameError", "Letters only");
            return false;
        }

        clearError("firstNameError");
        return true;
    }

    function validateLastName() {
        const value = lastName.value.trim();

        if (value === "") {
            showError("lastNameError", "Last name is required");
            return false;
        }
        if (value.length < 2) {
            showError("lastNameError", "At least 2 characters");
            return false;
        }
        if (!/^[A-Za-z ]+$/.test(value)) {
            showError("lastNameError", "Letters only");
            return false;
        }

        clearError("lastNameError");
        return true;
    }

    function validateGender() {
        const selected = document.querySelector('input[name="gender"]:checked');

        if (!selected) {
            showError("genderError", "Please select a gender");
            return false;
        }

        clearError("genderError");
        return true;
    }

    function validateDob() {
    const value = dobInput.value;

    if (!value) {
        showError("dobError", "Date of birth is required");
        return false;
    }

    const dob = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate()) ? age - 1 : age;

    if (dob > today) {
        showError("dobError", "Date cannot be in the future");
        return false;
    }
    if (actualAge < 13) {
        showError("dobError", "You must be at least 13 years old");
        return false;
    }
    if (actualAge > 120) {
        showError("dobError", "Please enter a valid date of birth");
        return false;
    }

    clearError("dobError");
    return true;
}
    function validateEmail() {
        const value = email.value.trim();

        if (value === "") {
            showError("emailError", "Email is required");
            return false;
        }
        if (!isValidEmail(value)) {
            showError("emailError", "Enter a valid email (example: name@domain.com)");
            return false;
        }

        clearError("emailError");
        return true;
    }

    function validateMobile() {
        const value = mobile.value.trim();

        if (value === "") {
            showError("mobileError", "Mobile number is required");
            return false;
        }
        if (!/^\+?[0-9]{9,15}$/.test(value)) {
            showError("mobileError", "Enter a valid mobile number");
            return false;
        }

        clearError("mobileError");
        return true;
    }

    function validateLanguage() {
        const checked = document.querySelectorAll('input[name="language"]:checked');

        if (checked.length === 0) {
            showError("languageError", "Select at least one language");
            return false;
        }

        clearError("languageError");
        return true;
    }

    function validateMessage() {
        const value = message.value.trim();

        if (value === "") {
            showError("messageError", "Message is required");
            return false;
        }
        if (value.length < 10) {
            showError("messageError", "At least 10 characters");
            return false;
        }

        clearError("messageError");
        return true;
    }

    // -----------------------------
    // SUBMIT VALIDATION
    // -----------------------------
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const valid =
            validateFirstName() &
            validateLastName() &
            validateGender() &
            validateDob() &
            validateEmail() &
            validateMobile() &
            validateMessage() &
            validateLanguage();

        if (valid) {
    const formData = {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        gender: document.querySelector('input[name="gender"]:checked').value,
        dob: dobInput.value,
        email: email.value.trim(),
        mobile: mobile.value.trim(),
        language: Array.from(document.querySelectorAll('input[name="language"]:checked')).map(el => el.value),
        message: message.value.trim()
    };

    fetch('http://localhost:4000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
        const successMsg = document.getElementById('successMessage');
        if (data.success) {
            successMsg.style.display = 'block';
            form.reset();
            clearAllErrors();
            setTimeout(function () {
                successMsg.style.display = 'none';
            }, 4000);
        } else {
            alert(data.message);
        }
    })
    .catch(() => {
        alert('Could not connect to server. Make sure the server is running.');
    });
}
    });

    // -----------------------------
    // ERROR HANDLING
    // -----------------------------
    function showError(id, message) {
        const el = document.getElementById(id);
        el.textContent = message;
        el.style.color = "red";
    }

    function clearError(id) {
        document.getElementById(id).textContent = "";
    }

    function clearAllErrors() {
        document.querySelectorAll(".error").forEach(e => e.textContent = "");
    }



    const websiteReviewForm = document.getElementById('websiteReviewForm');
const websiteReviewText = document.getElementById('websiteReviewText');

function validateWebsiteRating() {
    const selected = document.querySelector('input[name="websiteRating"]:checked');
    if (!selected) { showError('websiteRatingError', 'Please select a star rating'); return false; }
    clearError('websiteRatingError'); return true;
}

function validateWebsiteReviewText() {
    const value = websiteReviewText.value.trim();
    if (value === '') { showError('websiteReviewTextError', 'Please write your feedback'); return false; }
    if (value.length < 10) { showError('websiteReviewTextError', 'At least 10 characters required'); return false; }
    clearError('websiteReviewTextError'); return true;
}

websiteReviewText.addEventListener('input', validateWebsiteReviewText);
document.querySelectorAll('input[name="websiteRating"]').forEach(function(input) {
    input.addEventListener('change', validateWebsiteRating);
});

websiteReviewForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const valid = validateWebsiteRating() & validateWebsiteReviewText();

    if (valid) {
        const formData = {
            placeName: 'JeddahGate',
            rating: document.querySelector('input[name="websiteRating"]:checked').value,
            reviewText: websiteReviewText.value.trim(),
            type: 'website'
        };

        fetch('http://localhost:4000/review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(data => {
            const successMsg = document.getElementById('websiteReviewSuccess');
            if (data.success) {
                successMsg.style.display = 'block';
                websiteReviewForm.reset();
                clearError('websiteRatingError');
                clearError('websiteReviewTextError');
                setTimeout(function() { successMsg.style.display = 'none'; }, 4000);
            } else {
                alert(data.message);
            }
        })
        .catch(() => { alert('Could not connect to server. Make sure the server is running.'); });
    }
});

});