const container = document.getElementById('container')
const form = document.getElementById('new-quote-form')
const newQuoteInput = document.getElementById('new-quote')
const authorInput = document.getElementById('author')


// READ
displayAllQuotes()
function displayAllQuotes() {
  container.innerHTML = ''
  fetch('http://localhost:3000/quotes')
    .then(res => res.json())
    .then(quotes => {
      quotes.forEach(displayQuote)
    })
}

// CREATE
addFormEventListener()
function addFormEventListener() {
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    createQuote(newQuoteInput.value, authorInput.value)
  })
}

// HELPERS
function displayQuote(quoteObj) {
  const quoteDiv = document.createElement('div')
  quoteDiv.innerHTML = `
    <li class='quote-card'>
    <blockquote class="blockquote">
      <p class="mb-0">${quoteObj.quote}</p>
      <footer class="blockquote-footer">${quoteObj.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${quoteObj.likes}</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
    </li>
  `
  container.prepend(quoteDiv)

  // ADD DELETE AND LIKE FUNCTIONALITY
  const deleteButton = quoteDiv.querySelector('.btn-danger')
  const likesButton = quoteDiv.querySelector('.btn-success')

  // ADD DELETE EVENT LISTENER
  deleteButton.addEventListener('click', () => {
    deleteQuote(quoteObj)
  })

  // ADD LIKES EVENT LISTENER
  likesButton.addEventListener('click', () => {
    likeQuote(quoteObj)
  })
}

function createQuote(quote, author) {
  fetch('http://localhost:3000/quotes', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      quote: quote,
      author: author,
      likes: 0
    })
  })
    .then(res => res.json())
    .then(displayQuote)
}

function deleteQuote(quoteObj) {
  fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
    method: "DELETE",
    // headers: {
    //   'Content-Type': 'application/json',
    //   'Accept': 'application/json'
    // },
    // body: JSON.stringify({
    //   quote: quote,
    //   author: author,
    //   likes: 0
    // })
  })
    // .then(res => res.json())
    .then(displayAllQuotes)
}

function likeQuote(quoteObj) {
  let likes = quoteObj.likes
  likes++
  fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      likes: likes
    })
  })
    // .then(res => res.json())
    .then(displayAllQuotes)
}
