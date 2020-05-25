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

async function generalUrlCollector(url, browserWSEndpoint) {
  let links = []
  let browser
  let page

  try {
    browser = await puppeteer.connect({ browserWSEndpoint })
    page = await browser.newPage()
    await page.goto(url)

    const count = await page.$$eval('.category-page__member-link', el => el.length)
    for (let i = 0; i < count; i++) {
      console.log(i)
      const currentLink = await page.evaluate(el => el.href, (await page.$('.category-page__member-link'))[i])
      console.log(currentLink)
      links.push(currentLink)
    }
  } catch (e) {
    console.error(e)
  }

  await page.goto('about:blank')
  await page.close()
  await browser.disconnect()
  return links
}

module.exports = generalUrlCollector
