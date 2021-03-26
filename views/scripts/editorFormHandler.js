'use strict'

document.addEventListener("DOMContentLoaded", editorFormHandler)

const editorOptions = {
  theme: 'snow'
}

const quillEditor = new Quill('#editor', editorOptions)

async function editorFormHandler() {
  try {

    const form = await document.querySelector('#note-form')

    form.addEventListener('submit', async event => {

      event.preventDefault()
      const data = await makeFormDataJSON(form, quillEditor)
      await postJSONData(data, '/notes')
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

    const formData = new FormData(form)

    const noteBody = await JSON.stringify(quillEditor.getContents())

    let formObject = {
      body: noteBody,
      date: currentDateTime,
      title: formData.get('title'),
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
