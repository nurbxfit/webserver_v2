const dbconfigs = require('../configs/mongodb')();

exports.mongoURL = process.env.NODE_ENV === 'production' ? 
`mongodb://${dbconfigs.MONGO_USERNAME}:${dbconfigs.MONGO_PASSWORD}@${dbconfigs.MONGO_HOST}:${dbconfigs.MONGO_PORT}/${dbconfigs.DB_NAME}` :
`mongodb://localhost:27017/${dbconfigs.DB_NAME}` ;


exports.MAILER = () =>{
    
}