/**
 * @jest-environment jsdom
 */

const ejs = require('ejs')
const path = require('path')
const util = require('util')

const { JSDOM } = require('jsdom')
const {
  getByRole,
  getByText,
  getByLabelText,
} = require('@testing-library/dom')
const {
  toBeInTheDocument,
  toHaveAttribute,
} = require('@testing-library/jest-dom')

const renderFile = util.promisify(ejs.renderFile)

let staticHtml
let staticHtmlBody

beforeAll(async () => {
  try {
    const filePath = path.join(__dirname, './..', 'src', 'views', 'home.ejs')
    const data = {}
    const options = ''
    const html = await renderFile(filePath, data, options)
    staticHtml = new JSDOM(html)
    staticHtmlBody = await staticHtml.window.document.body
    // console.info('DOM is:', dom.serialize())
  } catch (err) {
    console.error(err)
  }
})

describe('check if editor form controls are present', () => {
  let noteForm
  beforeAll(async () => {
    noteForm = await staticHtmlBody.querySelector('form')
  })
  test('Note form exists', () => {
    expect(noteForm).toBeInTheDocument()
  })
  test("Has 'Save' button", () => {
    const saveButton = getByRole(noteForm, 'button', { name: 'Save' })
    expect(saveButton).toBeInTheDocument()
    expect(saveButton).toHaveAttribute('type', 'submit')
  })
  test("Has 'Title' label", () => {
    expect(getByText(noteForm, 'Title')).toBeInTheDocument()
  })
  test('Has input field for title', () => {
    expect(getByLabelText(noteForm, 'Title')).toBeInTheDocument()
  })
  test("Has 'New note' button", () => {
    expect(getByRole(noteForm, 'button', { name: 'New note' })).toBeInTheDocument()
  })
})

test("Page has a 'Load more' button", () => {
  expect(getByRole(staticHtmlBody, 'button', { name: 'Load more' })).toBeInTheDocument()
})
