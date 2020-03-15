import db from '../db/operations'
import userQueries from '../db/users'
import utils from '../utils'
import User from '../models/user';
import userUtils from '../utils/user'
import mailUtils from '../mailer/utils'
import config from '../../config/config'
import uuidv1 from "uuid/v1";

const addUser = (user) => {
    return new Promise((resolve, reject) => {
        if (!user.id) {
            user.id = uuidv1()
        }
        if (utils.check_properties_validity(user)) {
            const userObj = new User(user, true)
            db.exec_query(userQueries.getUser(userObj)).then(re => {
                const resObj = re

                if (resObj.success && resObj.data.rowCount > 0) {
                    reject({
                        success: false,
                        error: "Email already exists!"
                    })
                } else {
                    db.exec_query(userQueries.addUser(userObj)).then(response => {
                        const res = response
                        if (res.success && res.data.rowCount > 0) {
                            const userFetched = res.data.rows[0]
                            const token = userUtils.generatePasswordResetToken({userId: userFetched.id})
                            mailUtils.sendMail(userObj, 'email.body', 'Verify Account', {
                                email: user.email,
                                verifyUrl: `${config.baseUrl}/verify/${userFetched.id}/${token}`
                            }).then(() => {
                                resolve({
                                    success: true,
                                    user: userFetched
                                })
                            }).catch(error => {
                                reject(error)
                            })
                        } else {
                            reject({
                                success: false,
                                error: `Can't add user ${userObj.email}`
                            })
                        }
        
                    }).catch(error => {
                        reject({
                            success: false,
                            error
                        })
                    })
                }
            })
            
        } else {
            reject({
                success: false,
                error: "All fields are required!"
            })
        }
    })
}

const verifyUser = (user, isCheck = false, isVerifyTokenOnly = false) => {
    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(user)) {
            const userObj = new User(user)
            db.exec_query(userQueries.getUser(userObj, true)).then(response => {
                const res = response
                if (res.success && res.data.rowCount > 0) {
                    if (isVerifyTokenOnly) {
                        resolve({
                            success: true,
                            user: res.data.rows[0]
                        })
                    } else {
                        const userFetched = res.data.rows[0]
                        const passwordFetched = userFetched.password.split('$')
                        const salt = passwordFetched[0]
                        const hash = userUtils.generateHash(salt, userObj.password)

                        if (userFetched.verify) {
                            if (hash === passwordFetched[1]) {
                                if (isCheck) {
                                    delete userFetched.company_name
                                    resolve({
                                        success: true,
                                        user: userFetched
                                    })
                                } else {
                                    const tokens = userUtils.generateToken({userId: userFetched.id, email: userFetched.email})
                                    delete userFetched.password
    
                                    resolve({
                                        success: true,
                                        user: {
                                            ...userFetched,
                                            ...tokens
                                        }
                                    })
                                }
                            } else {
                                reject({
                                    success: false,
                                    error: "Invalid email or password!"
                                })
                            }
                        } else {
                            reject({
                                success: false,
                                error: "Please verify your email, then you can log in!"
                            })
                        }
                    }
                } else {
                    reject({
                        success: false,
                        error: "Invalid email or password!"
                    })
                }
            }).catch(error => {
                reject({
                    success: false,
                    error
                })
            })
        } else {
            reject({
                success: false,
                error: "Please provide email and password!"
            })
        }
    })
}

const getUser = (user, isSendMail = false) => {
    
    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(user)) {
            db.exec_query(userQueries.getUser(user)).then(response => {
                const res = response
                if (res.success && res.data.rowCount > 0) {
                    const userFetched = res.data.rows[0]
                    if (isSendMail) {
                        const token = userUtils.generatePasswordResetToken({userId: userFetched.id})
                        
                        mailUtils.sendMail(userFetched, 'reset.body', 'Reset password', {
                            email: userFetched.email,
                            url: `${config.baseUrl}/reset-password/${userFetched.id}/${token}`
                        }).then(() => {
                            resolve({
                                success: true,
                                user: userFetched
                            })
                        }).catch(error => {
                            reject(error)
                        })
                    } else {
                        resolve({
                            success: true,
                            user: userFetched
                        })
                    }
                    
                } else {
                    reject({
                        success: false,
                        error: "No email found!"
                    })
                }
            }).catch(error => {
                reject({
                    success: false,
                    error
                })
            })
        } else {
            reject({
                success: false,
                error: "No param found!"
            })
        }
    })
}

const verifyToken = (user, token, isVerifyTokenOnly = false) => {
    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(user)) {
            verifyUser(user, true, isVerifyTokenOnly).then(response => {
                const res = response
                if (res.success) {
                    const userObj = res.user
                    const userFetched = {
                        id: userObj.id,
                        email: userObj.email,
                        password: user.newPassword
                    }
                    const payload = userUtils.decodePasswordJWTToken(token)

                    if (payload.userId === userObj.id) {
                        resolve({
                            success: true,
                            userFetched
                        })
                    } else {
                        reject({
                            success: false,
                            error: "Token doesn't matched!"
                        })
                    }
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Wrong old password!"
                })
            })
        } else {
            reject({
                success: false,
                error: "No param found!"
            })
        }
    })
}

const verifyCredential = (user, token) => {
    return new Promise((resolve, reject) => {
        verifyToken(user, token).then(response => {
            const {userFetched} = response

            updateUser(userFetched, token).then(re => {
                const resObj = re
                if (resObj.success) {
                    resolve({
                        success: true,
                        user: resObj.user
                    })
                } else {
                    reject({
                        success: false,
                        error: "Can't update password!"
                    })
                }
            }).catch(error => {
                reject(error)
            })
        }).catch(error => reject(error))
    })
}

const updateUser = (user, token, isWelcome = false) => {
    return new Promise((resolve, reject) => {
        getUser(user).then(response => {
            const res = response
            
            if (res.success) {
                let userFetched = new User(user)
                if (user.password) userFetched.encryptPassword()

                const payload = userUtils.decodePasswordJWTToken(token)
                if (payload.userId.toString() === userFetched.id.toString()) {
                    db.exec_query(userQueries.updateUser(userFetched)).then(re => {
                        const resObj = re
                        if (resObj.success && resObj.data.rowCount > 0) {
                            const userObj = resObj.data.rows[0]
                            if (isWelcome) {
                                mailUtils.sendMail(userObj, 'welcome.body', 'Welcome to Pickcel', {
                                    email: userObj.email
                                }).then(() => {
                                    resolve({
                                        success: true,
                                        user: userObj
                                    })
                                }).catch(error => {
                                    reject(error)
                                })
                            } else {
                                resolve({
                                    success: true,
                                    user: userObj
                                })
                            }
                        } else {
                            reject({
                                success: false,
                                error: "Can't change user password!"
                            })
                        }
                    }).catch(error => {
                        reject({
                            success: false,
                            error
                        })
                    })
                } else {
                    reject({
                        success: false,
                        error: "Token doesn't matched!"
                    })
                }
            } else {
                reject({
                    success: false,
                    error: "No user found!"
                })
            }
        }).catch(error => reject(error))
    })
}

export default {
    addUser,
    verifyUser,
    getUser,
    verifyToken,
    verifyCredential,
    updateUser
}