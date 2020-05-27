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
const characterCollector = require('./characterCollector')
let characterUrls = []
let charactersObj = []
let indexId = 1 // used as character ID
let count // no. links on a page

module.exports = { charactersObj }

async function dataCollectors() {
  const browser = await puppeteer.launch({ headless: true })
  const browserWSEndpoint = await browser.wsEndpoint()

  const page = await browser.newPage()
  // await page.goto('https://harrypotter.fandom.com/wiki/Category:Wizards?from=Unidentified+Ravenclaw+black+girl+during+the+Battle+of+Hogwarts')
  await page.goto('https://harrypotter.fandom.com/wiki/Category:Wizards')

  try {
    // close cookie policy
    const getAcceptBtn = await page.$x('//div[contains(text(), "ACCEPT")]')
    await getAcceptBtn[0].click()
  } catch (e) {
    console.log('cookie policy already accepted!')
  }

  readThroughThePages: do {
    try {
      count = await page.$$eval('.category-page__member-link', el => el.length)
      console.log('count is: ' + count)
      for (let i = 0; i < count; i++) {
        const currentLink = await page.evaluate(el => el.href, (await page.$$('.category-page__member-link'))[i])
        console.log(currentLink)
        characterUrls.push(currentLink)
      }
    } catch (e) {
      console.error(e)
    }

    // turn a page
    try {
      await page.waitForSelector('.category-page__pagination-next')[0]
      await page.click('.category-page__pagination-next')[0]
    } catch (e) {
      console.log('"I open at the close!" (last page reached)')
      break readThroughThePages
    }
  } while (
    (await page.url()) === 'https://harrypotter.fandom.com/wiki/Category:Wizards?from=Wizard+who+claimed+to+be+a+dragon+killer'
  )

  fs.writeFileSync('dataCollectors/characterUrls.json', JSON.stringify(characterUrls))

  // collect characters
  for (const pageUrl of characterUrls) {
    try {
      await characterCollector(indexId, pageUrl, browserWSEndpoint)
      indexId++
      console.log(charactersObj)
    } catch (e) {
      console.error(e)
    }
  }

  fs.writeFileSync('dataCollectors/characters.json', JSON.stringify(charactersObj))

  await browser.close()
}
dataCollectors()
