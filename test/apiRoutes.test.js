/**
 * @jest-environment node
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
