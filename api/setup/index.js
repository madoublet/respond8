const express = require('express'),
    router = express.Router(),
    fs = require('fs').promises,
    fse = require('fs-extra'),
    path = require('path'),
    common = require('../common.js')

/**
  * /api/setup
  * const file = await fs.readFile('filename.txt', 'utf8')
  * await fs.writeFile('filename.txt', 'test')
  * @param {Object} req - http://expressjs.com/api.html#req
  * @param {Object} res - http://expressjs.com/api.html#res
  * @param {Object} next - required for middleware
  */
router.post('/', async (req, res) => {

    let body = req.body,
        html = body.html,
        template = body.template,
        variables = body.variables,
        json = body.json,
        editorHTML = body.editorHTML,
        file = ''

    // create the site    
    try {

        // setup directories
        fse.ensureDirSync(`${global.appRoot}/site/data/`)
        fse.ensureDirSync(`${global.appRoot}/site/templates/`)
        fse.ensureDirSync(`${global.appRoot}/site/css/`)

        // copy css
        fse.copySync(`${global.appRoot}/resources/select/css`, `${global.appRoot}/site/css`)

        // write builder.json
        file = `${global.appRoot}/site/data/builder.json`
        console.log(`[app] writing ${file}`)
        await fs.writeFile(file, JSON.stringify({
                                        'json': json,
                                        'variables': variables,
                                        'html': html,
                                        'editorHTML': editorHTML
                                    }))
        
        // write index.html
        file = `${global.appRoot}/site/index.html`
        console.log(`[app] writing ${file}`)
        await fs.writeFile(file, html)

        // write default.html
        file = `${global.appRoot}/site/templates/default.html`
        console.log(`[app] writing ${file}`)
        await fs.writeFile(file, template)

    }
    catch(e) {
        console.log(e);
        res.status(400).send('Error creating site')
    }

})

module.exports = router