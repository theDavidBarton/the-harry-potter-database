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

async function spellCollector() {
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

  const spellsArray = []

  await page.goto('https://harrypotter.fandom.com/wiki/List_of_spells')

  const selector = 'h3 + dl, h3 + figure + dl, h3 + figure + table, h3 + table, h3 + figure + dl + p + dl'
  const spellLength = await page.$$eval(selector, el => el.length)

  for (let i = 0; i < spellLength - 1; i++) {
    try {
      // should be h3 = HTMLHeadingElement
      const actualHeadingFinder = await page.evaluate(
        el => el.previousSibling.previousSibling.toString(),
        (await page.$$(selector))[i]
      )
      let actualHeading
      let actualOtherName = null
      if (actualHeadingFinder === '[object HTMLHeadingElement]') {
        actualHeading = await page.evaluate(
          el => el.previousSibling.previousElementSibling.innerText,
          (await page.$$(selector))[i]
        )
      } else {
        actualHeading = await page.evaluate(
          el => el.previousSibling.previousSibling.previousElementSibling.innerText,
          (await page.$$(selector))[i]
        )
      }
      if (actualHeading.includes('(')) {
        actualOtherName = actualHeading.match(/\(.*\)/g)
          ? actualHeading
              .match(/\(.*\)/g)[0]
              .replace(/\(|\)/g, '')
              .trim()
          : null
        actualHeading = actualHeading.match(/^.*?.\(/g)
          ? actualHeading
              .match(/^.*?.\(/g)[0]
              .replace(/\(|\)/g, '')
              .trim()
          : null
        if (actualHeading === null) {
          actualHeading = actualOtherName
          actualOtherName = null
        }
      }

      const actualContent = await page.evaluate(el => el.innerText, (await page.$$(selector))[i])

      const actualPronunciation = actualContent.match(/Pronunciation:(.*?)\n/g)
        ? actualContent
            .match(/Pronunciation:(.*?)\n/g)[0]
            .replace(/Pronunciation:|\n|\[.*\]/g, '')
            .trim()
        : null
      const actualSpellType = actualContent.match(/Type:(.*?)\n/g)
        ? actualContent
            .match(/Type:(.*?)\n/g)[0]
            .replace(/Type:|\n|\[.*\]/g, '')
            .trim()
        : null
      const actualDescription = actualContent.match(/Description:(.*?)\n/g)
        ? actualContent
            .match(/Description:(.*?)\n/g)[0]
            .replace(/Description:|\n|\[.*\]/g, '')
            .trim()
        : null
      const actualMention = actualContent.match(/Seen\/Mentioned:(.*?)\n/g)
        ? actualContent
            .match(/Seen\/Mentioned:(.*?)\n/g)[0]
            .replace(/Seen\/Mentioned:|\n|\[.*\]/g, '')
            .trim()
        : null
      const actualEtymology = actualContent.match(/Etymology:(.*?)\n/g)
        ? actualContent
            .match(/Etymology:(.*?)\n/g)[0]
            .replace(/Etymology:|\n|\[.*\]/g, '')
            .trim()
        : null
      const actualNote = actualContent.match(/Notes:(.*?)\n/g)
        ? actualContent
            .match(/Notes:(.*?)\n/g)[0]
            .replace(/Notes:|\n|\[.*\]/g, '')
            .trim()
        : null

      const actualObj = {
        id: i + 1,
        name: actualHeading,
        other_name: actualOtherName,
        pronunciation: actualPronunciation,
        spell_type: actualSpellType,
        description: actualDescription,
        mention: actualMention,
        etymology: actualEtymology,
        note: actualNote
      }
      console.log(actualObj)
      spellsArray.push(actualObj)
    } catch (e) {
      console.error(e)
    }
  }

  fs.writeFileSync('dataCollectors/spells.json', JSON.stringify(spellsArray))
  await browser.close()
}
spellCollector()
