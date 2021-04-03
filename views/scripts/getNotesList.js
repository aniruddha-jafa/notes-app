'use strict'

document.addEventListener('DOMContentLoaded', makeNotesList)

async function makeNotesList() {
  try {
    const notesList = document.querySelector(notesListContainerSelector)
    let notes = await makeFetchRequest('GET')
    notes =  await notes.json()

    const placeholder = document.createDocumentFragment()
    const makeNoteItems = notes.map(async note => { makeNoteItem(note, placeholder) })

    Promise.all(makeNoteItems)
    .then(res => { notesList.appendChild(placeholder) })
  } catch(err) {
    console.error(err)
  }
}

async function makeNoteItem (note, placeholder) {
  try {
    const date = new Date(note.date)
    const noteItem = document.createElement('div')
    noteItem.classList.add('notes-list-item')
    noteItem.textContent =  `${note.title}, ${date.toDateString()}`
    placeholder.appendChild(noteItem)

    // bind to access params in event listener
    noteItem.addEventListener("click", handleNoteItemClick.bind(note))
  } catch(err) {
    console.error(err)
  }
}

async function handleNoteItemClick() {
    try {
      // access params in event listener through 'this'
      isNewNote = false
      const editor  =  document.querySelector(quillEditorSelector)
      const title = document.querySelector('title')
      await editor, title

      const quillEditor = new Quill(editor)
      title.value = this.title
      quillEditor.setContents(this.body.ops)
    } catch(err) {
      throw new Error(err)
    }
  }
