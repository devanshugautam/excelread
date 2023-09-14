const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const { logger } = require('../utils/logger');
require('dotenv').config();

// local imports
const { globalErrors, routeNotFound } = require('../helpers/errorHandlers');

const LOG_ID = 'server/app';

// pre-routes
logger.info(LOG_ID, '~~~ setting up middlewares for app ~~~');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secureyes',
    resave: false,
    saveUninitialized: false
}));

// initilizing view engin for nodejs
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

// routes
require('../routes')(app);

//  error
app.use(routeNotFound);
app.use(globalErrors);

exports.app = app;
