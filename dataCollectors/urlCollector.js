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
const { wikiaUrlBase, browserWSEndpoint } = require('./dataCollectors')
const dUnderscore = new Date().toLocaleDateString().replace(/\//g, '_')
const timestamp = (Date.now() / 1000) | 0

let count // of links on a wiki page
let pageUrlString // of currently scraped wiki page

async function urlCollector(firstPagePath, lastPagePath, urlArray, jsonName) {
  const browser = await puppeteer.connect({ browserWSEndpoint })
  const page = await browser.newPage()

  // abort all images, source: https://github.com/GoogleChrome/puppeteer/blob/master/examples/block-images.js
  await page.setRequestInterception(true)
  page.on('request', request => {
    if (request.resourceType() === 'image') {
      request.abort()
    } else {
      request.continue()
    }
  })

  await page.goto(wikiaUrlBase + firstPagePath)
  readThroughThePages: do {
    try {
      await page.waitFor(3000)
      await page.waitForSelector('.category-page__member-link')
      pageUrlString = await page.url()
      count = await page.$$eval('.category-page__member-link', el => el.length)
      for (let i = 0; i < count; i++) {
        const currentLink = await page.evaluate(el => el.href, (await page.$$('.category-page__member-link'))[i])
        console.log(currentLink)
        urlArray.push(currentLink)
      }
    } catch (e) {
      console.error(e)
    }

    // turn a page
    try {
      await page.waitFor(2000)
      console.log(pageUrlString + '\n-----------')
      await page.waitForSelector('.category-page__pagination-next')
      await page.click('.category-page__pagination-next')[0]
    } catch (e) {
      console.error(e)
      console.log('"I open at the close!" (last page reached)')
      break readThroughThePages
    }
  } while (!pageUrlString.includes(wikiaUrlBase + firstPagePath + lastPagePath))

  // backup previous file
  if (fs.existsSync(`dataCollectors/${jsonName}Urls.json`)) {
    fs.renameSync(`dataCollectors/${jsonName}Urls.json`, `dataCollectors/${jsonName}Urls_${dUnderscore}_${timestamp}.json`)
    console.log(`renamed to ${jsonName}Urls_${dUnderscore}_${timestamp}.json`)
  }
  // write new file
  fs.writeFileSync(`dataCollectors/${jsonName}Urls.json`, JSON.stringify(urlArray))

  await page.goto('about:blank')
  await page.close()
  await browser.disconnect()
}

module.exports = urlCollector
