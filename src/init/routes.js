
const {
    genericError, 
    pageNotFound,
    errorLogger,
} = require('../middlewares/PageNotFound');

module.exports = function(app){
    app.use('/admin',require('../routes/admin'));
    app.use('/user',require('../routes/user'));
    app.use('/auth',require('../routes/authentication'));
    app.use(errorLogger);
    app.use(pageNotFound);
}