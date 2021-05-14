/**
 * @jest-environment node
 */

const request = require('supertest')

const notesRouter = require('../src/routes/noteRoutes')

describe('Api tests', () => {
  test.only('A failing test', () => {
    expect(false).toBe(true)
  })
})
