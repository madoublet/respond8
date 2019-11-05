const express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    fsp = require('fs').promises,
    fse = require('fs-extra'),
    bcrypt = require('bcrypt'),
    path = require('path'),
    uglifycss = require('uglifycss'),
    common = require('../common.js')

/**
  * /api/setup
  * @param {Object} req - http://expressjs.com/api.html#req
  * @param {Object} res - http://expressjs.com/api.html#res
  * @param {Object} next - required for middleware
  */
router.post('/', async (req, res) => {

    let body = req.body,
        html = body.html

    res.status(200).send('Page saved successfully')

})

module.exports = router