'use strict'

document.addEventListener('DOMContentLoaded', makeNotesList)

async function makeNotesList() {
  try {
    const notesList = document.querySelector(globals.notesListContainerSelector)

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

      const editor  =  document.querySelector(globals.quillEditorSelector)
      const title = document.querySelector('#title')
      const initialContents = { ops: this.body.ops }
      const initialContentAsString = JSON.stringify(initialContents)

      await editor, title
      await globals.quillEditor.setContents(initialContents)
      title.value = this.title
      const args = {
        initialContents: initialContentAsString
      }
      globals.quillEditor.on('text-change', verifyContentChange.bind(args))
      disableSaveButton()

    } catch(err) {
      throw new Error(err)
    }
  }

  async function verifyContentChange (delta, oldDelta, source) {
    try {
      const initialContents = this.initialContents
      const currentContents = await JSON.stringify(globals.quillEditor.getContents())
      if (source === 'user' && currentContents !== initialContents) {
        enableSaveButton()
      } else {
        disableSaveButton()
      }
    } catch(err) {
      throw new Error(err)
    }
  }

async function disableSaveButton() {
      const button = await document.querySelector(globals.saveButtonSelector)
      button.disabled = true
  }

async function enableSaveButton() {
        const button = await document.querySelector(globals.saveButtonSelector)
        button.disabled = false
    }
