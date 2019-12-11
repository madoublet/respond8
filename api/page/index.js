const express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    fse = require('fs-extra'),
    cheerio = require('cheerio'),
    common = require('../common.js')

/**
  * /api/page/save
  * @param {Object} req - http://expressjs.com/api.html#req
  * @param {Object} res - http://expressjs.com/api.html#res
  * @param {Object} next - required for middleware
  */
router.post('/save', async (req, res) => {

    // auth
    if(!req.user) {
        res.status(400).send('Not authenticated')
        return
    }

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
        console.log(e)
        res.status(400).send('There was an error saving the page')
    }

})

/**
  * /api/page/list
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

        // get json
        let json = fs.readFileSync(`${global.appRoot}/site/data/pages.json`, 'utf8')
        
        // send 200       
        res.setHeader('Content-Type', 'application/json')
        res.status(200).send(json)

    }
    catch(e) {
        res.status(400).send('There was an error saving the page')
    }

})

/**
  * /api/page/retrieve
  * @param {Object} req - http://expressjs.com/api.html#req
  * @param {Object} res - http://expressjs.com/api.html#res
  * @param {Object} next - required for middleware
  */
 router.post('/retrieve', async (req, res) => {

    // auth
    if(!req.user) {
        res.status(400).send('Not authenticated')
        return
    }

    let body = req.body,
        url = body.url

    console.log('[debug] list', req.body)

    try {

        // get json
        let json = fs.readFileSync(`${global.appRoot}/site/data/pages.json`, 'utf8'),
            objs = JSON.parse(json)

        for(let x=0; x<objs.length; x++) {
            if(objs[x].url == url) {
                // send 200       
                res.setHeader('Content-Type', 'application/json')
                res.status(200).send(JSON.stringify(objs[x]))
            }
        }
        
        res.status(400).send('No page found')

    }
    catch(e) {
        res.status(400).send('There was an error saving the page')
    }

})

/**
  * /api/page/elements.list
  * @param {Object} req - http://expressjs.com/api.html#req
  * @param {Object} res - http://expressjs.com/api.html#res
  * @param {Object} next - required for middleware
  */
 router.get('/elements/list', async (req, res) => {

    // auth
    if(!req.user) {
        res.status(400).send('Not authenticated')
        return
    }

    let body = req.body

    console.log('[debug] list elemenets', req.body)

    try {

        // get json
        let json = fs.readFileSync(`${global.appRoot}/site/data/elements.json`, 'utf8')
        
        // send 200       
        res.setHeader('Content-Type', 'application/json')
        res.status(200).send(json)

    }
    catch(e) {
        res.status(400).send('There was an error saving the page')
    }

})

/**
  * /api/page/add
  * @param {Object} req - http://expressjs.com/api.html#req
  * @param {Object} res - http://expressjs.com/api.html#res
  * @param {Object} next - required for middleware
  */
 router.post('/add', async (req, res) => {

    // auth
    if(!req.user) {
        res.status(400).send('Not authenticated')
        return
    }

    let user = common.findUser(req.user.email),
        firstName = "Default",
        lastName = "User"

    // set first and last name
    if(user.firstName) firstName = user.firstName
    if(user.lastName) lastName = user.lastName

    console.log('[debug] user', req.user)

    let body = req.body,
        name = body.name,
        url = body.url,
        type = body.type,
        description = body.description,
        template = 'default',
        parts = url.split('/'),
        base = ''

    // clear leading slash
    if (url.charAt(0) == "/") url = url.substr(1)

    // remove file extension
    if(url.indexOf('.htm') != -1) url = url.split('.').slice(0, -1).join('.')
    
    // add html extension
    url = url += '.html'

    // setup the base
    if(parts.length > 1) {
        for(let x=1; x<parts.length; x++) {
            base += '../';
        }
    }

    console.log('[debug] save', req.body)

    try {

        // get json
        let json = fs.readFileSync(`${global.appRoot}/site/data/pages.json`, 'utf8')

        // read json
        let pages = JSON.parse(json)

        // check to see if page exists
        for(let x=0; x<pages.length; x++) {
            if(pages[x].url == url) {
                res.status(400).send('Page already exists')
                return
            }
        }

        // push page
        pages.push({
            "name": name,
            "description": description,
            "url": url,
            "template": template,
            "text": "",
            "keywords": "",
            "tags": "",
            "image": "",
            "location": "",
            "language": "",
            "direction": "",
            "firstName": firstName,
            "lastName": lastName,
            "lastModifiedBy": firstName + ' ' + lastName,
            "lastModifiedDate": (new Date()).toUTCString(),
            "customHeader": "",
            "customFooter": ""
        })

        // retrieve template
        let html = fs.readFileSync(`${global.appRoot}/site/templates/${template}.html`, 'utf8')

        // retrieve content
        let content = fs.readFileSync(`${global.appRoot}/site/layouts/${type}.html`, 'utf8')

        // replace all meta data
        html = html.replace(/{{page.content}}/g, content)
        html = html.replace(/{{page.title}}/g, name)
        html = html.replace(/{{page.name}}/g, name)
        html = html.replace(/{{page.url}}/g, url)
        html = html.replace(/{{page.description}}/g, description)
        html = html.replace(/{{page.keywords}}/g, '')
        html = html.replace(/{{page.tags}}/g, '')
        html = html.replace(/{{page.image}}/g, '')
        html = html.replace(/{{page.location}}/g, '')
        html = html.replace(/{{page.language}}/g, 'en')
        html = html.replace(/{{page.direction}}/g, 'ltr')
        html = html.replace(/{{page.firstName}}/g, firstName)
        html = html.replace(/{{page.lastName}}/g, lastName)
        html = html.replace(/{{page.lastModifiedBy}}/g, firstName + ' ' + lastName)
        html = html.replace(/{{page.lastModifiedDate}}/g, (new Date()).toUTCString())
        html = html.replace(/{{page.customHeader}}/g, '')
        html = html.replace(/{{page.customFooter}}/g, '')
        html = html.replace(/{{version}}/g, Date.now())

        let $ = cheerio.load(html);

        // set base value
        $('base').attr('href', base);
        
        // save content
        html = $.html();

        // get directory
        let dir = url.substring(0, url.lastIndexOf("/")+1)

        console.log('[debug] directory', `${global.appRoot}/site/${dir}`)

        // make sure it exists
        fse.ensureDirSync(`${global.appRoot}/site/${dir}`)

        console.log('[debug] file', `${global.appRoot}/site/${url}`)

        // save html file
        fs.writeFileSync(`${global.appRoot}/site/${url}`, html, 'utf8')

        // save json file
        fs.writeFileSync(`${global.appRoot}/site/data/pages.json`, JSON.stringify(pages), 'utf8')
        
        // send 200       
        res.setHeader('Content-Type', 'application/json')
        res.status(200).send('Ok')

    }
    catch(e) {
        console.log(e)
        res.status(400).send('There was an error saving the page')
    }

})

module.exports = router