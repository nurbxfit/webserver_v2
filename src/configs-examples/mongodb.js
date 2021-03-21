module.exports = () =>{
    const prod = {
        DB_NAME         : 'webserver',
        MONGO_HOST      : '127.0.0.1',
        MONGO_PORT      : '27017',
        MONGO_USERNAME  : 'webadmin',
        MONGO_PASSWORD  : 'something'
    }
    const dev = {
        DB_NAME         : 'devwebserver',
        MONGO_HOST      : '127.0.0.1',
        MONGO_PORT      : '27017',
        MONGO_USERNAME  : 'webadmin',
        MONGO_PASSWORD  : 'something'
    }
    return process.env.NODE_ENV === 'production' ? prod : dev;
}