document.addEventListener('DOMContentLoaded', function () {

    var track = document.getElementById('carouselTrack');
    var dotsContainer = document.getElementById('carouselDots');
    var current = 0;
    var total = 0;

    fetch('http://localhost:4000/reviews')
        .then(function (res) { return res.json(); })
        .then(function (data) {
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

            total = data.reviews.length;
            track.style.width = (total * 100) + '%';

            data.reviews.forEach(function (review, i) {
                var stars = '';
                for (var s = 0; s < review.rating; s++) { stars += '&#9733;'; }

                var card = document.createElement('div');
                card.className = 'rev-card';
                card.style.width = (100 / total) + '%';
                card.style.flexShrink = '0';
                card.innerHTML = '<div class="rev-stars">' + stars + '</div><div class="rev-quote">' + review.review_text + '</div>';
                track.appendChild(card);

                var dot = document.createElement('div');
                dot.className = 'dot' + (i === 0 ? ' active' : '');
                dot.dataset.index = i;
                dot.addEventListener('click', function () { goTo(parseInt(this.dataset.index)); });
                dotsContainer.appendChild(dot);
            });

            document.getElementById('prevBtn').addEventListener('click', function () { goTo(current - 1); });
            document.getElementById('nextBtn').addEventListener('click', function () { goTo(current + 1); });
        })
        .catch(function () {
            track.innerHTML = '<div class="rev-card"><div class="rev-quote">Could not load reviews.</div></div>';
        });

    function goTo(n) {
        current = (n + total) % total;
        var cardWidth = track.parentElement.offsetWidth;
        track.style.transform = 'translateX(-' + (current * cardWidth) + 'px)';
        dotsContainer.querySelectorAll('.dot').forEach(function (d, i) {
            d.classList.toggle('active', i === current);
        });
    }

});