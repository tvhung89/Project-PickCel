import smtpTransport from './index'
import config from '../../config/config'

const sendMail = (user, template, subject, context) => {
    return new Promise((resolve, reject) => {
        const data = {
            to: user.email,
            from: config.mail.user,
            template,
            subject,
            context
        }
        
        smtpTransport.sendMail(data, function(err) {
            if (!err) {
                resolve({ 
                    success: true,
                    message: 'Kindly check your email for further instructions'
                });
            } else {
                reject({
                    success: false,
                    message: "Can't send email!"
                })
            }
        });
    })
}

export default {
    sendMail
}