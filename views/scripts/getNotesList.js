'use strict'

document.addEventListener('DOMContentLoaded', makeNotesList)

async function makeNotesList() {
  try {
    const notesList = document.querySelector('#notes-list-container')

    let notes = await makeFetchRequest('GET')
    notes =  await notes.json()

    const placeholder = document.createDocumentFragment()
    const makeNoteItems = notes.map(note => { makeNoteItem(note, placeholder) })

    Promise.all(makeNoteItems)
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
    console.log('Current note.body:', note.body)
    const date = new Date(note.date)
    const noteItem = document.createElement('div')
    noteItem.classList.add('notes-list-item')
    noteItem.textContent =  await `${note.title}, ${date.toDateString()}`
    placeholder.appendChild(noteItem)

    // bind to access params in event listener
    noteItem.addEventListener("click", handleNoteItemClick.bind(note))
  } catch(err) {
    throw new Error(err)
  }

}

async function handleNoteItemClick() {
    try {
      // access params in event listener through 'this'
      globals.isNewNote = false
      globals.currentNoteId = this._id

      const title = document.querySelector('#title')
      await title
      title.value = this.title

      const initialContents = this.body //{ ops: this.body.ops }
      await globals.quillEditor.setContents(initialContents)
      initialiseTrackChanges()

    } catch(err) {
      throw new Error(err)
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
