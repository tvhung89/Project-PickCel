import path from "path";
import fs from 'fs'
import config from '../../config/config'

const jwt = require('jsonwebtoken');
const CURRENT_WORKING_DIR = process.cwd()

const getInfo = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(CURRENT_WORKING_DIR, '/keys/public.pem'), 'utf-8', function (err, public_key) {
            if (err) {
                reject({
                    success: false,
                    code: "PICK-000401",
                    message: 'Can not load public key'
                })
            } else {
                public_key = public_key.replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', '').replace(/(\r\n|\n|\r)/gm, '')
                const token = jwt.sign({access_token_key: config.access_token_key}, config.secret, {expiresIn: config.reset_password_token_expiry})

                resolve({
                    success: true,
                    code: "PICK-000000",
                    message: 'Successful',
                    result: {
                        public_key: public_key,
                        token: token
                    }
                })
            }
        });

    })
}

export default {
    getInfo
}