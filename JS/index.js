document.addEventListener('DOMContentLoaded', function () {
    // GETTING THE ELEMENTS
    var track = document.getElementById('carouselTrack');
    var dotsContainer = document.getElementById('carouselDots');
    // VARIABLES TO TRACK STATE
    var current = 0;
    var total = 0;

    // FETCH REVIEWS FROM BACKEND

    fetch('http://localhost:4000/reviews')
        .then(function (res) { return res.json(); })
        .then(function (data) {

            // HANDLE CASE WITH NO REVIEWS
           if (!data.success || data.reviews.length === 0) {
            var card = document.createElement('div');
            card.className = 'rev-card';
            card.style.width = '100%';
            card.style.flexShrink = '0';
            card.innerHTML = '<div class="rev-quote">No reviews yet. Be the first to leave one!</div>';
            track.appendChild(card);
            track.style.width = '100%';
            return;
        }
            // CALCULATE WIDTHS AND CREATE CARDS & DOTS
            total = data.reviews.length;
            track.style.width = (total * 100) + '%';

            // LOOP THROUGH REVIEWS TO CREATE CARDS AND DOTS
            data.reviews.forEach(function (review, i) {
                var stars = '';
                for (var s = 0; s < review.rating; s++) { stars += '&#9733;'; }     

            // CREATE REVIEW CARD
                var card = document.createElement('div');
                card.className = 'rev-card';
                card.style.width = (100 / total) + '%';
                card.style.flexShrink = '0';
                card.innerHTML = '<div class="rev-stars">' + stars + '</div><div class="rev-quote">' + review.review_text + '</div>';
                track.appendChild(card);
                
            // CREATE DOT FOR EACH REVIEW AND ADD CLICK EVENT (THE FIRST DOT IS ACTIVE BY DEFAULT)
                var dot = document.createElement('div');
                dot.className = 'dot' + (i === 0 ? ' active' : '');
                dot.dataset.index = i;
                dot.addEventListener('click', function () { goTo(parseInt(this.dataset.index)); });     // NAVIGATE TO THE CORRESPONDING CARD ON DOT CLICK
                dotsContainer.appendChild(dot);
            });

            // ADD EVENT LISTENERS FOR NAV BUTTONS
            document.getElementById('prevBtn').addEventListener('click', function () { goTo(current - 1); });
            document.getElementById('nextBtn').addEventListener('click', function () { goTo(current + 1); });
        })

        // HANDLE FETCH ERROR
        .catch(function () {
            var card = document.createElement('div');
            card.className = 'rev-card';
            card.style.width = '100%';
            card.style.flexShrink = '0';
            card.innerHTML = '<div class="rev-quote">Could not load reviews. Please try again later.</div>';
            track.appendChild(card);
            track.style.width = '100%';
});

    // FUNCTION TO NAVIGATE TO A SPECIFIC CARD
    function goTo(n) {
        current = (n + total) % total;  // CALCULATE NEW CURRENT INDEX (WRAP AROUND USING MODULO)//
        var cardWidth = track.parentElement.offsetWidth;    // GET THE WIDTH OF ONE CARD
        track.style.transform = 'translateX(-' + (current * cardWidth) + 'px)'; // SLIDE TO THE CORRECT POSITION
        dotsContainer.querySelectorAll('.dot').forEach(function (d, i) {        // UPDATE ACTIVE DOT
            d.classList.toggle('active', i === current);  // THE DOT WITH INDEX EQUAL TO CURRENT GETS THE ACTIVE CLASS
        });
    }

});