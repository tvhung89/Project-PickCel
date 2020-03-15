import pool from '.'

const get_wrapped_char = (field) => {
    const keywords = ['left', 'key', 'value', 'name']
    const extChar = keywords.includes(field) ? '`' : ''

    return `${extChar}${field}${extChar}`
}

const build_insert_query = (table, fields, is_id = false) => {
    let fields_str = ''
    let values_str = ''
    let query = `INSERT INTO ${table}(`

    Object.keys(fields).forEach(field => {
        if (is_id || field != 'id') {
            fields_str += `${get_wrapped_char(field)},`
            values_str += typeof fields[field] == 'string' ? `'${fields[field]}',` : `${fields[field]},`
        }
    })

    query += (fields_str.substr(0, fields_str.length - 1) + `) VALUES (` + values_str.substr(0, values_str.length - 1) + ')')
    query += `;SELECT * FROM temp_insert_${table}`

    return query
}

const build_update_query = (table, keys, fields, isNull = false) => {
    let keys_str = ''
    let values_str = ''
    let query = `UPDATE ${table} SET `
    let keyNames = Object.keys(keys)

    Object.keys(fields).forEach(field => {
        if (field != 'id') {
            values_str += typeof fields[field] == 'string' ? `${get_wrapped_char(field)} = ${isNull ? 'NULL' : `'${fields[field]}'`},` : `${get_wrapped_char(field)} = ${isNull ? 'NULL' : fields[field]},`
        }
    })

    query += values_str.substr(0, values_str.length - 1) + ` WHERE `

    keyNames.forEach(field => {
        keys_str += typeof keys[field] == 'string' ? `${field} = '${keys[field]}'` : `${field} = ${keys[field]}`
        keys_str += ' AND '
    })
    query += keys_str
    query = query.substr(0, query.length - 5)
    query += `;SELECT * FROM temp_update_${table}`

    return query
}

const build_select_query = (table, wheres = null, accept_null = false, not_equal_wheres = null) => {
    let query = `SELECT * FROM ${table}`

    if (wheres) {
        let keys_str = ''
        query += ' WHERE '
        if (accept_null) {
            Object.keys(wheres).forEach(field => {
                keys_str += `${field} IS NULL`
                keys_str += ' AND '
            })
        }  else {
            Object.keys(wheres).forEach(field => {
                if(field === 'key'){
                    keys_str += '`key` = '+ `'${wheres[field]}'`
                } else
                keys_str += typeof wheres[field] == 'string' ? `${field} = '${wheres[field]}'` : `${field} = ${wheres[field]}`
                keys_str += ' AND '
            })
        }

        if (not_equal_wheres) {
            Object.keys(not_equal_wheres).forEach(field => {
                keys_str += typeof not_equal_wheres[field] == 'string' ? `${field} != '${not_equal_wheres[field]}'` : `${field} != ${not_equal_wheres[field]}`
                keys_str += ' AND '
            })
        }

        query += keys_str
        query = query.substr(0, query.length - 5)
    }

    return query
}

const build_join_query = (table, table_join, wheres = null) => {
    let query = `SELECT ${table}.id, ${table}.name FROM ${table}`

    if (wheres) {
        let keys_str = ''

        Object.keys(table_join).forEach(field => {
            keys_str += ' JOIN '
            keys_str += `${field}`
            keys_str += ' ON '
            keys_str += `${field}.${table_join[field]} = ${table}.id`
        })

        keys_str += ' WHERE '
        Object.keys(wheres).forEach(field => {
            keys_str += typeof wheres[field] == 'string' ? `${table}.${field} = '${wheres[field]}'` : `${table}.${field} = ${wheres[field]}`
            keys_str += ' AND '
        })

        query += keys_str
        query = query.substr(0, query.length - 5)
    }

    return query
}

const build_delete_query = (table, wheres = null) => {
    let query = `DELETE FROM ${table}`

    if (wheres) {
        let keys_str = ''
        query += ' WHERE '
        Object.keys(wheres).forEach(field => {
            keys_str += typeof wheres[field] == 'string' ? `${field} = '${wheres[field]}'` : `${field} = ${wheres[field]}`
            keys_str += ' AND '
        })

        query += keys_str
        query = query.substr(0, query.length - 5)
    }
    query += `;SELECT * FROM temp_delete_${table}`

    return query
}

const build_delete_join_query = (table, table_join_delete, wheres_join, wheres = null) => {
    let query = `DELETE FROM ${table}, ${table_join_delete} USING ${table} INNER JOIN ${table_join_delete}`

    if (wheres) {
        let keys_str = ''

        keys_str += ' WHERE '
        keys_str += `${table}.id = ${table_join_delete}.${wheres_join} AND `
        Object.keys(wheres).forEach(field => {
            keys_str += typeof wheres[field] == 'string' ? `${table}.${field} = '${wheres[field]}'` : `${table}.${field} = ${wheres[field]}`
            keys_str += ' AND '
        })

        query += keys_str
        query = query.substr(0, query.length - 5)
    }
    query += `;SELECT * FROM temp_delete_${table}`

    return query
}

const exec_query = (query) => {
    return new Promise((resolve, reject) => {
        pool.pool.query(query, (err, res) => {
            if (err) {
                reject({
                    success: false,
                    data: null,
                    error: err.sqlMessage
                })
            } else {
                const isNotSelectQuery = res[0] && res[0].affectedRows > 0;
                
                if (isNotSelectQuery) {
                    const info = res[0] || null;
                    const results = res[1] || []
                    resolve({
                        success: true,
                        data: {
                            success: info && info.affectedRows > 0 ? true : false,
                            rowCount: info ? info.affectedRows : 0,
                            rows: results.map(r => Object.assign({}, r))
                        },
                        error: null
                    })
                } else {
                    resolve({
                        success: true,
                        data: {
                            success: res.length > 0,
                            rowCount: res.length,
                            rows: res.map(r => Object.assign({}, r))
                        },
                        error: null
                    })
                }
            }
        })
    })
}

const exec_query_by_admin = (query, is_update = false) => {
    return new Promise((resolve, reject) => {
        pool.poolAdmin.query(query, (err, res) => {
            if (err) {
                reject({
                    success: false,
                    data: null,
                    error: err.sqlMessage
                })
            } else {
                if (is_update) {
                    const isNotSelectQuery = res && res.affectedRows > 0;

                    if (isNotSelectQuery) {
                        const info = res || null;
                        const results = res || [];
                        resolve({
                            success: true,
                            data: {
                                success: !!(info && info.affectedRows > 0),
                                rowCount: info ? info.affectedRows : 0,
                                rows: results
                            },
                            error: null
                        })
                    } else {
                        resolve({
                            success: true,
                            data: {
                                success: res > 0,
                                rowCount: res.affectedRows,
                                rows: res
                            },
                            error: null
                        })
                    }
                } else {
                    const isNotSelectQuery = res[0] && res[0].affectedRows > 0;

                    if (isNotSelectQuery) {
                        const info = res[0] || null;
                        const results = res[1] || [];
                        resolve({
                            success: true,
                            data: {
                                success: !!(info && info.affectedRows > 0),
                                rowCount: info ? info.affectedRows : 0,
                                rows: results.map(r => Object.assign({}, r))
                            },
                            error: null
                        })
                    } else {
                        resolve({
                            success: true,
                            data: {
                                success: res.length > 0,
                                rowCount: res.length,
                                rows: res.map(r => Object.assign({}, r))
                            },
                            error: null
                        })
                    }
                }
            }
        })
    })
}

export default {
    build_insert_query,
    build_update_query,
    build_select_query,
    build_delete_query,
    build_delete_join_query,
    build_join_query,
    exec_query,
    exec_query_by_admin
}