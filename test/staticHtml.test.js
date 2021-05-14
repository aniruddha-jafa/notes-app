/**
 * @jest-environment jsdom
 */

const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const assert = require('assert').strict
const util = require('util')

const { JSDOM } = require('jsdom')
const { getByRole,
        getByText } = require('@testing-library/dom')
const { toBeInTheDocument } = require('@testing-library/jest-dom')

const renderFile = util.promisify(ejs.renderFile)

let dom, staticHtml

beforeAll(async () => {
  try {
    const filePath = path.join(__dirname, './..', 'src', 'views', 'home.ejs')
    const data = {}
    const options = ''
    const html = await renderFile(filePath, data, options)
    dom = new JSDOM(html)
    staticHtml = await dom.window.document.body
    //console.info('DOM is:', dom.serialize())
  } catch (err) {
    console.error(err)
  }
})

describe('check if editor form controls are present', () => {
  let noteForm
  beforeAll(async() => {
    noteForm = await staticHtml.querySelector('form')
  })
  test("Has 'Save' button", () => {
    expect(getByRole(noteForm, 'button', { name: 'Save' })).toBeInTheDocument()
  })
  test("Has 'Title' field", () => {
  expect(getByText(noteForm, 'Title')).toBeInTheDocument()
  })
  test("Has 'New note' button", () => {
    expect(getByRole(noteForm, 'button', { name: 'New note' })).toBeInTheDocument()
  })
})
