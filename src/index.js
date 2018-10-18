document.addEventListener('DOMContentLoaded', () => {

  getQuotes()

  document.addEventListener('click', (event) => {
    if (event.target.className === 'btn btn-primary') {
      event.preventDefault()
      const quoteField = document.getElementById('new-quote').value
      const authorField = document.getElementById('author').value
      fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quote: quoteField,
          likes: 0,
          author: authorField,
        })
      }).then(result => result.json())
      .then(quote => createQuote(quote))
      event.target.parentElement.reset()
    }
    if (event.target.id === 'likeButton') {
      let totalLikes = event.target.innerText
      let newLikes = Number(totalLikes.replace(/[^\d]/g, '')) + 1
      let quoteId = event.target.className
      event.target.innerText = `Likes: ${newLikes}`
      fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          likes: newLikes,
        })
      }).then(result => result.json())
    }
    if (event.target.id === 'deleteButton') {
      let quoteId = event.target.className
      fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: 'DELETE',
      })
      event.target.parentElement.parentElement.remove()
    }
  })

})

function getQuotes() {
  fetch('http://localhost:3000/quotes')
  .then(results => results.json())
  .then(results => {
    results.forEach(quoteObj => createQuote(quoteObj))
  })
}

function createQuote(quoteObj) {
  let quoteUl = document.getElementById('quote-list')
  let quoteLi = document.createElement('li')
  quoteLi.className = 'blockquote'
  let blockQuote = document.createElement('blockquote')
  blockQuote.className = 'blockquote'
  let quoteP = document.createElement('p')
  quoteP.innerText = quoteObj.quote
  quoteP.className = 'mb-0'
  let quoteFooter = document.createElement('footer')
  quoteFooter.className = 'blockquote-footer'
  quoteFooter.innerText = quoteObj.author
  let quoteBreak = document.createElement('br')
  let likeButton = document.createElement('button')
  likeButton.id = 'likeButton'
  likeButton.className = quoteObj.id
  likeButton.innerText = `Likes: ${quoteObj.likes}`
  let deleteButton = document.createElement('button')
  deleteButton.id = 'deleteButton'
  deleteButton.className = quoteObj.id
  deleteButton.innerText = 'Delete'
  blockQuote.appendChild(quoteP)
  blockQuote.appendChild(quoteFooter)
  blockQuote.appendChild(quoteBreak)
  blockQuote.appendChild(likeButton)
  blockQuote.appendChild(deleteButton)
  quoteLi.appendChild(blockQuote)
  quoteUl.appendChild(quoteLi)
}
