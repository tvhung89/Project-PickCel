const addUser = (user) => {
    const query = `INSERT INTO users(id, name, email, password) VALUES ('${user.id}', '${user.name}', '${user.email}', '${user.password}');SELECT id, name, email FROM temp_insert_users`

    return query
}

const getUser = (user, showPassword = false) => {
    const query = `SELECT id, name, email,phone_number, country_code, company_name, verify${showPassword ? ', password' : ''} FROM users WHERE ${user.id ? `id = '${user.id}'` : `email = '${user.email}'`}`

    return query
}

const updateUser = (user) => {
    user.verify = (user.verify === true) ? 1 : 0
    let query = `UPDATE users SET `

    if (user) {
        Object.keys(user).map(key => {
            const value = user[key]

            if (value && typeof value !== 'undefined' && value !== null && key !== 'id' && key !== 'email') {
                query += `${key} = ${typeof value === 'string' ? `'${value}'` : value}, `
            }
        })
        query = query.substr(0, query.length - 2)
        if (user.id) {
            query += ` WHERE id = '${user.id}'`
        }
        else {
            if (user.email) query += ` WHERE email = '${user.email}'`
        }
        query += `;SELECT id, name, email, company_name FROM temp_update_users`
    }

    return query
}

export default {
    addUser,
    getUser,
    updateUser
}