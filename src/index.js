let allQuotes
document.addEventListener("DOMContentLoaded", () => {
  const quotesContainer = document.getElementById('quote-list')
  const newQuoteForm = document.getElementById('new-quote-form')
  const newQuoteInput = document.getElementById('new-quote')
  const newAuthorInput = document.getElementById('author')

  function fetchQuotes() {
    fetch('http://localhost:3000/quotes')
    .then(response => response.json())
    .then(parsed => {
      allQuotes = parsed
      parsed.forEach(quoteObj => renderQuote(quoteObj))
    })
  }

  fetchQuotes()

  function renderQuote(quoteObj) {
    const quoteCard = document.createElement('li')
    quoteCard.className = 'quote-card'
    const blockQuote = document.createElement('blockquote')
    blockQuote.className = 'blockquote'
    blockQuote.id = quoteObj.id
    const quoteLine = document.createElement('p')
    quoteLine.className = 'mb-0'
    const footer = document.createElement('footer')
    footer.className = 'blockquote-footer'
    const breakLine = document.createElement('br')
    const likeBtn = document.createElement('button')
    likeBtn.className = 'btn-success'
    likeBtn.innerText = 'Likes: '
    const span = document.createElement('span')
    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'btn-danger'
    deleteBtn.innerText = 'Delete'

    likeBtn.appendChild(span)
    blockQuote.appendChild(quoteLine)
    blockQuote.appendChild(footer)
    blockQuote.appendChild(breakLine)
    blockQuote.appendChild(likeBtn)
    blockQuote.appendChild(deleteBtn)
    quoteCard.appendChild(blockQuote)
    quotesContainer.appendChild(quoteCard)

    quoteLine.innerText = quoteObj.quote
    footer.innerText = quoteObj.author
    span.innerText = quoteObj.likes
  }

  function createQuote() {
    newQuoteForm.addEventListener('submit', event => {
      event.preventDefault()
      const newQuote = newQuoteInput.value
      const newAuthor = newAuthorInput.value
      fetch('http://localhost:3000/quotes', {
        'method': 'POST',
        'headers': {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        'body': JSON.stringify({
          'quote': newQuote,
          'author': newAuthor,
          'likes': 0
        })
      })
      .then(response => response.json())
      .then(json => {
        renderQuote(json)
        console.log(json)
      })
      event.target.reset()
    })
  }

  createQuote()

  document.addEventListener('click', event => {
    if (event.target.className === 'btn-success') {
      let selectedQuote = allQuotes.find(quote => parseInt(quote.id) === parseInt(event.target.parentElement.id))
      likeQuote(selectedQuote)
    } else if (event.target.className === 'btn-danger') {
      let selectedQuote = allQuotes.find(quote => parseInt(quote.id) === parseInt(event.target.parentElement.id))
      deleteQuote(selectedQuote)
    }
  })

  function likeQuote(quoteObj) {
    fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
      'method': 'PATCH',
      'headers': {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      'body': JSON.stringify({
        'likes': ++quoteObj.likes
      })
    })
    .then(response => response.json())
    .then(json => {
      const quoteBlock = document.getElementById(`${quoteObj.id}`)
      const likes = quoteBlock.querySelector('span')
      likes.innerText = quoteObj.likes
      console.log(json)
    })
  }

  function deleteQuote(quoteObj) {
    fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
      'method': 'DELETE'
    })
    .then(response => response.json())
    .then(json => {
      const quoteBlock = document.getElementById(`${quoteObj.id}`).parentElement
      quoteBlock.remove()
      console.log(json)
    })
  }
})
