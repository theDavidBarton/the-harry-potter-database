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

async function potionCollector() {
  const browser = await puppeteer.launch()
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

  const potionsArray = []

  await page.goto('https://harrypotter.fandom.com/wiki/List_of_potions')

  const selector = '.tabbertab > ul > li'
  const potionLength = await page.$$eval(selector, el => el.length)

  for (let i = 0; i < potionLength - 1; i++) {
    try {
      const actualContent = await page.evaluate(el => el.innerText, (await page.$$(selector))[i])

      const actualName = actualContent
        .match(/^(.*?)\n/g)[0]
        .replace(/\t<img src="(.*)$|\[.*\]/gm, '')
        .trim()
      let actualDescription

      // in case of multiple lines
      if (actualContent.match(/\n(.*)$/gm).length > 1) {
        let actualContentArray = []
        for (let i = 0; i < actualContent.match(/\n(.*)$/gm).length - 1; i++) {
          let iteratee = actualContent
            .match(/\n(.*)$/gm)
            [i].replace(/\t<img src="(.*)$|\[.*\]/gm, '')
            .trim()

          actualContentArray.push(iteratee)
        }
        actualDescription = actualContentArray.join(' ').trim()
        // in case of one line
      } else {
        actualDescription = actualContent
          .match(/\n(.*)$/gm)[0]
          .replace(/\t<img src="(.*)$|\[.*\]/gm, '')
          .trim()
      }

      const actualObj = {
        id: i + 1,
        name: actualName,
        description: actualDescription
      }
      console.log(actualObj)
      potionsArray.push(actualObj)
    } catch (e) {
      console.error(e)
    }
  }

  fs.writeFileSync('dataCollectors/potions.json', JSON.stringify(potionsArray))
  await browser.close()
}
potionCollector()
