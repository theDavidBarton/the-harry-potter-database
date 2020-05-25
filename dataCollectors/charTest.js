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

// Uncle Bob Martin, please come & kill me!🧓
async function characterCollector(url, charactersObj, browserWSEndpoint) {
  let browser
  let page
  charactersObj = []

  let nameData = null
  let birthData = null
  let ancestryData = null
  let genderData = null
  let hairColorData = null
  let eyeColorData = null
  let wandData = null
  let patronusData = null
  let houseData = null
  let associatedGroupsData = []
  let booksFeaturedInData = []
  // 🡦 for the parameters
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

  browser = await puppeteer.launch({ headless: false })
  page = await browser.newPage()
  await page.goto('https://harrypotter.fandom.com/wiki/Giffard_Abbott')

  try {
    // close cookie policy
    const getAcceptBtn = await page.$x('//div[contains(text(), "ACCEPT")]')
    await getAcceptBtn[0].click()
  } catch (e) {
    console.warning('cookie policy already accepted!')
  }

  nameData = await page.evaluate(el => el.innerText, (await page.$$('h1'))[0])
  const count = await page.$$eval('aside > section > div', el => el.length)
  console.log(nameData + "'s profile is being created " + count)
  for (let i = 0; i < count; i++) {
    const actualAsideText = await page.evaluate(el => el.innerText, (await page.$$('aside > section > div'))[i])
    switch (true) {
      case /Born/.test(actualAsideText):
        birthData = actualAsideText.match(/\n(.*)\n|\n(.*)/)[0].replace(/\[\d+\]|\n/gm, '')
        console.log(nameData + "'s birthData is: " + birthData)
        break
      case /Blood status/.test(actualAsideText):
        ancestryData = actualAsideText.match(/\n(.*)\n|\n(.*)/)[0].replace(/\[\d+\]|\n/gm, '')
        console.log(nameData + "'s ancestryData is: " + ancestryData)
        break
      case /Gender/.test(actualAsideText):
        genderData = actualAsideText.match(/\n(.*)\n|\n(.*)/)[0].replace(/\[\d+\]|\n/gm, '')
        console.log(nameData + "'s genderData is: " + genderData)
        break
      case /Hair colour/.test(actualAsideText):
        hairColorData = actualAsideText.match(/\n(.*)\n|\n(.*)/)[0].replace(/\[\d+\]|\n/gm, '')
        console.log(nameData + "'s hairColorData is: " + hairColorData)
        break
      case /Eye colour/.test(actualAsideText):
        eyeColorData = actualAsideText.match(/\n(.*)\n|\n(.*)/)[0].replace(/\[\d+\]|\n/gm, '')
        console.log(nameData + "'s eyeColorData is: " + eyeColorData)
        break
      case /Wand/.test(actualAsideText):
        wandData = actualAsideText.match(/\n(.*)\n|\n(.*)/)[0].replace(/\[\d+\]|\n/gm, '')
        console.log(nameData + "'s wandData is: " + wandData)
        break
      case /Patronus/.test(actualAsideText):
        patronusData = actualAsideText.match(/\n(.*)\n|\n(.*)/)[0].replace(/\[\d+\]|\n/gm, '')
        console.log(nameData + "'s patronusData is: " + patronusData)
        break
      case /House/.test(actualAsideText):
        houseData = actualAsideText.match(/\n(.*)\n|\n(.*)/)[0].replace(/\[\d+\]|\n/gm, '')
        console.log(nameData + "'s houseData is: " + houseData)
        break
      case /Loyalty/.test(actualAsideText):
        associatedGroupsData = actualAsideText.split(/\n/)
        console.log(nameData + "'s associatedGroupsData is: " + associatedGroupsData)
        break
      default:
        console.log('this info is not collected!')
    }
  }

  const actualCharacterData = new characterData(
    nameData,
    birthData,
    ancestryData,
    genderData,
    hairColorData,
    eyeColorData,
    wandData,
    patronusData,
    houseData,
    associatedGroupsData,
    booksFeaturedInData
  )
  console.log(actualCharacterData)
  charactersObj.push(actualCharacterData)

  await page.goto('about:blank')
  await page.close()
  await browser.disconnect()
}
characterCollector()

module.exports = characterCollector
