'use strict'

document.addEventListener("DOMContentLoaded", editorFormHandler)

async function editorFormHandler () {
  try {
    const form = document.querySelector(globals.noteFormSelector)
    const quillEditor = new Quill(globals.quillEditorSelector, globals.editorOptions)
    const args = {
      form: form,
      quillEditor: quillEditor
    }
    // bind to access params in event listener
    form.addEventListener('submit', handleFormSubmitEvent.bind(args))
  } catch(err) {
    console.error(err)
  }
}

async function handleFormSubmitEvent () {
  try {
      event.preventDefault()
       // access params in event listener through 'this'
      const form = await this.form
      const quillEditor = await this.quillEditor
      const note = await formDataToJSON(form, quillEditor)
      if (globals.isNewNote === true) {
        makeFetchRequest('POST', note)  // create new note
      } else {
        makeFetchRequest('PUT', note)  // update existing note
      }
    } catch(err) {
      throw new Error(err)
    }
}


async function formDataToJSON (form, quillEditor) {
  try {
    const date = new Date()
    const currentDateTime = await date.toISOString()
    const formData = new FormData(form)
    const noteBody = await JSON.stringify(quillEditor.getContents())

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
      throw new Error(response)
    }
    return response
  } catch(err) {
    console.error(err)
    }
  }
