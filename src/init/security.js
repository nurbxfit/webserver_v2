const cors = require('cors');
const helmet = require('helmet');
const passport 		= require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const session = require('express-session');
// const secret = require('../configs/secret');
require('../services/passport')(passport);// we configure passport

const corsConf = {
    origin: "*"
}

module.exports = function(app){
    app.use(helmet());
    app.use(cors(corsConf));
    app.use(cookieParser());
    // app.use(session({
    //     secret: secret['cookieSecret'],
    //     resave: true,
    //     saveUninitialized: true,
    //     cookie: {
    //         secure: 'auto',
    //     }
    // }))
    app.use(bodyParser.urlencoded({extended:false})); //for application/x-www-form-urlencoded
    app.use(bodyParser.json());	// for application/json
    app.use(passport.initialize());
    // app.use(passport.session());
}

