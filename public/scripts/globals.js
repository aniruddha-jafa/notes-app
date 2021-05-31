// intended to be in shared scope for all scripts
const globals = {
  API_ROOT_URL: '/api/notes',
  EMPTY_NOTE: {
    body: {"ops":[{"insert":"\n"}]},
    date: '',
    title: '',
    _id: '',
  },
  quillEditor: null,
  currentNoteItem: {},
  editorOptions: {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: 1 }, { header: 2 }],
        ['bold', 'italic', 'underline', 'strike', { align: [] }],
        [{ list: 'bullet' }, { list: 'ordered' }, 'blockquote'],
        ['link', 'code-block'],
        [{ color: [] }, { background: [] }, { font: [] }],
      ],
    },
    placeholder: 'Write here...',
  },
}
