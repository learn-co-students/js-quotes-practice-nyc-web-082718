const allQuotes = document.getElementById('quote-list')

document.addEventListener("DOMContentLoaded", e => {
  getFetch()
})

document.addEventListener("submit", e=>{
    e.preventDefault()
    postFetch()
    e.target.reset()
})

document.addEventListener("click", e => {
  if (e.target.innerHTML === "Delete") {
    deleteFetch(e.target.parentElement.parentElement)
  } else if (e.target.innerHTML.includes("Likes")) {
    patchLikes(e.target)
  }
})

  const getFetch = () => {
  	 fetch("http://localhost:3000/quotes")
      .then(res=> res.json())
      .then(parsed=>{
        for (let i = 0; i < parsed.length; i++) {
          allQuotes.innerHTML += makeList(parsed[i])
        }
      })
  }

const makeList = (listObj) =>{
  return `  <li class='quote-card' id="${listObj.id}">
                  <blockquote class="blockquote">
                    <p class="mb-0">${listObj.quote}</p>
                    <footer class="blockquote-footer">${listObj.author}</footer>
                    <br>
                    <button class='btn-success'>Likes: <span>${listObj.likes}</span></button>
                    <button class='btn-danger'>Delete</button>
                  </blockquote>
                </li>`
}

const postFetch = () => {
  let form = document.getElementById("new-quote-form")
  let quote = form.querySelector("#new-quote").value
  let author = form.querySelector("#author").value
  fetch("http://localhost:3000/quotes",{
    method: "POST",
    headers: {"Content-Type" : "application/json",
                    "Accept" : "application/json"},
    body: JSON.stringify({
      "quote": quote,
      "author": author,
      "likes": 0
    })
  }).then(res => res.json())
    .then(parsed=>
      allQuotes.innerHTML += makeList(parsed))
}

const deleteFetch = (quote) => {
  fetch(`http://localhost:3000/quotes/${quote.id}`,{
    method: "DELETE"})
    quote.remove()
  }

  const patchLikes = (likeBox) => {
    let id = likeBox.parentElement.parentElement.id
    let currentLikes = parseInt(likeBox.querySelector("span").innerText)
     likeBox.querySelector("span").innerText = currentLikes +1
    fetch(`http://localhost:3000/quotes/${id}`,{
      method: "PATCH",
      headers: {"Content-Type" : "application/json",
                      "Accept" : "application/json"},
      body: JSON.stringify({
        "likes": currentLikes + 1
      })
    })
  }
