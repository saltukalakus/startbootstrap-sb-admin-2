var express = require('express'),
    config = require('./config'),
    passport = require('passport'),
    flash = require('connect-flash'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    swig = require('swig'),
    session = require('express-session'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    session      = require('express-session'),
    dbConf       = require('./config/database.js');

require('./mwconf/passport')(passport); // pass passport for configuration

// configuration ===============================================================
mongoose.connect(dbConf.url); // connect to our database

var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', swig.renderFile);
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());


app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.appSettings.cryptoKey
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions



app.use(flash());

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/../public'));

//setup routes
require('./routes')(app, passport);

var port = Number(process.env.PORT || 3000);

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
});