/**
 * @jest-environment jsdom
 */

const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const assert = require('assert').strict
const util = require('util')

const { JSDOM } = require('jsdom')
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
    console.info('DOM is:', dom.serialize())
  } catch (err) {
    console.error(err)
  }
})

test('A failing test', () => {
  expect(false).toBeTruthy()
})
