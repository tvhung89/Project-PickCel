import userService from '../services/user'
import config from '../../config/config'

const register = (req, res, next) => {
    const user = req.body

    userService.addUser(user).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const login = (req, res, next) => {
    const user = req.body

    userService.verifyUser(user).then(response => {
        const isConfigureInHour = config.token_expiry.indexOf('h') > -1
        let options = {
            maxAge: (isConfigureInHour ? 1000 * 60 * 60 : 1000 * 60) * parseInt(config.token_expiry),
            httpOnly: false
        }

        res.cookie(config.access_token_key, response.user.access_token, options)
        res.cookie(config.x_site_token_key, response.user.x_site_key, options)

        delete response.user.access_token
        delete response.user.x_site_key
        
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const sendResetPasswordEmail = (req, res, next) => {
    const {email} = req.body

    userService.getUser({email}, true).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const getUser = (req, res, next) => {
    const {email} = req.body

    userService.getUser({email}).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}


const verifyCredential = (req, res, next) => {
    const user = req.body
    const token = req.cookies[config.access_token_key]
    const xSiteKey = req.cookies[config.x_site_token_key]

    if (token && decodeURIComponent(xSiteKey) === user.email) {
        userService.verifyCredential(user, token).then(response => {
            return res.json(response)
        }).catch(error => {
            return res.json(error)
        })
    } else {
        return res.json({
            success: false,
            error: "Can't verify your credential!"
        })
    }
}


const resetPassword = (req, res, next) => {
    const {user, token} = req.body

    userService.updateUser(user, token).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const verifyUser = (req, res, next) => {
    const {user, token} = req.body

    userService.updateUser(user, token).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const updateUserInfo = (req, res, next) => {
    const user = req.body
    const token = req.cookies[config.access_token_key]
    const xSiteKey = req.cookies[config.x_site_token_key]

    if (token && decodeURIComponent(xSiteKey) === user.email) {
        userService.updateUser(user, token, true).then(response => {
            return res.json(response)
        }).catch(error => {
            return res.json(error)
        })
    } else {
        return res.json({
            success: false,
            error: "Can't verify your credential!"
        })
    }
}

export default {
    register,
    login,
    getUser,
    verifyCredential,
    sendResetPasswordEmail,
    resetPassword,
    updateUserInfo,
    verifyUser
}