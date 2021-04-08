'use strict'

document.addEventListener("DOMContentLoaded", createEditor)

async function createEditor () {
  try {
    globals.quillEditor = new Quill('#quill-editor', globals.editorOptions)
    const form = document.querySelector('#note-form')
    const newNoteButton = document.querySelector('#new-note-button')

    initialiseTrackChanges()

    await form
    form.addEventListener('submit', handleFormSubmit.bind({ form: form }))

    await newNoteButton
    newNoteButton.addEventListener('click', clearContents)

  } catch(err) {
    console.error(err)
  }
}


function initialiseTrackChanges () {
  globals.quillEditor.on('text-change',
    watchForChange.bind( { contents: globals.quillEditor.getContents() } ))
  enableSaveButton(false)
}

async function watchForChange (delta, oldDelta, source) {
  try {
    const initialContents = JSON.stringify(this.contents)
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


async function handleFormSubmit () {
  try {
      event.preventDefault()
       // access params in event listener through 'this'
      const form = await this.form
      const note = await formDataToJSON(form)
      let res
      if (globals.isNewNote === true) {
        res = await makeFetchRequest('POST', note)  // create new note, await server response
        res = await res.json()
        globals.currentNoteId = res._id  // unique id set by mongoDB
        globals.isNewNote = false
      } else {
        res = await makeFetchRequest('PUT', note)  // update existing note
      }
      initialiseTrackChanges()
    } catch(err) {
      throw new Error(err)
    }
}

async function clearContents () {
  try {
    globals.isNewNote = true
    globals.currentNoteId = null
    await globals.quillEditor.setText('')
    document.querySelector('#title').value = ''
    initialiseEditor()
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
    let formObject = {
      body: noteBody,
      date: currentDateTime,
      title: formData.get('title')
    }
    const formJSON = await JSON.stringify(formObject)
    return formJSON
  } catch(err) {
    console.error(err)
  }
}

async function makeFetchRequest (httpMethod, body) {
  try {
    const headers = { 'Content-Type': 'application/json' }
    let response
    let url = globals.API_URL

    if (httpMethod === "GET") {
      response = await fetch(url, { method: httpMethod, headers: headers} )
    } else if (httpMethod === "POST") {
      response = await fetch(url, { method: httpMethod, headers: headers, body: body } )
    } else if (httpMethod === "PUT") {
      url += `/${globals.currentNoteId}`
      response = await fetch(url, { method: httpMethod, headers: headers, body: body })
    } else {
      throw new Error('Unhandled http method:', httpMethod)
    }
    if (!response.ok) {
      console.error(response)
      throw new Error(response)
    } else {
      console.log(response)
    }
    return response
  } catch(err) {
    console.error(err)
    }
  }
