// exports.mailerConfigs = {
//     CLIENT_ID       : 'somerandomids.apps.googleusercontent.com',
//     CLIENT_SECRET   : 'somehthinggooglegivesyou',
//     RF_TOKEN        : 'somerandomlongstring',
//     OAUTH_PG        : 'https://developers.google.com/oauthplayground',
//     MAIL_PORT       : '465',
//     MAIL_HOST       : 'smtp.gmail.com',
//     MAIL_USER       : 'youremail@gmail.com'
// }
module.exports = {
    'gmail': {
        TYPE: 'gmail',
        MAIL_PORT : '465',
        MAIL_HOST : 'smtp.gmail.com',
        auth: {
            type: 'OAuth2',
            user: 'senderemail@gmail.com', //sender email
            clientId       :'yourgoogleclientidfromgoogledevconsole.apps.googleusercontent.com',
            clientSecret   :'yourshortclientsecret',
            refreshToken   :'refreshtokenfromoauthplayground',
            authRedirect  :'https://developers.google.com/oauthplayground',
        }
    },
    'sendgrid': {
        TYPE:'sendgrid',
        API_KEY : ''
    }
}