const express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    cheerio = require('cheerio'),
    common = require('../common.js')

/**
  * /api/page/save
  * @param {Object} req - http://expressjs.com/api.html#req
  * @param {Object} res - http://expressjs.com/api.html#res
  * @param {Object} next - required for middleware
  */
router.post('/save', async (req, res) => {

    let body = req.body,
        content = body.html,
        page = body.page,
        template = 'default'

    console.log('[debug] save', req.body)

    try {

        // get existing page
        let html = fs.readFileSync(`${global.appRoot}/site${page}`, 'utf8')

        // load html
        let $ = cheerio.load(html)

        // replace main
        $('[role="main"]').html(content)

        // save file
        fs.writeFileSync(`${global.appRoot}/site${page}`, $.html(), 'utf8')
        
        // send 200       
        res.status(200).send('Page saved successfully')

    }
    catch(e) {
        res.status(400).send('There was an error saving the page')
    }

})

module.exports = router