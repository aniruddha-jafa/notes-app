'use strict'

document.addEventListener('DOMContentLoaded', createEditor)

async function createEditor () {
  try {
    // editor
    globals.quillEditor = new Quill('#quill-editor', globals.editorOptions)
    clearContents()
    initialiseTrackChanges(globals.EMPTY_NOTE)

    // form submit handler
    const form = document.querySelector('#note-form')

    // new note
    const newNoteButton = await document.querySelector('#new-note-button')
    newNoteButton.addEventListener('click', event => clearContents())

    // new changes
    form.params = { id: globals.EMPTY_NOTE._id }
    form.addEventListener('submit', handleFormSubmit)
  } catch(err) {
    console.error(err)
  }
}


async function initialiseTrackChanges (note) {
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
  } catch(err) {
    console.error(err)
  }
}


async function getTitle () {
  const form = await document.querySelector('#note-form')
  const title = new FormData(form).get('title')
  return title
}

async function watchTitleForChanges (initialTitle) {
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

async function watchEditorForChanges (source, initialContents) {
    try {
      const currentContents = await JSON.stringify(globals.quillEditor.getContents())
      if (source === 'user' && currentContents !== initialContents) {
        enableSaveButton(true)
      } else {
        enableSaveButton(false)
      }
    } catch(err) {
      throw new Error(err)
    }
}

async function handleFormSubmit (noteId=null) {
  try {
      event.preventDefault()
      const params = event.currentTarget.customParams
      const noteId = params.id
      const form = await document.querySelector('#note-form')
      const formData = await formDataToJSON(form)
      const note = JSON.parse(formData)
      if (!noteId) {
        let res = await makeFetchRequest('POST', formData)  // create new note, await server response
        res = await res.json()
        note._id = res._id // unique id set by mongoDB on first create
      } else {
        const res = await makeFetchRequest('PUT', formData, noteId)  // update existing note
      }
      initialiseTrackChanges(note)
    } catch(err) {
      throw new Error(err)
    }
}

async function clearContents () {
  try {
    await globals.quillEditor.setText('')
    document.querySelector('#title').value = ''
    initialiseTrackChanges(globals.EMPTY_NOTE)
  } catch(err) {
    console.error(err)
  }
}

async function formDataToJSON (form) {
  try {
    const date = new Date()
    const currentDateTime = await date.toISOString()
    const formData = new FormData(form)
    const editorContents = await JSON.stringify(globals.quillEditor.getContents())
    const title =  await formData.get('title')
    let formObject = {
      body: editorContents,
      date: currentDateTime,
      title: title
    }
    const formJSON = await JSON.stringify(formObject)
    return formJSON
  } catch(err) {
    console.error(err)
  }
}

async function makeFetchRequest (httpMethod, body, id) {
  try {
    const headers = { 'Content-Type': 'application/json' }
    let response
    let url = globals.API_ROOT_URL
    if (httpMethod === "GET") {
      response = await fetch(url, { method: httpMethod, headers: headers} )
    } else if (httpMethod === "POST") {
      response = await fetch(url, { method: httpMethod, headers: headers, body: body } )
    } else if (httpMethod === "PUT") {
      url += await `/${id}`
      response = await fetch(url, { method: httpMethod, headers: headers, body: body })
    } else if (httpMethod === "DELETE") {
      url += await `/${id}`
      response = await fetch(url, { method: httpMethod, headers: headers })
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
  } catch(err) {
    console.error(err)
    }
  }
