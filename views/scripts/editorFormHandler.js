'use strict'

document.addEventListener("DOMContentLoaded", editorFormHandler)

async function editorFormHandler() {
  try {
    const form = document.querySelector(noteFormSelector)
    const quillEditor = new Quill(quillEditorSelector, editorOptions)
    const args = {
      form: form,
      quillEditor: quillEditor
    }
    // bind to access params in event listener
    form.addEventListener('submit', handleFormSubmit.bind(args))
  } catch(err) {
    console.error(err)
  }
}

async function handleFormSubmit() {
  try {
      event.preventDefault()
       // access params in event listener through 'this'
      const form = await this.form
      const quillEditor = await this.quillEditor
      const noteData = await makeFormDataJSON(form, quillEditor)
      if (isNewNote) {
        makeFetchRequest('POST', noteData)
      } else {
        makeFetchRequest('PUT', noteData)
      }
    } catch(err) {
      throw new Error(err)
    }
}


async function makeFormDataJSON(form, quillEditor) {
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

async function makeFetchRequest(httpMethod, url=API_URL, body=null) {
  try {
    const headers = { 'Content-Type': 'application/json' }
    let response
    if (!body) {
      response = await fetch(url, { method: httpMethod, headers: headers } )
    } else {
      response = await fetch(url, { method: httpMethod, headers: headers, body: body })
    }
    if (!response.ok) {
      throw new Error(response)
    }
    return response
  } catch(err) {
    console.error(err)
    }
  }
