/**
 * @jest-environment node
 */

/*
Mock noteController to test if the right functions are being called,
instead of using the actual api - this is the approach suggested in the jest docs
*/

const request = require('supertest')

jest.mock('../src/controllers/noteController')
const app = require('../src/app.js')

jest.setTimeout(5000)

test('GET /api/notes ', async () => {
  try {
    const res = await request(app).get('/api/notes')
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBeDefined()
    expect(res.body.message).toBe('notesReadMany mock response')
  } catch (err) {
    console.error(err)
  }
})

test('POST /api/notes', async () => {
  try {
    const dummyData = { title: 'Test Note' } // won't actually be persisted
    const res = await request(app)
      .post('/api/notes')
      .send(dummyData)
      .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBeDefined()
    expect(res.body.message).toBe('notesCreateOne mock response')
  } catch (err) {
    console.error(err)
  }
})
