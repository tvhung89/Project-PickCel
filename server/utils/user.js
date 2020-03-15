import config from '../../config/config'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const generateSalt = () => {
    return crypto.randomBytes(16).toString('base64')
}

const generateHash = (salt, payload) => {
    return crypto.createHmac('sha512', salt)
            .update(payload).digest('base64')
}

const generateToken = (payload) => {
    try {
        const token = jwt.sign(payload, config.secret, {
            expiresIn: config.token_expiry
        })

        return {
            access_token: token,
            x_site_key: payload.email
        }
    } catch(error) {
        return null
    }
}

const generatePasswordResetToken = (payload) => {
    try {
        const token = jwt.sign(payload, config.reset_password_secret, {
            expiresIn: config.reset_password_token_expiry
        })

        return token
    } catch(error) {
        return null
    }
}

const validJWTNeeded = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            const authorization = req.headers['authorization'].split(' ')
            if (authorization[0] != 'PJWT') {
                return res.sendStatus(401)
            } else {
                req.jwt = jwt.verify(authorization[1], config.secret)

                if (req.headers['x-site-key'] === req.jwt.email) return next()
                else return res.sendStatus(403)
            }
        } catch (error) {
            return res.sendStatus(403) 
        }
    } else {
        return res.sendStatus(401)
    }
}

const decodePasswordJWTToken = (token) => {
    return jwt.decode(token, config.reset_password_secret)
}

export default {
    generateSalt,
    generateHash,
    generateToken,
    generatePasswordResetToken,
    validJWTNeeded,
    decodePasswordJWTToken
}