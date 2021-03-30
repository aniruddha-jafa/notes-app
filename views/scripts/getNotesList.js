'use strict'

document.addEventListener('DOMContentLoaded', getNotesList)

async function getNotesList() {
  try {
    const notesList = document.querySelector('#notes-list')
    let notes = await fetch('/api/notes', {
                  headers: { 'Content-Type': 'application/json' }
                })


    const placeholder = document.createDocumentFragment()
    notes = await notes.json()

    const createNoteLinks = notes.map(async note => {
      try {
        const date = new Date(note.date)
        const span = document.createElement('span')
        span.innerHTML =  `<a href=/notes/${note._id}>
                            ${note.title}, ${date.toLocaleDateString()}
                          </a>
                          <br>`
        placeholder.appendChild(span)
        return
      } catch(err) {
        console.error(err)
      }

    })

    Promise.all(createNoteLinks)
    .then(res => {
      notesList.appendChild(placeholder)
    })



  } catch(err) {
    console.error(err)
  }

}
