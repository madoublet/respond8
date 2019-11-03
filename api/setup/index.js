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
        file = '',
        source = '',
        content = '',
        page = ''

    // check to see if a site already exists before builiding a new site
    if (fs.existsSync(`${global.appRoot}/index.html`)) {
        res.status(400).send('A site already exists')
    }
    else {

        // create the site    
        try {

            // setup directories
            fse.ensureDirSync(`${global.appRoot}/site/`)
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

            // create about
            source = `${global.appRoot}/resources/site/placeholder/about.html`
            file = `${global.appRoot}/site/about.html`
            content = await fs.readFile('source', 'utf8')

            page = template
            page = common.replaceAll(page, '{{page.title}}', 'About');
            page = common.replaceAll(page, '{{page.description}}', 'Learn more about us.');
            page = common.replaceAll(page, '{{page.keywords}}', '');
            page = common.replaceAll(page, '{{page.image}}', '');
            page = common.replaceAll(page, '{{version}}', '1');
            page = common.replaceAll(page, '{{page.customHeader}}', '');
            page = common.replaceAll(page, '{{page.customFooter}}', '');
            page = common.replaceAll(page, '{{page.content}}', content);

            // write about
            console.log(`[app] writing ${file}`)
            await fs.writeFile(file, page)

            // create gallery
            source = `${global.appRoot}/resources/site/placeholder/gallery.html`
            file = `${global.appRoot}/site/gallery.html`
            content = await fs.readFile('source', 'utf8')

            page = template
            page = common.replaceAll(page, '{{page.title}}', 'Gallery');
            page = common.replaceAll(page, '{{page.description}}', 'View our photos');
            page = common.replaceAll(page, '{{page.keywords}}', '');
            page = common.replaceAll(page, '{{page.image}}', '');
            page = common.replaceAll(page, '{{version}}', '1');
            page = common.replaceAll(page, '{{page.customHeader}}', '');
            page = common.replaceAll(page, '{{page.customFooter}}', '');
            page = common.replaceAll(page, '{{page.content}}', content);

            // write gallery
            console.log(`[app] writing ${file}`)
            await fs.writeFile(file, page)

            // write default.html
            file = `${global.appRoot}/site/templates/default.html`
            console.log(`[app] writing ${file}`)
            await fs.writeFile(file, template)

            res.status(200).send('Site created successfully')

        }
        catch(e) {
            console.log(e);
            res.status(400).send('Error creating site')
        }
    }

})

module.exports = router