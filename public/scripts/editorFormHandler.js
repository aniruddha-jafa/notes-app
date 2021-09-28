const editorFormHandler = (function() {
  document.addEventListener('DOMContentLoaded', createEditor)

  async function createEditor() {
    try {
      shared.quillEditor = new Quill('#quill-editor', shared.editorOptions)
      shared.currentNoteItem.params = shared.EMPTY_NOTE
      clearContents()
      initialiseTrackChanges(shared.EMPTY_NOTE)

      // form submit handler
      const form = document.querySelector('#note-form')
      form.addEventListener('submit', handleFormSubmit)

      // new note
      const newNoteButton = await document.querySelector('#new-note-button')
      newNoteButton.addEventListener('click', (event) => clearContents())

      // dispatch event
      const editorIsCreatedEvent = new Event('editorIsCreated')
      document.dispatchEvent(editorIsCreatedEvent)
    } catch (err) {
      console.error(err)
    }
  }

  async function initialiseTrackChanges(note) {
    const initialContents = await JSON.stringify(note.body)
    shared.quillEditor.on('text-change',
      (delta, oldDelta, source) => watchEditorForChanges(source, initialContents))
    const title = document.querySelector('#title')
    const initialTitle = note.title
    await title, initialTitle
    title.addEventListener('input', () => watchTitleForChanges(initialTitle))
    enableSaveButton(false)
  }

  async function getTitle() {
    const form = await document.querySelector('#note-form')
    const title = new FormData(form).get('title')
    return title
  }

  async function watchTitleForChanges(initialTitle) {
    try {
      const currentTitle = await getTitle()
      if (currentTitle !== initialTitle) {
        enableSaveButton(true)
      } else {
        enableSaveButton(false)
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function watchEditorForChanges(source, initialContents) {
    try {
      const currentContents = JSON.stringify(shared.quillEditor.getContents())
      if (source === 'user' && currentContents !== initialContents) {
        enableSaveButton(true)
      } else {
        enableSaveButton(false)
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  async function handleFormSubmit(note) {
    try {
      event.stopImmediatePropagation()
      event.preventDefault()
      const form = await document.querySelector('#note-form')
      const formData = await formDataToJSON(form)
      const note = await JSON.parse(formData)
      note.body = await JSON.parse(note.body) // note.body is a nested param
      let res
      if (shared.isNewNote === true) {
        res = await makeFetchRequest('POST', formData) // create new note, await server response
        res = await res.json()
        note._id = res._id // unique id set by mongoDB on first create
      } else {
        res = await makeFetchRequest('PUT', formData, note._id) // update existing note
        note._id = await shared.currentNoteItem.params._id
        shared.currentNoteItem.style.display = "none"
      }
      const notesList = await document.querySelector('#notes-list')
      const noteItem = await makeNoteItem(note, notesList)
      shared.currentNoteItem = noteItem
      shared.currentNoteItem.params = note
      shared.isNewNote = false
      initialiseTrackChanges(note)
    } catch (err) {
      throw new Error(err)
    }
  }

  async function clearContents() {
    try {
      await shared.quillEditor.setText('')
      document.querySelector('#title').value = ''
      initialiseTrackChanges(shared.EMPTY_NOTE)
      shared.currentNoteItem = document.createElement('div')
      shared.currentNoteItem.params = shared.EMPTY_NOTE
      shared.isNewNote = true // new addition
    } catch (err) {
      console.error(err)
    }
  }

  async function formDataToJSON(form) {
    try {
      const date = new Date()
      const currentDateTime = await date.toISOString()
      const formData = new FormData(form)
      const noteBody = await JSON.stringify(shared.quillEditor.getContents())
      const title = await formData.get('title')
      const formObject = {
        body: noteBody,
        date: currentDateTime,
        title,
      }
      const formJSON = await JSON.stringify(formObject)
      return formJSON
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

  async function makeFetchRequest (httpMethod, body = null) {
    try {
      const headers = { 'Content-Type': 'application/json' }
      let response
      let url = shared.API_ROOT_URL
      if (httpMethod === 'GET') {
        response = await fetch(url, { method: httpMethod, headers })
      } else if (httpMethod === 'POST') {
        response = await fetch(url, { method: httpMethod, headers, body })
      } else if (httpMethod === 'PUT') {
        const noteId = await shared.currentNoteItem.params._id
        url += `/${noteId}`
        response = await fetch(url, { method: httpMethod, headers, body })
      } else if (httpMethod === 'DELETE') {
        const noteId = await shared.currentNoteItem.params._id
        url += `/${noteId}`
        response = await fetch(url, { method: httpMethod, headers })
      } else {
        throw new Error('Unhandled http method:', httpMethod)
      }
      if (!response.ok) {
        console.error(response)
        throw new Error(response)
      }
      return response
    } catch (err) {
      console.error(err)
    }
  }

  return {
    initialiseTrackChanges,
    handleFormSubmit,
    clearContents,
    makeFetchRequest
  }
})()