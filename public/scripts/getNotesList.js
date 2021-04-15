'use strict'

document.addEventListener('DOMContentLoaded', event => makeNotesList())
document.addEventListener('DOMContentLoaded', event => handleLoadMoreClick())



async function makeNotesList(event) {
  try {
    let notes = await makeFetchRequest('GET')
    const notesList = document.querySelector('#notes-list')
    notes =  await notes.json()

    const placeholder = document.createDocumentFragment()
    const noteItems = notes.map(note => makeNoteItem(note, placeholder))

    Promise.all(noteItems)
    .then(res => notesList.appendChild(placeholder))
    .catch(err => { throw new Error(err) })

    handleLoadMoreClick()

  } catch(err) {
    console.error(err)
  }
}

// returns a promise -> can be used with Promise.all in makeNoteItems
async function makeNoteItem (note, parentNode) {
  try {
    const date = new Date(note.date)

    const noteItem = document.createElement('div')
    // create text content
    noteItem.classList.add('notes-list-item')
    noteItem.textContent =  await `${note.title}, ${date.toDateString()}`

    // add delete button
    const deleteButton = makeDeleteButton()
    deleteButton.addEventListener('click', event => handleDeleteClick(event, note._id))
    noteItem.appendChild(deleteButton)

    // render on click
    noteItem.addEventListener('click', event => handleNoteItemClick(event, note))

    console.log(`Finished creating note item ${noteItem}; appending to parent ${parentNode}`)
    parentNode.appendChild(noteItem)
  } catch(err) {
    throw new Error(err)
  }
}

async function handleNoteItemClick (event, note) {
  try {
    const initialContents = note.body
    const title = document.querySelector('#title')
    const form = await document.querySelector('#note-form')

    await initialContents, title
    await globals.quillEditor.setContents(initialContents)
    title.value = note.title

    await form
    form.addEventListener('submit', event => handleFormSubmit(event, note._id))
    initialiseTrackChanges(note)
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

async function handleDeleteClick (event, noteId) {
  try {
    event.stopPropagation()
    const res = await makeFetchRequest('DELETE', null, noteId)
    event.target.parentNode.style.display = "none"
    clearContents()
  } catch (err) {
    console.error(err)
  }
}

async function enableSaveButton (toEnable) {
    try {
      const saveButton = document.querySelector('#save-button')
      saveButton.disabled = !toEnable
    } catch(err) {
      console.error(err)
    }
  }

async function handleLoadMoreClick () {
  const loadMoreButton = document.querySelector('#load-more-button')
  loadMoreButton.addEventListener('click', event => makeNotesList(event))
}
