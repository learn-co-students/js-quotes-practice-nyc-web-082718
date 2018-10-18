// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
// let idCounter

document.addEventListener('DOMContentLoaded', () => {

  getQuotesData()
  addEventListenerToSubmit()
  addEventListenerForDelete()
  addEventListenerForLikes()

})

function getQuotesData() {
  fetch('http://localhost:3000/quotes')
  .then(response => response.json())
  .then(json => {
    // setIdCounter(json)
    makeQuoteCard(json)
  })
}

// function setIdCounter(json) {
//   idCounter = json.length
// }

function makeQuoteCard(json) {
  document.getElementById('quote-list').innerHTML = ''
  for (const quoteObj of json) {
    makeQuoteHTML(quoteObj)
  }
}

function makeQuoteHTML(quoteObj) {
  //get full container to append into
  const listContainer = document.getElementById('quote-list')

  //make li element
  const quoteList = document.createElement('li')
  quoteList.setAttribute('class', 'quote-card')
  quoteList.setAttribute('data-id', quoteObj.id)
  listContainer.appendChild(quoteList)

  //make blackquote element
  const blockQuote = document.createElement('blockquote')
  blockQuote.setAttribute('class', 'blockquote')
  quoteList.appendChild(blockQuote)

  //make p element
  const para = document.createElement('p')
  para.setAttribute('class', 'mb-0')
  para.innerText = quoteObj.quote
  blockQuote.appendChild(para)

  //make footer element
  const footer = document.createElement('footer')
  footer.setAttribute('class', 'blockquote-footer')
  footer.innerText = quoteObj.author
  blockQuote.appendChild(footer)

  //make br element
  const breaker = document.createElement('br')
  blockQuote.appendChild(breaker)

  // make success button element
  const successBtn = document.createElement('button')
  const likeSpan = document.createElement('span')
  successBtn.setAttribute('class', 'btn-success')
  successBtn.innerText = "Likes: "
  likeSpan.innerText = quoteObj.likes
  successBtn.appendChild(likeSpan)
  blockQuote.appendChild(successBtn)

  //make delete button element
  const deleteBtn = document.createElement('button')
  deleteBtn.setAttribute('class', 'btn-danger')
  deleteBtn.innerText = "Delete"
  blockQuote.appendChild(deleteBtn)
}//end of function

function addEventListenerToSubmit() {
  const newForm = document.querySelector('form')

  newForm.addEventListener('submit', event => {
    event.preventDefault()

    const newQuoteObj = {
      // 'id': ++idCounter,
      'quote': newForm.querySelectorAll('input')[0].value,
      'likes': 0,
      'author': newForm.querySelectorAll('input')[1].value
    }

    fetch('http://localhost:3000/quotes', {
      'method': 'POST',
      'headers': {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      'body': JSON.stringify(newQuoteObj)
    })
    .then(response => response.json())
    .then(json => makeQuoteCard([json]))
  })
}//end of function

function addEventListenerForDelete() {
  const quoteList = document.getElementById('quote-list')
  quoteList.addEventListener('click', event => {
    if (event.target && event.target.className === 'btn-danger') {
      fetch('http://localhost:3000/quotes' + `/${event.target.parentNode.parentNode.dataset.id}`, {
        'method': 'DELETE'
      })
      event.target.parentNode.parentNode.remove()
    }
  })
} //end of function

function addEventListenerForLikes() {
  const quoteList = document.getElementById('quote-list')

  quoteList.addEventListener('click', event => {

    const id = event.target.parentNode.parentNode.dataset.id
    const listItems = Array.from(document.querySelectorAll('li'))
    const listItem = listItems.filter((item) => {
      return parseInt(item.getAttribute('data-id')) === id
    })[0]
    const span = listItem.querySelector('span')
    const likes = parseInt(span.innerText)
    
    if (event.target && event.target.className === 'btn-success') {
      const likes =
      fetch('http://localhost:3000/quotes' + `/${id}`, {
        'method': 'PATCH',
        'headers': {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        'body': JSON.stringify({
          'likes': ++likes
        })
      })
      .then(response => response.json())
      .then(json => getQuotesData())
    }
  })
}//end of function
