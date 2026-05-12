
// setup 
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

    // EMAIL PATTREN VALIDATION
    function isValidEmail(value) {
        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return pattern.test(value);
    }

    
    // LIVE VALIDATION

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

    
    // VALIDATION FUNCTIONS
   
    //validate the first name 
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


    //validate the first name 
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
    // validate gender 
    function validateGender() {
        const selected = document.querySelector('input[name="gender"]:checked');

        if (!selected) {
            showError("genderError", "Please select a gender");
            return false;
        }

        clearError("genderError");
        return true;
    }
    
    //validate the DOB
    function validateDob() {
    const value = dobInput.value;

    // if the user did not choose dob

    if (!value) {
        showError("dobError", "Date of birth is required");
        return false;
    }
    
    // we created a condtion that the user must be older than 13
    // if the user was yonger than 13
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


    // validate  email
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
    

    //this is the new validate 
    // again like the backend this checks the input if it start whith 05 or +966 and the inforce sperate condition depending on the case 

    function validateMobile() {
    const value = mobile.value.trim();

    if (value === "") {
        showError("mobileError", "Mobile number is required");
        return false;
    }

    if (value.startsWith("05")) {
        if (!/^05[0-9]{8}$/.test(value)) {
            showError("mobileError", "Mobile number must be exactly 10 digits");
            return false;
        }
    } else if (value.startsWith("+966")) {
        if (!/^\+966[0-9]{9}$/.test(value)) {
            showError("mobileError", "Mobile number must be exactly 13 characters");
            return false;
        }
    } else {
        showError("mobileError", "Mobile must start with 05 or +966");
        return false;
    }

    clearError("mobileError");
    return true;
}




    // validate language 
    function validateLanguage() {
        const checked = document.querySelectorAll('input[name="language"]:checked');

        if (checked.length === 0) {
            showError("languageError", "Select at least one language");
            return false;
        }

        clearError("languageError");
        return true;
    }


    // this validate the text in the message in form:
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

   
    // SUBMIT VALIDATION
    
    form.addEventListener("submit", function (e) {
        e.preventDefault(); // stop the page from refreshing 
        

        // to check if every thing is valid 
        const valid =
            validateFirstName() &
            validateLastName() &
            validateGender() &
            validateDob() &
            validateEmail() &
            validateMobile() &
            validateMessage() &
            validateLanguage();
        

        // if its valid it will collect the data 
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


    // send the data  to the server 
    fetch('http://localhost:4000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
        const successMsg = document.getElementById('successMessage'); // sucesse
        if (data.success) {
            successMsg.style.display = 'block';
            form.reset();
            clearAllErrors();
            setTimeout(function () {
                successMsg.style.display = 'none';
            }, 4000);
        } else {
            showError('serverError', '⚠️ Server error: ' + data.message); //error

        }
    })
    .catch(() => {
        alert('Could not connect to server. Make sure the server is running.'); // error in connection
    });
}
    });



    
    // ERROR HANDLING
    //find the small elment (in html) and put the error text inside it 
    // add the error in the right place 
    function showError(id, message) {
        const el = document.getElementById(id);
        el.textContent = message;
        
    }
    
    // if user fixed it , remove the error 
    function clearError(id) {
        document.getElementById(id).textContent = "";
    }

    function clearAllErrors() {
        document.querySelectorAll(".error").forEach(e => e.textContent = "");
    }


// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------

// the review part 

// grap elements
const websiteReviewForm = document.getElementById('websiteReviewForm');
const websiteReviewText = document.getElementById('websiteReviewText');


//validation for the ratings 
function validateWebsiteRating() {
    const selected = document.querySelector('input[name="websiteRating"]:checked');
    if (!selected) { showError('websiteRatingError', 'Please select a star rating');
         return false; 
        }
    clearError('websiteRatingError');
     return true;
}
// this for the 'review our website'
// check if its empty 
function validateWebsiteReviewText() {
    const value = websiteReviewText.value.trim();
    if (value === '') { showError('websiteReviewTextError', 'Please write your feedback'); return false; }
    if (value.length < 10) { showError('websiteReviewTextError', 'At least 10 characters required'); return false; }
    clearError('websiteReviewTextError'); return true;
}

// add event listener for the text area and the rating
websiteReviewText.addEventListener('input', validateWebsiteReviewText);
document.querySelectorAll('input[name="websiteRating"]').forEach(function(input) {
    input.addEventListener('change', validateWebsiteRating);
});


websiteReviewForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const valid = validateWebsiteRating() & validateWebsiteReviewText(); // both validation run at the same time 

    if (valid) {
        const formData = {
            placeName: 'JeddahGate',
            rating: document.querySelector('input[name="websiteRating"]:checked').value,
            reviewText: websiteReviewText.value.trim(),
            type: 'website'
        };
        
        // sending our data to the server 
        fetch('http://localhost:4000/review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(res => res.json()) //conerting from raw responce to readable js data

        //work whit the converted data
        .then(data => {
            const successMsg = document.getElementById('websiteReviewSuccess');
            if (data.success) {
                successMsg.style.display = 'block'; //show sucess message 
                websiteReviewForm.reset(); // clear all form fields 
                clearError('websiteRatingError');
                clearError('websiteReviewTextError');
                setTimeout(function() { successMsg.style.display = 'none'; }, 4000); // hide message after 4 sec
            } else {
                alert(data.message); // if serever rejected the data show the server error message 
            }
        })
        .catch(() => { alert('Could not connect to server. Make sure the server is running.'); }); // connection prplems 
    }
});

});