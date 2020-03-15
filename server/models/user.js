import userUtils from '../utils/user'

class User {
    constructor(fields, encrypt = false) {
        this.id = fields.id
        this.name = fields.name
        this.email = fields.email
        this.password = fields.password
        this.verify = fields.verify
        this.company_name = fields.company_name
        this.country_code = fields.country_code
        this.phone_number = fields.phone_number

        if (encrypt) {
            this.encryptPassword()
        }
    }

    encryptPassword() {
        const salt = userUtils.generateSalt()
        const hash = userUtils.generateHash(salt, this.password)
        this.password = `${salt}$${hash}`
    }
}

export default User