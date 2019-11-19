const express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    fse = require('fs-extra'),
    cheerio = require('cheerio'),
    common = require('../common.js')

/**
  * /api/image/upload
  * @param {Object} req - http://expressjs.com/api.html#req
  * @param {Object} res - http://expressjs.com/api.html#res
  * @param {Object} next - required for middleware
  */
router.post('/upload', async (req, res) => {

    // auth
    if(!req.user) {
        res.status(400).send('Not authenticated')
        return
    }

    let name = req.body.name,
        size = req.body.size,
        type = req.body.type,
        blob = req.body.blob

    console.log(`[debug] upload name=${name}, size=${size}, type=${type}`)
    console.log(blob)

    try {

        // make sure the directory is there
        fse.ensureDirSync(`${global.appRoot}/site/images/`)

        // strip off the data: url prefix to get just the base64-encoded bytes
        let index = blob.indexOf('base64,'),
            data = blob.substring(index+7, blob.length-1)
            buffer = new Buffer(data, 'base64'),
            image = `${global.appRoot}/site/images/${name}`

        console.log('data')
        console.log(data)

        fs.writeFileSync(image, buffer)

        // send 200       
        res.status(200).send('Image uploaded successfully')

    }
    catch(e) {
        console.log(e)
        res.status(400).send('There was an error saving the image')
    }

})

/**
  * /api/image/list
  * @param {Object} req - http://expressjs.com/api.html#req
  * @param {Object} res - http://expressjs.com/api.html#res
  * @param {Object} next - required for middleware
  */
 router.get('/list', async (req, res) => {

    // auth
    if(!req.user) {
        res.status(400).send('Not authenticated')
        return
    }

    let body = req.body

    console.log('[debug] list', req.body)

    try {

        let files = fs.readdirSync(`${global.appRoot}/site/images/`), json = []

        for(x=0; x<files.length; x++) {

            // get stats for file
            let stats = fs.statSync(`${global.appRoot}/site/images/${files[x]}`)

            json.push({
                name: files[x],
                url: `images/${files[x]}`,
                preview: `/images/${files[x]}`,
                size: stats.size,
                dt: stats.birthtimeMs,
                dtFriendly: stats.birthtime
            })
        }
        
        // send 200       
        res.setHeader('Content-Type', 'application/json')
        res.status(200).send(json)

    }
    catch(e) {
        res.status(400).send('There was an error listing the image')
    }

})

module.exports = router