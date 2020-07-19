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

async function dataCollectors() {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  // close cookie policy
  try {
    await page.goto('https://harrypotter.fandom.com/wiki/')
    await page.waitFor(7000)
    const getAcceptBtn = await page.$x('//div[contains(text(), "ACCEPT")]')
    await getAcceptBtn[0].click()
  } catch (e) {
    console.error(e)
    console.log('it wont work like this!')
    process.exit(0)
  }

  await page.goto('https://harrypotter.fandom.com/wiki/List_of_spells')

  const count = await page.$$eval('h3 + dl, h3 + figure + dl', el => el.length)
  for (let i = 0; i < 2; i++) {
    const name = await page.evaluate(
      el => window.getComputedStyle(el).previousSibling.previousSibling.innerText,
      (await page.$$('h3 + dl, h3 + figure + dl'))[0]
    )
    const content = await page.evaluate(el => el.innerText, (await page.$$('h3 + dl, h3 + figure + dl'))[0])
    console.log(name, content)
  }
  await browser.close()
}
dataCollectors()
