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
const charactersObj = require('./dataCollectorsWorks').charactersObj

// Uncle Bob Martin, please come & kill me!🧓
async function characterCollector(index, url, browserWSEndpoint) {
  let browser
  let page

  let idData = index
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
    constructor(
      id,
      name,
      birth,
      ancestry,
      gender,
      hairColor,
      eyeColor,
      wand,
      patronus,
      house,
      associatedGroups,
      booksFeaturedIn
    ) {
      this.id = id
      this.name = name
      this.birth = birth
      this.ancestry = ancestry
      this.gender = gender
      this.hair_color = hairColor
      this.eye_color = eyeColor
      this.wand = wand
      this.patronus = patronus
      this.house = house
      this.associated_groups = associatedGroups
      this.books_featured_in = booksFeaturedIn
    }
  }

  browser = await puppeteer.connect({ browserWSEndpoint })
  page = await browser.newPage()

  // abort all images, source: https://github.com/GoogleChrome/puppeteer/blob/master/examples/block-images.js
  await page.setRequestInterception(true)
  page.on('request', request => {
    if (request.resourceType() === 'image') {
      request.abort()
    } else {
      request.continue()
    }
  })

  await page.goto(url)
  /*
  try {
    // close cookie policy
    const getAcceptBtn = await page.$x('//div[contains(text(), "ACCEPT")]')
    await getAcceptBtn[0].click()
  } catch (e) {
    console.log('cookie policy already accepted!')
  }
*/
  // name of character
  nameData = await page.evaluate(el => el.innerText, (await page.$$('h1'))[0])

  // personal data
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
        associatedGroupsData = actualAsideText
          .split(/\n/)
          .map(el => el.replace(/\[\d+\]|\n/gm, ''))
          .filter(el => !/Loyalty/g.test(el)) // remove category header
        console.log(nameData + "'s associatedGroupsData is: " + associatedGroupsData)
        break
      default:
        console.log('this info is not collected!')
    }
  }

  // search for the featured books
  try {
    const searchForBooks = await page.evaluate(el => el.textContent, (await page.$$('html > body'))[0])
    let booksArray = searchForBooks.match(/(Appearances\n)([^%]*)(?=\nNotes and references)/gm)[0].split('\n')
    booksArray1 = booksArray
      .filter(el => /Harry Potter and the Philosopher\'s Stone/g.test(el))
      .filter(el => !/\s\(film\)|\s\(video game\)/g.test(el))
    if (booksArray1.length > 0) booksFeaturedInData.push(1)
    booksArray2 = booksArray
      .filter(el => /Harry Potter and the Chamber of Secrets/g.test(el))
      .filter(el => !/\s\(film\)|\s\(video game\)/g.test(el))
    if (booksArray2.length > 0) booksFeaturedInData.push(2)
    booksArray3 = booksArray
      .filter(el => /Harry Potter and the Prisoner of Azkaban/g.test(el))
      .filter(el => !/\s\(film\)|\s\(video game\)/g.test(el))
    if (booksArray3.length > 0) booksFeaturedInData.push(3)
    booksArray4 = booksArray
      .filter(el => /Harry Potter and the Goblet of Fire/g.test(el))
      .filter(el => !/\s\(film\)|\s\(video game\)/g.test(el))
    if (booksArray4.length > 0) booksFeaturedInData.push(4)
    booksArray5 = booksArray
      .filter(el => /Harry Potter and the Order of the Phoenix/g.test(el))
      .filter(el => !/\s\(film\)|\s\(video game\)/g.test(el))
    if (booksArray5.length > 0) booksFeaturedInData.push(5)
    booksArray6 = booksArray
      .filter(el => /Harry Potter and the Half-Blood Prince/g.test(el))
      .filter(el => !/\s\(film\)|\s\(video game\)/g.test(el))
    if (booksArray6.length > 0) booksFeaturedInData.push(6)
    booksArray7 = booksArray
      .filter(el => /Harry Potter and the Deathly Hallows/g.test(el))
      .filter(el => !/\s\(film\)|\s\(video game\)|\: Part 1|\: Part 2/g.test(el))
    if (booksArray7.length > 0) booksFeaturedInData.push(7)
  } catch (e) {
    console.error(e)
  }

  const actualCharacterData = new characterData(
    idData,
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
  if (booksFeaturedInData.length > 0) {
    charactersObj.push(actualCharacterData)
    console.log('passed validation: character is at least in one book')
  }

  await page.goto('about:blank')
  await page.close()
  await browser.disconnect()
}
characterCollector()

module.exports = characterCollector
