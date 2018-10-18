// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

QUOTES = "http://localhost:3000/quotes";

const deleteQuote = function(quoteId) {
  fetch(`${QUOTES}/${quoteId}`, {
    method: 'DELETE'
  })
  document.getElementById('quote-list').removeChild(document.querySelector(`[data-id='${quoteId}']`))
}

const like = function(quoteId) {
  const origLike = parseInt(document.querySelector(`[data-id='${quoteId}'] span`).innerText);
  fetch(`${QUOTES}/${quoteId}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
    body: JSON.stringify({
      likes: origLike + 1
      })
    })
      .then(resp => resp.json())
      .then(json => {
        document.querySelector(`[data-id='${json.id}'] span`).innerText = json.likes;
      })
}



document.addEventListener('DOMContentLoaded', (e) => {
  const quoteList = document.getElementById('quote-list');
  const newQuoteForm = document.getElementById('new-quote-form');

  const renderQuote = function(quote) {
    return `<li class='quote-card' data-id="${quote.id}">
    <blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success' onClick="like(${quote.id})">Likes: <span>${quote.likes}</span></button>
    <button class='btn-danger' onClick="deleteQuote(${quote.id})">Delete</button>
    </blockquote>
    </li>`;
  }



  fetch(QUOTES)
    .then(resp => resp.json())
    .then(quotesJSON => {
      quoteList.innerHTML = quotesJSON.map(quote => renderQuote(quote)).join('');
    })

  newQuoteForm.addEventListener('submit', e => {
    e.preventDefault();

    const newQuote = document.getElementById('new-quote').value;
    const newQuoteAuthor = document.getElementById('author').value;

    fetch(QUOTES, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
      body: JSON.stringify({
        quote: newQuote,
        author: newQuoteAuthor,
        likes: 0
        })
      })
        .then(resp => resp.json())
        .then(json => {
          debugger
          quoteList.innerHTML += renderQuote(json);
        })

    e.target.reset();
  })

})
