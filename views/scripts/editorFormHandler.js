'use strict'

document.addEventListener("DOMContentLoaded", editorFormHandler)

const editorOptions = {
  theme: 'snow'
}

const quillEditor = new Quill('#editor', editorOptions)

async function editorFormHandler() {
  try {

    const form = await document.querySelector('form')

    form.addEventListener('submit', async event => {

      event.preventDefault()
      const formData = await makeFormDataJSON(form, quillEditor)
      await postJSONData(formData, '/create')
      window.location.reload()

    })


  }
  catch(error) {
    console.log(error)
  }
}


async function makeFormDataJSON(form, quillEditor) {
  try {
    const date = new Date()
    const currentDateTime = await `${date.toTimeString()} ${date.toDateString()}`

    const noteBody = await JSON.stringify(quillEditor.getContents())
    let formObject = {
      body: noteBody,
      date: currentDateTime
    }
    const formData = new FormData(form)
    for (let [key, val] of formData.entries()) {
       formObject[key] = val
     }
    const formJSON = await JSON.stringify(formObject)
    return formJSON
  }
  catch(err) {
    console.log(err)
  }
}

async function postJSONData(data, url) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    })
    if (!response.ok) {
      throw new Error(response)
    }
  }
  catch(err) {
    console.log(err)
    }
  }
