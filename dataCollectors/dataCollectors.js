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

/*

'--noURL' usage:
$ node dataCollectors/dataCollectors.js --noURL

only the object collectors gonna run, the url-s will be the last ones 
saved in the directory

'--continueLast' usage:
$ node dataCollectors/dataCollectors.js --noURL --continueLast

continues the scraping from where it was stopped/script failed

*/

const puppeteer = require('puppeteer')
const fs = require('fs')
const duplicateFinder = require('./duplicateFinder')

const wikiaUrlBase = 'https://harrypotter.fandom.com/wiki/'
const characterUrls = process.argv[2] === '--noURL' ? require('./characterUrls.json') : []
const charactersObj = process.argv[3] === '--continueLast' ? require('./characters_TEMP.json') : []
const errorUrls = []

const dUnderscore = new Date().toLocaleDateString().replace(/\//g, '_')
const timestamp = (Date.now() / 1000) | 0

let indexId = process.argv[3] === '--continueLast' ? charactersObj[charactersObj.length - 1].id + 1 : 1 // used as character ID
let lastCharacterUrl = process.argv[3] === '--continueLast' ? require('./error_log/lastCharacterUrl.json') : 0 // saves where the Object scraping is

async function dataCollectors() {
  const browser = await puppeteer.launch({ headless: true })
  const browserWSEndpoint = await browser.wsEndpoint()

  module.exports = { wikiaUrlBase, charactersObj, browserWSEndpoint, dUnderscore, timestamp }
  const urlCollector = require('./urlCollector')
  const urlCollectorConfig = require('./urlCollectorConfig.json')
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

  // collect url-s
  if (process.argv[2] !== '--noURL') {
    for (const category of urlCollectorConfig) {
      try {
        await urlCollector(category.firstPagePath, category.lastPagePath, eval(category.urlArray), category.jsonName)
      } catch (e) {
        console.error(e)
      }
    }
  }

  // collect characters
  for (const pageUrl of characterUrls.slice(lastCharacterUrl)) {
    try {
      lastCharacterUrl++
      await characterCollector(indexId, pageUrl)
      indexId++
      fs.writeFileSync('dataCollectors/characters_TEMP.json', JSON.stringify(charactersObj))
      fs.writeFileSync('dataCollectors/error_log/lastCharacterUrl.json', JSON.stringify(lastCharacterUrl))
    } catch (e) {
      console.error(e)
      if (e !== '[CHARACTER VALIDATION] failed') {
        errorUrls.push(pageUrl)
        fs.writeFileSync(`dataCollectors/error_log/errors_${dUnderscore}_${timestamp}.json`, JSON.stringify(errorUrls))
      }
    }
  }

  // check for duplicates in the final object
  duplicateFinder(charactersObj)

  // backup previous file
  if (fs.existsSync('dataCollectors/characters.json')) {
    fs.renameSync('dataCollectors/characters.json', `dataCollectors/backup/characters_${dUnderscore}_${timestamp}.json`)
    console.log(`renamed to ${jsonName}Urls_${dUnderscore}_${timestamp}.json`)
  }

  fs.writeFileSync('dataCollectors/characters.json', JSON.stringify(charactersObj))
  fs.copyFileSync('dataCollectors/characters.json', 'resources/characters.json')
  fs.unlinkSync('dataCollectors/characters_TEMP.json')

  await browser.close()
}
dataCollectors()
