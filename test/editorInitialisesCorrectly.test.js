/**
 * @jest-environment jsdom
 */

require('dotenv').config()

const puppeteer = require('puppeteer')
const { JSDOM } = require('jsdom')
const {
  toBeInTheDocument,
  toBeVisible,
  toHaveAttribute,
} = require('@testing-library/jest-dom')

const puppeteerOptions = {
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
}

let page
let html
let htmlBody
let quillEditor

beforeAll(async () => {
  try {
    const browser = await puppeteer.launch(puppeteerOptions)
    page = await browser.newPage()
    const notesHomeUrl = 'http://127.0.0.1:3000/notes'
    await page.goto(notesHomeUrl)
    await page.waitForSelector('#notes-list > div:nth-child(1)') // notesList item
    html = await page.content()
    html = new JSDOM(html)
    htmlBody = await html.window.document.body
    // console.log(html.serialize())
    quillEditor = await htmlBody.querySelector('div.ql-editor')
  } catch (err) {
    console.error(err)
  }
})

describe('Editor initialises correctly', () => {
  test('Editor has a valid container', () => {
    const editorContainer = htmlBody.querySelector('div.ql-container')
    expect(editorContainer).toBeInTheDocument()
  })

  test('Editor is visible', () => {
    expect(quillEditor).toBeInTheDocument()
    expect(quillEditor).toBeVisible()
  })

  test('Editor is contenteditable', () => {
    expect(quillEditor).toHaveAttribute('contenteditable', 'true')
  })
})
