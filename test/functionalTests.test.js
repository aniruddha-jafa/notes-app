/**
 * @jest-environment jsdom
 */

require('dotenv').config()
const puppeteer = require('puppeteer')
const {
  toBeInTheDocument,
  toHaveAttribute,
} = require('@testing-library/jest-dom')

const puppeteerOptions = {
  executablePath: process.env.PUPPETEER_PATH,
  headless: false,
}

let page
let quillEditor

beforeAll(() => new Promise((resolve, reject) => {
  const notesHomeUrl = 'http://127.0.0.1:3000/notes'
  puppeteer.launch(puppeteerOptions)
    .then(browser => browser.newPage())
    .then(newPage => { page = newPage })
    .then(() => page.goto(notesHomeUrl))
    .then(() => page.waitForSelector('#quill-editor')) // notesList item)
    .then(editor => { quillEditor = editor })
    .then(() => resolve())
    .catch(err => {
      console.error(err)
      reject(err)
    })
}))

afterAll(() => {
  page.close()
})

test('Page & editor are defined', () => {
  expect(page).toBeDefined()
  expect(quillEditor).toBeDefined()
})

test('Can type into editor', () => {
  const message = 'Can type into editor!'
  return expect(typeIntoEditor(message)).resolves.toBe('success')
})

function typeIntoEditor(message) {
  return new Promise((resolve, reject) => {
    quillEditor.click()
      .then(() => page.keyboard.type(message))
      .then(() => resolve('success'))
      .catch(err => reject(err))
  })
}
