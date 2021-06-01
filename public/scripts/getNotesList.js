document.addEventListener('DOMContentLoaded', makeNotesList)
document.addEventListener('DOMContentLoaded', handleLoadMoreClick)

async function makeNotesList() {
  try {
    const notesList = document.querySelector('#notes-list')

    let notes = await makeFetchRequest('GET')
    notes = await notes.json()

    const placeholder = document.createDocumentFragment()
    const noteItems = notes.map((note) => makeNoteItem(note, placeholder))

    Promise.all(noteItems)
      .then((res) => notesList.appendChild(placeholder))
      .catch((err) => { throw new Error(err) })
  } catch (err) {
    console.error(err)
  }
}

// returns a promise -> can be used with Promise.all in makeNoteItems
async function makeNoteItem(note, placeholder) {
  try {
    const date = new Date(note.date).toDateString()
    const noteItem = document.createElement('div')
    noteItem.classList.add('notes-list-item')
    //  Content
    let noteTitle = 'Untitled'
    if (note.title) { noteTitle = note.title }
    noteItem.innerHTML = `<div class="d-flex flex-column justify-content-flex-start">
                             <p><b>${noteTitle}</b></p>
                             <p><em>${date}</em></p>
                           </div>`
    // delete button
    const deleteButton = makeDeleteButton()
    deleteButton.addEventListener('click', (event) => handleDeleteClick(note._id))
    noteItem.appendChild(deleteButton)
    // save item
    const form = await document.querySelector('#note-form')
    form.addEventListener('submit', (event) => handleFormSubmit(note))
    // render on click
    noteItem.addEventListener('click', (event) => handleNoteItemClick(note))
    placeholder.appendChild(noteItem)
  } catch (err) {
    throw new Error(err)
  }
}

async function handleNoteItemClick(note) {
  try {
    globals.isNewNote = false

    const initialContents = note.body
    const title = document.querySelector('#title')
    await initialContents, title

    await globals.quillEditor.setContents(initialContents)
    title.value = note.title
    initialiseTrackChanges(note)
  } catch (err) {
    throw new Error(err)
  }
}

function makeDeleteButton() {
  const deleteButton = document.createElement('button')
  const classes = [
    'btn-close',
  ]
  classes.forEach((item) => {
    deleteButton.classList.add(item)
  });
  return deleteButton
}

async function handleDeleteClick(noteId) {
  try {
    event.stopPropagation()
    makeFetchRequest('DELETE', null, noteId)
    event.target.parentNode.style.display = 'none'
    clearContents()
  } catch (err) {
    console.error(err)
  }
}

async function enableSaveButton (toEnable) {
  try {
    const button = await document.querySelector('#save-button')
    button.disabled = !toEnable
  } catch (err) {
    console.error(err)
  }
}

async function handleLoadMoreClick() {
  document.querySelector('#load-more-button')
    .addEventListener('click', makeNotesList)
}
