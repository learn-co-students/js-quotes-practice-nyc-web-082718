// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
const list = document.getElementById('quote-list')
let quoteIds = 0

const renderQuote = function(quoteObject) {
  const listItem = document.createElement('li')
  listItem.class = 'quote-card'
  const blockQuote = document.createElement('blockquote')
  blockQuote.class = 'blockquote'
  const para = document.createElement('p')
  para.class = `mb-${quoteObject.id}`
  para.innerText = quoteObject.quote
  const foot = document.createElement('footer')
  foot.class = "blockquote-footer"
  foot.innerText = quoteObject.author
  const breaker = document.createElement('br')
  const likeButton = document.createElement('button')
  likeButton.innerText = "Likes: "
  likeButton.class = "btn-success"
  likeButton.id = `${++quoteIds}`
  const span = document.createElement('span')
  span.innerText = `${quoteObject.likes}`
  const deleteButton = document.createElement('button')
  deleteButton.innerText = 'Delete'
  deleteButton.class = 'btn-danger'


  blockQuote.appendChild(para)
  blockQuote.appendChild(foot)
  blockQuote.appendChild(breaker)
  blockQuote.appendChild(likeButton)
  likeButton.appendChild(span)
  blockQuote.appendChild(deleteButton)
  listItem.appendChild(blockQuote)
  list.appendChild(listItem)

  likeButton.addEventListener('click', function(e) {
    e.preventDefault()
    fetch(`http://localhost:3000/quotes/${quoteObject.id}`, {
       method: 'PATCH',
       headers:
       {
         "Content-Type": "application/json",
         Accept: "application/json"
       },
       body: JSON.stringify(
         {
           "likes": ++quoteObject.likes
         })
    })
    .then(response => response.json())
    likeButton.innerText = `Likes: ${quoteObject.likes}`
  })

  deleteButton.addEventListener('click', function(event) {
    event.preventDefault()
    fetch(`http://localhost:3000/quotes/${quoteObject.id}`, {
    method: "DELETE"
    })
    .then( (response) => {
      return response.json()
    })
    .then( (json) => {
      list.innerHTML = ''
      renderAll()
    })
  })
}

const renderAll = function() {
  fetch('http://localhost:3000/quotes')
  .then(response => response.json())
  .then(quoteData => quoteData.forEach((quoteObject) => {
    renderQuote(quoteObject)
  }))
}

document.addEventListener("DOMContentLoaded",() => {
  renderAll()
})

const newQuote = document.getElementById('new-quote')
const author = document.getElementById('author')
const form = document.getElementById('new-quote-form')

form.addEventListener('submit', function(e){
  e.preventDefault()
  fetch(`http://localhost:3000/quotes`, {
     method: 'POST',
     headers:
     {
       "Content-Type": "application/json",
       Accept: "application/json"
     },
     body: JSON.stringify(
       {
         "quote": newQuote.value,
         "author": author.value,
         "likes": 1
       })
     })
   .then(response => response.json())
   .then(newQuoteObject=> renderQuote(newQuoteObject));

})

// list.addEventListener('click', function(e) {
//   e.preventDefault()
//   if (e.target.class === "btn-success") {
//     fetch(`http://localhost:3000/quotes/${e.target.id}`, {
//        method: 'PATCH',
//        headers:
//        {
//          "Content-Type": "application/json",
//          Accept: "application/json"
//        },
//        body: JSON.stringify(
//          {
//           //  debugger
//            "likes": e.target.innerText.slice(-1)
//        })
//      .then(response => response.json())
//      e.target.innerText = `Likes: ${parseInt(e.target.innerText.slice(-1)) + 1}`
//   }
// })
