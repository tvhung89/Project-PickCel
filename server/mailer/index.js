import hbs from 'nodemailer-express-handlebars'
import nodemailer from 'nodemailer'
import config from '../../config/config'

const smtpTransport = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    auth: {
        user: config.mail.user,
        pass: config.mail.password
    }
})

smtpTransport.use('compile', hbs({
    viewEngine: {
        extname: '.hbs',
        layoutsDir: 'server/mailer/templates/email/',
        defaultLayout : 'template',
        partialsDir : 'server/mailer/templates/partials/'
    },
    viewPath: 'server/mailer/templates/email/',
    extName: '.hbs'
}))

export default smtpTransport
