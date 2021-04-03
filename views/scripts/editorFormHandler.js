'use strict'

document.addEventListener("DOMContentLoaded", editorFormHandler)

const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['image', 'code-block']
    ]
  },
  scrollingContainer: '#scrolling-container',
  placeholder: 'Compose an epic...'
}

const quillEditor = new Quill('#quill-container', editorOptions)

async function editorFormHandler() {
  try {
    const form = await document.querySelector('#note-form')
    form.addEventListener('submit', async event => {
      try {
        event.preventDefault()
        const data = await makeFormDataJSON(form, quillEditor)
        await postJSONData(data, '/api/notes')
        //window.location.reload()
      } catch(err) {
        throw new Error(err)
      }
    })
  } catch(err) {
    console.error(err)
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
      throw new Error(response)
    } else {
      console.log(response)
    }
  }
  catch(err) {
    console.error(err)
    }
  }
