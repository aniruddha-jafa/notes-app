document.addEventListener('DOMContentLoaded', makeNotesList)
document.addEventListener('DOMContentLoaded', handleLoadMoreClick)

async function makeNotesList() {
  try {
    let notes = await makeFetchRequest('GET')
    notes = await notes.json()
    const notesList = document.querySelector('#notes-list')

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
async function makeNoteItem(note, placeholder) {
  try {
    const date = new Date(note.date).toDateString()
    const noteItem = document.createElement('div')
    noteItem.classList.add('notes-list-item')

    //  Content
    let noteTitle = 'Untitled'
    if (note.title) {
      noteTitle = note.title
    }
    noteItem.innerHTML = `<div class="note-item-content">
                            <p><b>${noteTitle}</b></p>
                            <p><em>${date}</em></p>
                          </div>
                          `
    // delete button
    const deleteButton = makeDeleteButton()
    deleteButton.addEventListener('click', (event) => handleDeleteClick(event, note._id))
    noteItem.appendChild(deleteButton)
    // save item
    const form = await document.querySelector('#note-form')
    form.addEventListener('submit', (event) => handleFormSubmit(note))
    // render on click
    noteItem.addEventListener('click', (event) => handleNoteItemClick(event, note))
    placeholder.appendChild(noteItem)

    return noteItem
  } catch (err) {
    throw new Error(err)
  }
}

async function handleNoteItemClick(event, note) {
  try {
      const initialContents = note.body
      const title = document.querySelector('#title')
      await initialContents, title
      await shared.quillEditor.setContents(initialContents)
      title.value = note.title
      initialiseTrackChanges(note)

      const form = document.querySelector('#note-form')
      await form.removeEventListener('submit', handleFormSubmit)
      form.addEventListener('submit', handleFormSubmit)

      shared.currentNoteItem = event.currentTarget
      shared.currentNoteItem.params = note
      shared.isNewNote = false
  } catch (err) {
    throw new Error(err)
  }
}

function makeDeleteButton() {
  const deleteButton = document.createElement('button')
  const classes = [
    'btn-close',
    'delete-button',
  ]
  classes.forEach((item) => {
    deleteButton.classList.add(item)
  });
  return deleteButton
}

async function handleDeleteClick(event, noteId) {
  try {
    event.stopPropagation()
    makeFetchRequest('DELETE')
    const noteItem = await event.target.parentNode
    noteItem.remove()
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
    const loadMoreButton = document.querySelector('#load-more-button')
    loadMoreButton.addEventListener('click', (event) => makeNotesList())
}
