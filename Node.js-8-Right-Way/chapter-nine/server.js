'use strict';
const pkg = require('./package.json');
const {URL} = require('url');
const path = require('path');

// nconf configuration.
const nconf = require('nconf');
nconf
    .argv()
    .env('__')
    .defaults({'NODE_ENV': 'development'});

const NODE_ENV = nconf.get('NODE_ENV');
const isDev = NODE_ENV === 'development';
nconf
    .defaults({'conf': path.join(__dirname, `${NODE_ENV}.config.json`)})
    .file(nconf.get('conf'));

const serviceUrl = new URL(nconf.get('serviceUrl'));
const servicePort =
    serviceUrl.port || (serviceUrl.protocol === 'https:' ? 443 : 80);

// Express and middleware.
const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

// Serve webpack assets.
if (isDev) {
    const webpack = require('webpack');
    const webpackMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const webpackConfig = require('./webpack.config.js');
    webpackConfig.entry.app.unshift('webpack-hot-middleware/client?reload=true&timeout=1000');
    //Add HMR plugin
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    const compiler = webpack(webpackConfig);
    app.use(webpackMiddleware(compiler, {
        publicPath: '/',
        stats: {colors: true},
    }));
    app.use(webpackHotMiddleware(compiler));
} else {
    app.use(express.static('dist'));
}

const expressSession = require('express-session');
if (isDev) {
    const FileStore = require('session-file-store')(expressSession);
    app.use(expressSession({
        resave: false,
        saveUninitialized: true,
        secret: 'unguessable',
        store: new FileStore({}),
    }));
} else {
//
}

// Passport Authentication.
const passport = require('passport');
passport.serializeUser((profile, done) => done(null, {
    id: profile.id,
}));
passport.deserializeUser((user, done) => done(null, user));
app.use(passport.initialize({}));
app.use(passport.session({}));

app.get('/api/version', (req, res) => res.status(200).json(pkg.version));
app.get('/api/session', (req, res) => {
    const session = {auth: req.isAuthenticated()};
    res.status(200).json(session);
});
app.get('/auth/signout', (req, res) => {
    req.logout();
    res.redirect('/');
});
app.listen(servicePort, () => console.log('Ready.'));