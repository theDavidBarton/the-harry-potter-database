/*
MIT License

Copyright (c) 2020 David Barton (theDavidBarton)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const puppeteer = require('puppeteer')
const fs = require('fs')

const wikiaUrlBase = 'https://harrypotter.fandom.com/wiki/'
const characterUrls = []
const charactersObj = []
const errorUrls = []

const dUnderscore = new Date().toLocaleDateString().replace(/\//g, '_')
const timestamp = (Date.now() / 1000) | 0

let indexId = 1 // used as character ID

async function dataCollectors() {
  const browser = await puppeteer.launch({ headless: true })
  const browserWSEndpoint = await browser.wsEndpoint()

  module.exports = { wikiaUrlBase, charactersObj, browserWSEndpoint, dUnderscore, timestamp }
  const urlCollector = require('./urlCollector')
  const characterCollector = require('./characterCollector')
  const page = await browser.newPage()

  // close cookie policy
  try {
    await page.goto(wikiaUrlBase)
    await page.waitFor(10000)
    const getAcceptBtn = await page.$x('//div[contains(text(), "ACCEPT")]')
    await getAcceptBtn[0].click()
    await page.close()
  } catch (e) {
    console.error(e)
    console.log('it wont work like this!')
    process.exit(0)
  }

  await urlCollector('Category:Wizards', '?from=Wizard+who+claimed+to+be+a+dragon+killer', characterUrls, 'character')

  // collect characters
  for (const pageUrl of characterUrls) {
    try {
      await characterCollector(indexId, pageUrl)
      indexId++
      fs.writeFileSync('dataCollectors/characters_TEMP.json', JSON.stringify(charactersObj))
    } catch (e) {
      errorUrls.push(pageUrl)
      console.error(e)
      fs.writeFileSync(`dataCollectors/errors_${dUnderscore}_${timestamp}.json`, JSON.stringify(errorUrls))
    }
  }

  // backup previous file
  if (fs.existsSync('dataCollectors/characters.json.json')) {
    fs.renameSync('dataCollectors/characters.json', `dataCollectors/characters_${dUnderscore}_${timestamp}.json`)
    console.log(`renamed to ${jsonName}Urls_${dUnderscore}_${timestamp}.json`)
  }

  fs.writeFileSync('dataCollectors/characters.json', JSON.stringify(charactersObj))
  fs.copyFileSync('dataCollectors/characters.json', 'resources/characters.json')
  fs.unlinkSync('dataCollectors/characters_TEMP.json')

  await browser.close()
}
dataCollectors()
