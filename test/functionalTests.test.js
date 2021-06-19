/**
 * @jest-environment jsdom
 */

require('dotenv').config()
const puppeteer = require('puppeteer')

const puppeteerOptions = {
  executablePath: process.env.PUPPETEER_PATH,
}

let page
let quillEditor

beforeAll(async () => {
  try {
    const notesHomeUrl = 'http://127.0.0.1:3000/notes'
    const browser = await puppeteer.launch(puppeteerOptions)
    page = await browser.newPage()
    await page.goto(notesHomeUrl)
    quillEditor = await page.waitForSelector('div.ql-container')
  } catch (err) {
    console.error(err)
  }
})

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
