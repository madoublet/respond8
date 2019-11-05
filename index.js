const express = require('express'),
    session = require("express-session"),
    setup = require('./api/setup'),
    edit = require('./api/edit'),
    app = express(),
    port = 3000,
    path = require('path'),
    bcrypt = require('bcrypt'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    common = require('./api/common.js')

// set app root
global.appRoot = path.resolve(__dirname)

// setup passport (see https://github.com/passport/express-4.x-local-example/blob/master/server.js)
passport.use(new LocalStrategy(
    function(username, password, done) {

        console.log(`LocalStrategy username=${username} and password=${password}`)

        let email = username,
            user = common.findUser(email)

        console.log(user)

        if(user == null) return done(null, false, { message: 'Incorrect username' })
        else {
            if(bcrypt.compareSync(password, user.password) == true) return done(null, user)
            else return done(null, false, { message: 'Incorrect password' })
        }

    }))

passport.serializeUser(function(user, done) {
        done(null, user.email);
    })

passport.deserializeUser(function(email, done) {
        let user = common.findUser(email)
        done(null, user);
    })

app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// handle login post
app.post('/login',
  passport.authenticate('local', { successRedirect: '/edit?page=/index.html',
                                   failureRedirect: '/login?error' }));

// setup public ui routes
app.use('/', express.static('site'))
app.use('/setup', express.static('views/setup'))
app.use('/select', express.static('views/select'))
app.use('/login', express.static('views/login'))
app.use('/resources', express.static('resources'))

// authenticate 
var auth = function (req, res, next) {

    console.log('auth', req.isAuthenticated())

    if(req.isAuthenticated())next()
    else res.redirect('/login')
}

// setup auth ui routes
app.get('/edit', 
    auth,
    function(req, res) {
        res.sendFile(path.join(__dirname + '/views/edit/index.html'))
    })

// setup api routes
app.use(express.json())
app.use('/api/setup', setup)
app.use('/api/edit', edit)

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
