const puppeteer = require('puppeteer')
const fs = require('fs')

async function spellUrlCollector() {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  const spellUrls = []

  try {
    await page.goto('https://harrypotter.fandom.com/wiki/List_of_spells')
    await page.waitForSelector('h3 > .mw-headline > i > a')
    const count = await page.$$eval('h3 > .mw-headline > i > a', el => el.length)
    console.log(count)

    for (let i = 0; i < count; i++) {
      const spellUrl = await page.evaluate(el => el.href, (await page.$$('h3 > .mw-headline > i > a'))[i])
      spellUrls.push(spellUrl)
    }
  } catch (e) {
    console.error(e)
  }

  fs.writeFileSync('dataCollectors/spellUrls.json', JSON.stringify(spellUrls))
  await browser.close()
}
spellUrlCollector()
