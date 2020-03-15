import path from "path"
import fs from 'fs'
import db from "../db/operations"
import displayDb from '../db/display'
import uuidv1 from 'uuid/v1'

const NodeRSA = require('node-rsa');
const CURRENT_WORKING_DIR = process.cwd()

const register_server = (request) => {
    const key = new NodeRSA()
    const table = 'displays'
    const tableAdmin = 'device'
    key.setOptions({encryptionScheme: 'pkcs1'})

    return new Promise((resolve, reject) => {
        fs.readFile(path.join(CURRENT_WORKING_DIR, '/keys/private.pem'), 'utf-8', function (err, private_key) {
            if (err) {
                reject({
                    success: false,
                    code: "PICK-000401",
                    message: 'Can not load public key'
                })
            } else {
                request = request.replace(/(\r\n|\n|\r)/gm, '')
                key.importKey(private_key, 'pkcs1-private')
                let decrypted_data = key.decrypt(request, "base64");
                decrypted_data = Buffer.from(decrypted_data, 'base64')
                decrypted_data = decrypted_data.toString('utf-8')
                decrypted_data = JSON.parse(decrypted_data)

                let condition = {}
                let queue_name = ''
                let mac_address = ''
                if (decrypted_data.mac_address_ethernet !== '') {
                    mac_address = decrypted_data.mac_address_ethernet
                    queue_name += decrypted_data.mac_address_ethernet
                    condition.mac_address_ethernet = decrypted_data.mac_address_ethernet

                }
                if (decrypted_data.mac_address_wifi !== '') {
                    mac_address = decrypted_data.mac_address_wifi
                    queue_name += decrypted_data.mac_address_wifi
                    condition.mac_address_wifi = decrypted_data.mac_address_wifi
                }
                if (decrypted_data.code !== '') {
                    condition.code = decrypted_data.code
                }
                decrypted_data.queue_name = queue_name + '-' + uuidv1()

                db.exec_query(displayDb.getDisplay(condition)).then(response => {
                    if (response.success && response.data.rowCount > 0) {
                        const display = response.data.rows[0]

                        if (display.is_active === 1) {
                            resolve({
                                success: true,
                                code: "PICK-000000",
                                message: 'Successful',
                                result: {
                                    status: 1,
                                    display_id: display.id,
                                    queue_name: display.queue_name,
                                    code: display.code
                                }
                            })
                        } else {
                            resolve({
                                success: true,
                                code: "PICK-000000",
                                message: 'Successful',
                                result: {
                                    status: 2,
                                    display_id: display.id,
                                    queue_name: display.queue_name,
                                    code: display.code
                                }
                            })
                        }
                    } else {
                        db.exec_query_by_admin(db.build_select_query(tableAdmin, {mac_address: mac_address})).then(response => {
                            if (response.success && response.data.rowCount > 0) {
                                const device = response.data.rows[0]
                                const day = Date.parse(new Date().toString()) / 1000;

                                if (device.active === 0) {
                                    db.exec_query_by_admin(db.build_update_query(tableAdmin, {id: device.id}, {
                                        active_date: day,
                                        active: 1
                                    }), true).then(res => {
                                        if (res.success && res.data.rowCount > 0) {
                                            console.log('Update device success');
                                        } else {
                                            console.log('Update device fail');
                                        }
                                    }).catch((err) => {
                                        console.log(err)
                                    })
                                }

                                decrypted_data.id = uuidv1()
                                db.exec_query(db.build_insert_query(table, decrypted_data, true)).then(res => {
                                    if (res.success && res.data.rowCount > 0) {
                                        const addedDisplay = res.data.rows[0]

                                        resolve({
                                            success: true,
                                            code: "PICK-000000",
                                            message: 'Successful',
                                            result: {
                                                status: 0,
                                                display_id: addedDisplay.id,
                                                queue_name: addedDisplay.queue_name,
                                                code: addedDisplay.code
                                            }
                                        })
                                    } else {
                                        reject({
                                            success: false,
                                            code: "PICK-000404",
                                            message: "Error on adding display!"
                                        })
                                    }
                                }).catch(() => {
                                    reject({
                                        success: false,
                                        code: "PICK-000402",
                                        message: "Error on adding display!"
                                    })
                                })
                            } else {
                                reject({
                                    success: false,
                                    code: "PICK-000402",
                                    message: "This device is not in a supplier"
                                })
                            }
                        }).catch((err) => {
                            reject({
                                success: false,
                                code: "PICK-000404",
                                message: "Error on found verify device!"
                            })
                        })
                    }
                }).catch(() => {
                    reject({
                        success: false,
                        code: "PICK-000402",
                        message: "Error on found display!"
                    })
                })
            }
        });

    })
}

export default {
    register_server
}