
const {
    genericError, 
    pageNotFound,
    errorLogger,
} = require('../middlewares/PageNotFound');

module.exports = function(app){
    // app.use('/',require('../routes/index'));
    // app.use('/role/',require('../routes/role'));
    // app.use('/auth', require('../routes/auth'));
    // app.use('/user',require('../routes/user'));
    // app.use('/article',require('../routes/article'));
    // app.use('/annotation',require('../routes/annotation'));
    // app.use('/consultation',require('../routes/consultation'));
    app.use('/main',(req,res,next)=>{
        return res.send('Main');
    })
    app.use('/redirect',(req,res,next)=>{
        return res.redirect('/redirected')
    })
    
    app.use('/redirected',(req,res,next)=>{
        return res.send('Redirected');
    })

    app.use('/error1',(req,res,next)=>{
        throw new Error('error');
    })
    app.use(errorLogger);
    app.use(genericError);
    app.use(pageNotFound);
}