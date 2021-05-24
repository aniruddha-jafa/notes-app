document.addEventListener('DOMContentLoaded', createEditor)

async function createEditor() {
  try {
    // editor
    globals.quillEditor = new Quill('#quill-editor', globals.editorOptions)
    globals.currentNoteItem.params = globals.EMPTY_NOTE
    clearContents()
    initialiseTrackChanges(globals.EMPTY_NOTE)

    // form submit handler
    const form = document.querySelector('#note-form')

    // new note
    const newNoteButton = await document.querySelector('#new-note-button')
    newNoteButton.addEventListener('click', event => clearContents())

    form.addEventListener('submit', handleFormSubmit)
  } catch (err) {
    console.error(err)
  }
}


async function initialiseTrackChanges(note) {
  try {
    const initialContents =  JSON.stringify(note.body)
    const title = document.querySelector('#title')
    const initialTitle = note.title
    await title, initialTitle, initialContents
    // watch for changes
    globals.quillEditor.on('text-change',
      (delta, oldDelta, source) => watchEditorForChanges(source, initialContents))
    title.addEventListener('input', () => watchTitleForChanges(initialTitle))
    enableSaveButton(false)
  } catch (err) {
    console.error(err)
  }
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
    const currentContents = await JSON.stringify(globals.quillEditor.getContents())
    if (source === 'user' && currentContents !== initialContents) {
      enableSaveButton(true)
    } else {
      enableSaveButton(false)
    }
  } catch (err) {
    throw new Error(err)
  }
}

async function handleFormSubmit() {
  try {
    event.preventDefault()
    const form = await document.querySelector('#note-form')
    const formData = await formDataToJSON(form)
    const noteId = globals.currentNoteItem.params._id
    const note = await JSON.parse(formData)
    note.body = await JSON.parse(note.body) // note.body is a nested param
    if (!noteId) {
      // create new note, await server response
      let res = await makeFetchRequest('POST', formData)
      res = await res.json()
      note._id = res._id // unique id set by mongoDB on first create
    } else {
      // update existing note
      makeFetchRequest('PUT', formData, noteId)
      note._id = noteId
      globals.currentNoteItem.style.display = 'none'
    }
    const notesList = await document.querySelector('#notes-list')
    const noteItem = await makeNoteItem(note, notesList)
    globals.currentNoteItem = noteItem
    initialiseTrackChanges(note)
  } catch (err) {
    throw new Error(err)
  }
}

async function clearContents() {
  try {
    await globals.quillEditor.setText('')
    document.querySelector('#title').value = ''
    initialiseTrackChanges(globals.EMPTY_NOTE)
    globals.currentNoteItem = {}
    globals.currentNoteItem.params = globals.EMPTY_NOTE
  } catch (err) {
    console.error(err)
  }
}

async function formDataToJSON(form) {
  try {
    const date = new Date()
    const currentDateTime = await date.toISOString()
    const formData = new FormData(form)
    const editorContents = await JSON.stringify(globals.quillEditor.getContents())
    const title = await formData.get('title')
    const formObject = {
      body: editorContents,
      date: currentDateTime,
      title: title
    }
    const formJSON = await JSON.stringify(formObject)
    return formJSON
  } catch (err) {
    console.error(err)
    return {}
  }
}

async function makeFetchRequest(httpMethod, body) {
  try {
    const headers = { 'Content-Type': 'application/json' }
    let response
    let url = globals.API_ROOT_URL
    if (httpMethod === 'GET') {
      response = await fetch(url, { method: httpMethod, headers })
    } else if (httpMethod === 'POST') {
      response = await fetch(url, { method: httpMethod, headers, body })
    } else if (httpMethod === 'PUT') {
      const noteId = await globals.currentNoteItem.params._id
      url += `/${noteId}`
      response = await fetch(url, { method: httpMethod, headers, body })
    } else if (httpMethod === 'DELETE') {
      const noteId = await globals.currentNoteItem.params._id
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
