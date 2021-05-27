/**
 * @jest-environment node
 */

require('dotenv').config()

const mongoose = require('mongoose')
const noteSchema = require('../src/models/note')

const testConnectionOpts = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
}

let connection
let collectionNames

beforeAll(async () => {
  try {
    connection = await mongoose.createConnection(
      process.env.MONGODB_NOTES_URI,
      testConnectionOpts,
    )
    const collections = await connection.db.listCollections().toArray()
    collectionNames = await collections.map((item) => item.name)
  } catch (err) {
    console.error(err)
  }
})

test("Has a collection named 'notes' ", () => {
  expect(collectionNames).toContain('notes')
})

test("Has a collection named 'notes-test' ", () => {
  expect(collectionNames).toContain('notes-test')
})
