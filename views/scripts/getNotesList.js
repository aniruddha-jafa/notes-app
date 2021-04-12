'use strict'

document.addEventListener('DOMContentLoaded', makeNotesList)

async function makeNotesList() {
  try {
    const notesList = document.querySelector('#notes-list-container')

    let notes = await makeFetchRequest('GET')
    notes =  await notes.json()

    const placeholder = document.createDocumentFragment()
    const noteItems = notes.map(note => { makeNoteItem(note, placeholder) })

    Promise.all(noteItems)
    .then(res => { notesList.appendChild(placeholder) })
    .catch(err => { throw new Error(err) })

  } catch(err) {
    console.error(err)
  }
}

// async so that it returns a promise, can be used with Promise.all
// in makeNoteItems
async function makeNoteItem (note, placeholder) {
  try {
    const date = new Date(note.date)
    const noteItem = document.createElement('div')
    // text content
    noteItem.classList.add('notes-list-item')
    noteItem.textContent =  await `${note.title}, ${date.toDateString()}`

    // delete button
    const deleteButton = makeDeleteButton()
    deleteButton.addEventListener('click', handleDeleteClick.bind({ _id: note._id}))

    noteItem.appendChild(deleteButton)

    // save item
    const form = await document.querySelector('#note-form')
    form.addEventListener('submit', handleFormSubmit.bind({ _id: note._id }))

    // render on click
    noteItem.addEventListener("click", handleNoteItemClick.bind(note))

    placeholder.appendChild(noteItem)

  } catch(err) {
    throw new Error(err)
  }

}


async function handleNoteItemClick() {
    try {
      globals.isNewNote = false
      globals.currentNoteId = this._id // access params in event listener through 'this'

      const title = document.querySelector('#title')
      await title
      title.value = this.title

      const initialContents = this.body
      await globals.quillEditor.setContents(initialContents)
      initialiseTrackChanges()

    } catch(err) {
      throw new Error(err)
    }
  }

function makeDeleteButton () {
      const deleteButton = document.createElement('button')
      deleteButton.classList.add('delete-button')
      deleteButton.textContent = 'X'
      return deleteButton
  }

async function handleDeleteClick () {
  try {
    event.stopPropagation()
    const noteId = await this._id
    const res = makeFetchRequest('DELETE', null, noteId)
    event.target.parentNode.style.display = "none"
    clearContents()
  } catch (err) {
    console.error(err)
  }
}

async function enableSaveButton(toEnable) {
    try {
      const button = await document.querySelector('#save-button')
      button.disabled = !toEnable
    } catch(err) {
      console.error(err)
    }
  }
