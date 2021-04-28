const cors = require('cors');
const helmet = require('helmet');
const passport 		= require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('../services/passport')(passport);// we configure passport

const corsConf = {
    origin: "*"
}

module.exports = function(app){
    app.use(helmet());
    app.use(cors(corsConf));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended:false})); //for application/x-www-form-urlencoded
    app.use(bodyParser.json());	// for application/json
    app.use(passport.initialize());
}

