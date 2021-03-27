
const {
    genericError, 
    pageNotFound,
    errorLogger,
} = require('../middlewares/PageNotFound');

module.exports = function(app){
    // app.use('/',require('../routes/index'));
    app.use('/admin',require('../routes/admin'));
    // app.use('/auth', require('../routes/authentication'));
    app.use('/user',require('../routes/user'));
    // app.use('/article',require('../routes/article'));
    // app.use('/annotation',require('../routes/annotation'));
    // app.use('/consultation',require('../routes/consultation'));
    app.use(errorLogger);
    // app.use(genericError);
    app.use(pageNotFound);
}