document.addEventListener('DOMContentLoaded', createEditor)

async function createEditor() {
  try {
    globals.quillEditor = new Quill('#quill-editor', globals.editorOptions)
    initialiseTrackChanges(globals.EMPTY_NOTE)

    const newNoteButton = await document.querySelector('#new-note-button')
    newNoteButton.addEventListener('click', (event) => clearContents())
  } catch (err) {
    console.error(err)
  }
}

async function initialiseTrackChanges(note) {
  const initialContents = await JSON.stringify(note.body)
  globals.quillEditor.on('text-change',
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
    const currentContents = JSON.stringify(globals.quillEditor.getContents())
    await initialContents, currentContents
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
    let res
    if (globals.isNewNote === true) {
      res = await makeFetchRequest('POST', formData) // create new note, await server response
      res = await res.json()
      note._id = res._id // unique id set by mongoDB on first create
      globals.isNewNote = false
    } else {
      res = await makeFetchRequest('PUT', formData, note._id) // update existing note
    }
    initialiseTrackChanges(note)
  } catch (err) {
    throw new Error(err)
  }
}

async function clearContents() {
  try {
    globals.isNewNote = true
    await globals.quillEditor.setText('')
    document.querySelector('#title').value = ''
    initialiseTrackChanges(globals.EMPTY_NOTE)
  } catch (err) {
    console.error(err)
  }
}

async function formDataToJSON (form) {
  try {
    const date = new Date()
    const currentDateTime = await date.toISOString()
    const formData = new FormData(form)
    const noteBody = await JSON.stringify(globals.quillEditor.getContents())
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

async function makeFetchRequest (httpMethod, body = null, id = null) {
  try {
    const headers = { 'Content-Type': 'application/json' }
    let response
    let url = globals.API_ROOT_URL
    if (httpMethod === 'GET') {
      response = await fetch(url, { method: httpMethod, headers })
    } else if (httpMethod === 'POST') {
      response = await fetch(url, { method: httpMethod, headers, body })
    } else if (httpMethod === 'PUT') {
      url += `/${id}`
      response = await fetch(url, { method: httpMethod, headers, body })
    } else if (httpMethod === 'DELETE') {
      url += `/${id}`
      response = await fetch(url, { method: httpMethod, headers })
    } else {
      throw new Error('Unhandled http method:', httpMethod)
    }
    if (!response.ok) {
      console.error(response)
      throw new Error(response)
    } else if (response.message) {
      console.log('Server message:', response.message)
    }
    return response
  } catch (err) {
    console.error(err)
  }
}
