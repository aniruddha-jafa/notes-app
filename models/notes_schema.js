

const { Schema, model, createConnection } = require('mongoose')

const notesDbConnection = createConnection(process.env.MONGODB_NOTES_URI,
                {
                  useNewUrlParser: true,
                  useUnifiedTopology: true
                })


const DeltaObjectSchema = new Schema({
    ops: { type: Schema.Types.Mixed }
  })

const NoteSchema = new Schema({
  title: {
          type: String,
          minlength: [ 2, 'Title must contain at least 2 characters'],
          maxlength: [ 50,'Title cannot exceed 50 chars'],
          trim: true,
          //default: 'monkey business'
        },
  date: {
          type: Date,
          required: true,
        },
  body: {
          //type: DeltaObjectSchema,
          type: Schema.Types.Mixed,
          required: true,
          trim: true
        }
})


module.exports = notesDbConnection.model('Note', NoteSchema)
