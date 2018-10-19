const quoteList = document.getElementById('quote-list')

// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener('DOMContentLoaded', () => {
// Populate page with quotes with a GET request to http://localhost:3000/quotes.
  fetch('http://localhost:3000/quotes')
  .then( (response) => {
    return response.json()
  })
  .then( (data) => {
    console.log(data)
    data.forEach(quoteCardMaker) //end of iteration
  }) //end of data

  const quoteCardMaker = (dataObj) => {
    // Each quotes should have the following structure:
    // <li class='quote-card'>
    const createQuoteCard = document.createElement('li')
    createQuoteCard.setAttribute('class', 'quote-card')
    createQuoteCard.id = dataObj.id
    console.log(createQuoteCard)
    // <blockquote class="blockquote">
      const createBlockquote = document.createElement('blockquote')
      createBlockquote.setAttribute('class', 'blockquote')
      // <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
        const createQuoteElement = document.createElement('p')
        createQuoteElement.setAttribute('class', 'mb-0')
      // <footer class="blockquote-footer">Someone famous</footer>
        const createBlockquoteFooter = document.createElement('footer')
        createBlockquoteFooter.setAttribute('class', 'blockquote-footer')
      // <br>
        const createBreak = document.createElement('br')
      // <button class='btn-success'>Likes:
// Clicking the like button will increase the number of likes
//for this particular comment in the database and on the page without having to refresh.
        const createLikeButton = document.createElement('button')
        createLikeButton.setAttribute('class', 'btn-success')
        createLikeButton.dataset.likes = dataObj.id
        createLikeButton.innerText = 'Likes: '
        //<span>0</span>

        createLikeButton.addEventListener('click', (event) => {
          let likes = dataObj.likes++
          createLikeSpanNumber.innerText = likes
          fetch(`http://localhost:3000/quotes/${dataObj.id}`, {
            method: 'PATCH',
            headers:
            {
              'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
              quote: dataObj.quote,
              author: dataObj.author,
              likes: likes
            })
          })
          .then( (response) => {
            return response.json()
          })
          .then( (data) => {
            console.log(data)
          })
        }) // end of Like addEventListener
        const createLikeSpanNumber = document.createElement('span')
        createLikeSpanNumber.innerText = dataObj.likes
      //< /button> // end of like button
      // <button class='btn-danger'>Delete</button>
      const createDeleteButton = document.createElement('button')
      createDeleteButton.setAttribute('class', 'btn-danger')
      createDeleteButton.innerText = 'Delete'
// Clicking the delete button should delete the respective quote from the database
// and remove it from the page without having to refresh.
      createDeleteButton.addEventListener('click', (event) => {
        createQuoteCard.remove()

        fetch(`http://localhost:3000/quotes/${dataObj.id}`, {
          method: 'DELETE'
        })
      }) // end of Delete addEventListener

    // </blockquote> // end of blockquote
    // </li> // end of li

    createQuoteElement.innerText = dataObj.quote
    createBlockquoteFooter.innerText = dataObj.author

    quoteList.appendChild(createQuoteCard)
    createQuoteCard.appendChild(createBlockquote)
    createBlockquote.appendChild(createQuoteElement)
    createBlockquote.appendChild(createBlockquoteFooter)
    createBlockquote.appendChild(createBreak)
    createBlockquote.appendChild(createLikeButton)
    createLikeButton.appendChild(createLikeSpanNumber)
    createBlockquote.appendChild(createDeleteButton)
  } // end of createQuoteCard function


// Submitting the form creates a new quote and adds it to the list of quotes without having to refresh the page.
//(Whether you choose to optimistically render or not is up to you).
  const form = document.getElementById('new-quote-form')

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    const newQuoteInput = document.getElementById('new-quote')
    const newAuthor = document.getElementById('author')

    const newObject = {
      quote: newQuoteInput.value,
      author: newAuthor.value,
      likes: 0
    }

    quoteCardMaker(newObject)
    form.reset()

    fetch('http://localhost:3000/quotes', {
      method: 'POST',
      headers:
      {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(newObject)
    })
    .then( (response) => {
      return response.json()
    })
    .then( (data) => {
      console.log(data)
    })
  }) // end of form addEventListener

}) //end of DOM addEventListener
