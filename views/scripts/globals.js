'use strict'

// intended to be in shared scope for all scripts
const globals = {
  isNewNote: true,
  API_URL: '/api/notes',
  currentNoteId: null,
  quillEditorSelector: '#quill-editor',
  editorContainerSelector: '#editor-container',
  noteFormSelector: '#note-form',
  notesListContainerSelector: '#notes-list-container',
  editorOptions: {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ 'header': 1 }, { 'header': 2 }],
        ['bold', 'italic', 'underline', 'strike', { 'align': [] }],
        [{ 'list': 'bullet' }, {'list': 'ordered'}, 'blockquote'],
        ['link', 'image', 'code-block'],
        [{ 'color': [] }, { 'background': [] }, { 'font': [] }],
      ]
    },
    placeholder: 'Write here...'
  }
}
