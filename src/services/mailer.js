const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const {OAuth2} = google.auth;
const sendGridTransport = require('nodemailer-sendgrid-transport');
const configs = require('../configs/mailer');

/**
 usage:
 const mail = new Mailer('sendgrid');
 mail.sendMail(templateName,function(error,info){
    if(error) //error happen
    else success
 })

 template format:
 {
     from: '',
     to: '',
     subject: '',
     html: '',
 }
 */
class Mailer {
    constructor(type){
        //type(sendgrid or gmail)
        this.configs = configs[type];
        

    }

    async sendMail(template,callback){
        const accessToken = await this.getAccessToken();
        const transport = await this.createTransport(accessToken);

        return transport.sendMail(template,callback);
    }

    getAccessToken(){
        const {auth} = this.configs;
        const oauth2Client = new OAuth2(
            auth.clientId,
            auth.clientSecret,
            auth.authRedirect,
        )

        oauth2Client.setCredentials({
            refresh_token: auth.refreshToken,
        });
        return oauth2Client.getAccessToken();
    }

    async createTransport(accessToken){
        if(this.configs.TYPE == 'sendgrid'){
            return nodemailer.createTransport(sendGridTransport({
                auth:{
                    api_key : this.configs.API_KEY
                }
            }))
        }
        //else create gmail transporter
        const {auth} = this.configs;
        return nodemailer.createTransport({
            host: this.configs.MAIL_HOST,
            port: this.configs.MAIL_PORT,
            auth:{
                type: 'OAuth2',
                user : auth.user,
                clientId: auth.clientId,
                clientSecret: auth.clientSecret,
                refreshToken: auth.refreshToken,
                accessToken: accessToken,
            }
        })
    }
}

module.exports = Mailer;