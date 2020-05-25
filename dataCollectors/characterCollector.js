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
const { charactersObj } = require('./dataCollectorsWorks')

async function characterCollector(url, browserWSEndpoint) {
  let browser
  let page

  class characterData {
    constructor(name, birth, ancestry, gender, hairColor, eyeColor, wand, patronus, house, associatedGroups, booksFeaturedIn) {
      this.name = name
      this.birth = birth
      this.ancestry = ancestry
      this.gender = gender
      this.hairColor = hairColor
      this.eyeColor = eyeColor
      this.wand = wand
      this.patronus = patronus
      this.house = house
      this.associatedGroups = associatedGroups
      this.booksFeaturedIn = booksFeaturedIn
    }
  }

  try {
    browser = await puppeteer.connect({ browserWSEndpoint })
    page = await browser.newPage()
    await page.goto(url)

    const count = await page.$$eval('aside > section > div', el => el.length)
    for (let i = 0; i < count; i++) {
      console.log(await page.evaluate(el => el.innerText, (await page.$$('aside > section > div'))[i]))
    }

    const actualCharacterData = new characterData()
    charactersObj.push(actualCharacterData)
  } catch (e) {
    console.error(e)
  }

  await page.goto('about:blank')
  await page.close()
  await browser.disconnect()
  return characterData
}

module.exports = characterCollector
