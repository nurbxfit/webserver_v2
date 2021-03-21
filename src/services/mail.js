const mailer  = require('nodemailer');
const {google} = require('googleapis');
const {OAuth2} = google.auth;

class GmailerOAuth {
    constructor(configs){
        this.CLIENT_ID      = configs.CLIENT_ID;
        this.CLIENT_SECRET  = configs.CLIENT_SECRET;
        this.RF_TOKEN       = configs.RF_TOKEN;
        this.OAUTH_PG       = configs.OAUTH_PG;
        this.MAIL_PORT      = configs.MAIL_PORT || 465;
        this.MAIL_HOST      = configs.MAIL_HOST || 'smtp.gmail.com';

        this.oauth2Client   = new OAuth2(
            this.CLIENT_ID,
            this.CLIENT_SECRET,
            this.OAUTH_PG,
        )
    }
    
    sendMail(options,callback){
        this.oauth2Client.setCredentials({
            refresh_token: this.RF_TOKEN
        });
        const accessToken = this.oauth2Client.getAccessToken();
        const transporter = this.createTransport(accessToken);
        transporter.sendMail(options,callback);

    }

    createTransport(accessToken){
        return mailer.createTransport({
            host: this.MAIL_HOST,
            port: this.MAIL_PORT,
            auth: {
                type: 'OAuth2',
                clientId: this.CLIENT_ID,
                clientSecret : this.CLIENT_SECRET,
                refreshToken : this.RF_TOKEN,
                accessToken : accessToken,
            }
        });
    }
}

module.exports = GmailerOAuth;