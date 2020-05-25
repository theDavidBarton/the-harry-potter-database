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
const generalUrlCollector = require('./generalUrlCollector')

async function dataCollectors() {
  const browser = await puppeteer.launch({ headless: false })
  const browserWSEndpoint = await browser.wsEndpoint()
  // character wikia URL array:
  const characterUrls = await generalUrlCollector('https://harrypotter.fandom.com/wiki/Category:Wizards', browserWSEndpoint)
  console.log(characterUrls, browserWSEndpoint)

  for (const pageUrl of characterUrls) {
    try {
      console.log(pageUrl, browserWSEndpoint)
      // await characterCollector(pageUrl, browserWSEndpoint)
    } catch (e) {
      console.error(e)
    }
  }
  await browser.close()
}
dataCollectors()
