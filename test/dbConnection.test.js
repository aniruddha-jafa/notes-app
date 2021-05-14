/**
 * @jest-environment node
 */

require('dotenv').config()

const dbConnection = require('../src/dbConnection')

let connection
let db
let collections
let collectionNames

beforeAll(async () => {
  try {
    connection = await dbConnection(test = true)
    db = connection.db
    collections = await db.listCollections().toArray()
    collectionNames = await collections.map((item) => item.name)
  } catch (err) {
    console.error(err)
  }
})

test("Has a collection named 'notes' ", () => {
  expect(collectionNames).toContain('notes')
})
