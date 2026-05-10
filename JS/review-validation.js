document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("reviewForm");
    if (!form) return;

    const textarea = document.getElementById("reviewText");

    // -----------------------------
    // VALIDATION FUNCTIONS
    // -----------------------------
    function validateRating() {
        const selected = document.querySelector('input[name="rating"]:checked');

        if (!selected) {
            showError("ratingError", "Please select a star rating");
            return false;
        }

        clearError("ratingError");
        return true;
    }

    function validateReviewText() {
        const value = textarea.value.trim();

        if (value === "") {
            showError("reviewTextError", "Please write your feedback");
            return false;
        }
        // this one shows in the contact us review only 
        if (value.length < 10) {
            showError("reviewTextError", "At least 10 characters required");
            return false;
        }

        clearError("reviewTextError");
        return true;
    }

    // -----------------------------
    // LIVE VALIDATION
    // -----------------------------
    textarea.addEventListener("input", validateReviewText);
    document.querySelectorAll('input[name="rating"]').forEach(function (input) {
        input.addEventListener("change", validateRating);
    });

    // -----------------------------
    // SUBMIT
    // -----------------------------
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const valid =
            validateRating() &
            validateReviewText();

        if (valid) {
    const formData = {
        placeName: document.title,
        rating: document.querySelector('input[name="rating"]:checked').value,
        reviewText: textarea.value.trim(),
        type: 'place'
    };

    fetch('http://localhost:4000/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
        const successMsg = document.getElementById('reviewSuccess');
        if (data.success) {
            successMsg.style.display = 'block';
            form.reset();
            clearError('ratingError');
            clearError('reviewTextError');
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
    function showError(id, msg) {
        const el = document.getElementById(id);
        if (el) { el.textContent = msg; el.style.color = "red"; }
    }

    function clearError(id) {
        const el = document.getElementById(id);
        if (el) el.textContent = "";
    }

});