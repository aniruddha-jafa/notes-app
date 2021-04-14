'use strict'

document.addEventListener("DOMContentLoaded", createEditor)

async function createEditor () {
  try {
    globals.quillEditor = new Quill('#quill-editor', globals.editorOptions)

    clearContents()
    initialiseTrackChanges(globals.EMPTY_NOTE)

    const form = document.querySelector('#note-form')
    form.addEventListener('submit', event => handleFormSubmit(globals.EMPTY_NOTE))

    const newNoteButton = await document.querySelector('#new-note-button')
    newNoteButton.addEventListener('click', event => clearContents())

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
      const currentContents = JSON.stringify(globals.quillEditor.getContents())
      await initialContents, currentContents
      if (source === 'user' && currentContents !== initialContents) {
        enableSaveButton(true)
      } else {
        enableSaveButton(false)
      }
    } catch(err) {
      throw new Error(err)
    }
}

async function handleFormSubmit (note) {
  try {
      event.stopImmediatePropagation()
      event.preventDefault()
      const form = await document.querySelector('#note-form')
      const formData = await formDataToJSON(form)
      let res
      if (note.isNewNote) {
        res = await makeFetchRequest('POST', formData)  // create new note, await server response
        res = await res.json()
        const newNote = JSON.parse(formData)
        newNote._id = res._id // unique id set by mongoDB on first create
        globals.isNewNote = false
        initialiseTrackChanges(newNote)
      } else if (note.isNewNote === false ) {  // explicitly check to avoid falsy values like undefined
        res = await makeFetchRequest('PUT', formData, note._id)  // update existing note
        initialiseTrackChanges(note)
      } else {
        throw new Error('Unexpected value of property isNewNote')
      }

    } catch(err) {
      throw new Error(err)
    }

}

async function clearContents () {
  try {
    globals.isNewNote = true
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
    const noteBody = await JSON.stringify(globals.quillEditor.getContents())
    const title =  await formData.get('title')
    let formObject = {
      body: noteBody,
      date: currentDateTime,
      title: title
    }
    const formJSON = await JSON.stringify(formObject)
    return formJSON
  } catch(err) {
    console.error(err)
  }
}

async function makeFetchRequest (httpMethod, body=null, id=null) {
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
