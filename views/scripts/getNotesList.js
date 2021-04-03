'use strict'

document.addEventListener('DOMContentLoaded', makeNotesList)


async function makeNotesList() {
  try {
    const notesList = document.querySelector('#notes-list-container')
    const editor  =  document.querySelector('#quill-container')

    let notes = await fetch('/api/notes', {
                  headers: { 'Content-Type': 'application/json' }
                })
    notes =  await notes.json()
    const placeholder = document.createDocumentFragment()
    const makeNoteItems = notes.map(async note => { makeNoteItem(note, placeholder, editor) })

    Promise.all(makeNoteItems)
    .then(res => { notesList.appendChild(placeholder) })

  } catch(err) {
    console.error(err)
  }
}

async function makeNoteItem (note, placeholder, editor) {
  try {
    const date = new Date(note.date)
    const noteItem = document.createElement('div')
    noteItem.classList.add('notes-list-item')
    noteItem.textContent =  `${note.title}, ${date.toDateString()}`

    placeholder.appendChild(noteItem)

    noteItem.addEventListener("click", async e => {
      try {
        await editor
        let quillEditor = new Quill(editor)
        quillEditor.setContents(note.body.ops)
        await title
        title.value = note.title
      } catch(err) {
        throw new Error(err)
      }
    })
    return
  } catch(err) {
    console.error(err)
  }
}
