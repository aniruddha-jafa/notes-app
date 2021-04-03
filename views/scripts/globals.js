'use strict'

// intended to be in shared scope for all scripts
let isNewNote = true
const API_URL = '/api/notes'

const quillEditorSelector = '#quill-editor'
const editorContainerSelector = '#editor-container'
const noteFormSelector = '#note-form'
const notesListContainerSelector = '#notes-list-container'

const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['image', 'code-block']
    ]
  },
  placeholder: 'Compose an epic...'
}
