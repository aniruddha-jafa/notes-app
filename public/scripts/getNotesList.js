document.addEventListener('DOMContentLoaded', makeNotesList)
document.addEventListener('DOMContentLoaded', handleLoadMoreClick)

async function makeNotesList() {
  try {
    let notes = await makeFetchRequest('GET')
    const notesList = document.querySelector('#notes-list')
    notes = await notes.json()

    const placeholder = document.createDocumentFragment()
    const noteItems = notes.map((note) => makeNoteItem(note, placeholder))

    Promise.all(noteItems)
      .then((res) => notesList.appendChild(placeholder))
      .catch((err) => { throw new Error(err) })

    handleLoadMoreClick()
  } catch (err) {
    console.error(err)
  }
}

// returns a promise -> can be used with Promise.all in makeNoteItems
async function makeNoteItem(note, parentNode) {
  try {
    const date = new Date(note.date)

    const noteItem = document.createElement('div')
    // create text content
    noteItem.classList.add('notes-list-item')
    noteItem.textContent = await `${note.title}, ${date.toDateString()}`
    noteItem.params = note

    // add delete button
    const deleteButton = makeDeleteButton()
    deleteButton.addEventListener('click', (event) => handleDeleteClick(note._id))
    noteItem.appendChild(deleteButton)

    // render on click
    noteItem.addEventListener('click', (event) => handleNoteItemClick(note))
    parentNode.appendChild(noteItem)
    return noteItem
  } catch (err) {
    throw new Error(err)
  }
}

async function handleNoteItemClick(note) {
  try {
    console.log('Setting initial contents:', note.body)
    const initialContents = note.body
    const title = document.querySelector('#title')
    const form = document.querySelector('#note-form')

    await initialContents, title
    await globals.quillEditor.setContents(initialContents)
    title.value = note.title
    initialiseTrackChanges(note)

    await form.removeEventListener('submit', handleFormSubmit)
    form.addEventListener('submit', handleFormSubmit)

    globals.currentNoteItem = event.target
  } catch (err) {
    throw new Error(err)
  }
}

function makeDeleteButton() {
  const deleteButton = document.createElement('button')
  deleteButton.classList.add('delete-button')
  deleteButton.textContent = 'X'
  return deleteButton
}

async function handleDeleteClick(noteId) {
  try {
    event.stopPropagation()
    await makeFetchRequest('DELETE', null, noteId)
    const noteItem = await event.target.parentNode
    noteItem.remove()
    clearContents()
  } catch (err) {
    console.error(err)
  }
}

async function enableSaveButton(toEnable) {
  try {
    const saveButton = document.querySelector('#save-button')
    saveButton.disabled = !toEnable
  } catch (err) {
    console.error(err)
  }
}

async function handleLoadMoreClick() {
  const loadMoreButton = document.querySelector('#load-more-button')
  loadMoreButton.addEventListener('click', (event) => makeNotesList())
}
