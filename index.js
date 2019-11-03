const express = require('express'),
    setup = require('./api/setup'),
    app = express(),
    port = 3000,
    path = require('path');

// set app root
global.appRoot = path.resolve(__dirname);


app.use('/', express.static('site'))
app.use('/setup', express.static('app/setup'))
app.use('/select', express.static('app/select'))
app.use('/resources', express.static('resources'))

// setup api
app.use(express.json());
app.use('/api/setup', setup);

app.get('/', (req, res) => res.send(`<html>
    <head><title>Welcome to Respond</title></head>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,800&display=swap" rel="stylesheet">
    <link type="text/css" href="/resources/start.css" rel="stylesheet">
    <body>
        <p><img class="logo" src="/resources/respond-logo.svg"></p>
        <p>Thank you for building your site with Respond!  You can learn more about Respond at <a href="https://respondcms.com">respondcms.com</a>.</p>
        <p><a class="setup" href="setup">Setup your site now</a</p>
    </body>
</html>`))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
