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
      await postJSONData(formData, '/notes')
      window.location.reload()

    })


  }
  catch(error) {
    console.error(error)
  }
}


async function makeFormDataJSON(form, quillEditor) {
  try {
    const date = new Date()
    const currentDateTime = await date.toISOString()

    const noteBody = await JSON.stringify(quillEditor.getContents())
    const formData = new FormData(form)

    let formObject = {
      body: noteBody,
      date: currentDateTime,
      title: formData['title'],
    }

    const formJSON = await JSON.stringify(formObject)
    return formJSON
  }
  catch(err) {
    console.error(err)
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
      console.error(response)
      throw new Error(response)
    } else {
      console.log(response)
    }
  }
  catch(err) {
    console.error(err)
    }
  }
