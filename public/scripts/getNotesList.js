const getNotesList = (function() {
  document.addEventListener('DOMContentLoaded', makeNotesList)
  document.addEventListener('DOMContentLoaded', handleLoadMoreClick)

  let firstLoad = true
  async function makeNotesList() {
    try {
      let notes = await editorFormHandler.makeFetchRequest('GET')
      notes = await notes.json()
      const notesList = document.querySelector('#notes-list')

      const placeholder = document.createDocumentFragment()
      const noteItems = notes.map((note) => makeNoteItem(note, placeholder))

      Promise.all(noteItems)
        .then((res) => notesList.appendChild(placeholder))
        .catch((err) => { throw new Error(err) })

      handleLoadMoreClick()

      if (firstLoad) {
        const firstLoadForNotesList = new Event('firstLoadForNotesList')
        document.dispatchEvent(firstLoadForNotesList)
        firstLoad = false
      }
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
      form.addEventListener('submit', (event) => editorFormHandler.handleFormSubmit(note))
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
      console.info('Clicked on note', note)
      const initialContents = note.body
      const title = document.querySelector('#title')
      await initialContents, title
      await shared.quillEditor.setContents(initialContents)
      title.value = note.title
      editorFormHandler.initialiseTrackChanges(note)

      const form = document.querySelector('#note-form')
      await form.removeEventListener('submit', editorFormHandler.handleFormSubmit)
      form.addEventListener('submit', editorFormHandler.handleFormSubmit)

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
      shared.currentNoteItem.params = await { _id: noteId }
      event.stopPropagation()
      await makeFetchRequest('DELETE')
      const noteItem = await event.target.parentNode
      noteItem.remove()
      clearContents()
    } catch (err) {
      console.error(err)
    }
  }

  async function handleLoadMoreClick() {
      const loadMoreButton = document.querySelector('#load-more-button')
      loadMoreButton.addEventListener('click', (event) => makeNotesList())
  }

})()