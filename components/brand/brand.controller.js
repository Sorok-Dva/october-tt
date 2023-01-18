const { validationResult } = require('express-validator')
const httpStatus = require('http-status')
const puppeteer = require('puppeteer')
const { BackError } = require(`../../helpers/back.error`)
const puppeteerOpts = require('../../middlewares/puppeteer').options

const Brand = {}

/**
 * Search a brand phone number on Google
 * @param req
 * @param res
 * @param next
 * @returns res.send
 */
Brand.Search = async (req, res, next) => {
  const errors = validationResult(req);
  let { brand } = req.body;

  const isSiren = brand.match(/(\d{9}|\d{3}[ ]\d{3}[ ]\d{3})/g)
  let phone = 'unknown'

  if (!errors.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).send({ body: req.body, errors: errors.array() });
  }

  try {
    const google = {
      browser: null,
      page: null,
      url: 'https://www.google.com/search?q=' + brand,
      close: async () => {
        if (!google.browser) return true
        await google.browser.close().then(async () => {
          google.browser = null
          console.log(`Scrap finished for ${google.url}`)
          return res.status(200).json({ phone })
        })
      },
      init: async () => {
        try {
          google.browser = await puppeteer.launch(puppeteerOpts)
          google.page = await google.browser.newPage()
          await google.page.setDefaultNavigationTimeout(10000)
          await google.page.setViewport({ width: 1900, height: 1000, deviceScaleFactor: 1 })

          await google.page.goto(google.url, { waitUntil: 'networkidle2' })

          const title = await google.page.title()
          console.log(title)
          const [button] = await google.page.$x("//button[contains(., 'Tout accepter')]");
          if (button) {
            await button.click();
          }
          if (isSiren) {
            await google.retrieveBrandNameBySiren()
          } else {
            await google.searchBrandName()
          }
        } catch (e) {
          next(e)
        } finally {
          await google.close()
        }
      },
      retrieveBrandNameBySiren: async () => {
        google.url = `https://www.societe.com/cgi-bin/search?champs=${brand}`
        await google.page.goto(google.url, { waitUntil: 'networkidle2' })
        await google.page.waitForSelector('.ResultBloc__link__content').catch(e =>  {
          return res.status(400).json({ error: 'Brand doesnt exists' })
        })
        // eslint-disable-next-line no-undef
        const brandName = await google.page.evaluate(() => document.getElementsByClassName('deno')[0].textContent)
        google.url = `https://www.google.com/search?q=${brandName}`
        await google.page.goto(google.url, { waitUntil: 'networkidle2' })
        await google.searchBrandName()
      },
      searchBrandName: async () => {
        await google.page.waitForXPath('//span[contains(@aria-label, "Appeler le")]').catch(e =>  {
          return res.status(400).json({ error: 'Phone is unavailable' })
        })
        // eslint-disable-next-line no-undef
        phone = await google.page.evaluate(() => document.querySelector('[data-dtype="d3ph"]').text)
      }
    }

    await google.init()
  } catch (error) {
    next(new BackError(error))
  }
}

module.exports = Brand
