
// getting the elements
const filterBtns = document.querySelectorAll('.filter-btn'); // look for the class named 'filter-btn' aka all filter buttons 
const cards = document.querySelectorAll('.card'); // look for the class named 'card' aka all the places cards 


// ----- buttons part -------

// loop through the buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => { // add action listener for each buttons
    // remove active from all buttons
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');


    // read custome data attribute in html
    const filter = btn.dataset.filter;


    // ----- card part -------
    cards.forEach(card => {
      if (filter === 'all' || card.classList.contains(filter)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});