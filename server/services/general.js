import path from "path";
import fs from 'fs'
import config from '../../config/config'
import uuidv1 from "uuid/v1";
import db from "../db/operations";
import moment from 'moment'
import scheduleService from './schedules'
import compositionService from './compositions'
import zoneAssetsService from './zoneAssets'
import utils from "../utils";
import multer from 'multer'

const NodeRSA = require('node-rsa');
const CURRENT_WORKING_DIR = process.cwd()
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(CURRENT_WORKING_DIR, '/uploads/screenshot'))
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})
const upload = multer({storage: storage}).single('screenshot')

const isDeleteFile = (file_name) => {
    const path = path.join(CURRENT_WORKING_DIR, `/uploads/screenshot/${file_name}`)
    if (fs.existsSync(path)) {
        fs.unlinkSync(path)
    }
}

const isRepeatInDay = (day, monday, tuesday, wednesday, thursday, friday, saturday, sunday) => {
    switch (day) {
        case 0:
            return sunday;
        case 1:
            return monday;
        case 2:
            return tuesday;
        case 3:
            return wednesday;
        case 4:
            return thursday;
        case 5:
            return friday;
        case 6:
            return saturday;
    }
}

const getSchedule = (request) => {
    const key = new NodeRSA()
    const table_display_schedules = 'display_schedules'
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

                db.exec_query(db.build_select_query(table_display_schedules, decrypted_data)).then(response => {
                    if (response.success && response.data.rowCount > 0) {
                        scheduleService.getSchedule({id: decrypted_data.schedule_id}).then(res => {
                            const temp_schedule = res.schedule[0]
                            const temp_composition = temp_schedule.compositions[0]
                            const monday = temp_composition.monday
                            const tuesday = temp_composition.tuesday
                            const wednesday = temp_composition.wednesday
                            const thursday = temp_composition.thursday
                            const friday = temp_composition.friday
                            const saturday = temp_composition.saturday
                            const sunday = temp_composition.sunday

                            const start = temp_composition.start_date;
                            const end = temp_composition.end_date;
                            let day_in_start_date = new Date(start).getDay();

                            const start_date = moment(start).format('MM-DD-YYYY')
                            const end_date = moment(end).format('MM-DD-YYYY')

                            const time_start_date = Date.parse(start_date) / 1000
                            const time_end_date = Date.parse(end_date) / 1000

                            const start_time_int = Date.parse(utils.format_date(start)) / 1000
                            const end_time_int = Date.parse(utils.format_date(end)) / 1000

                            const remaining_to_start_time = start_time_int - time_start_date;
                            const remaining_to_end_time = end_time_int - time_end_date;

                            const schedule_id = temp_schedule.id
                            let schedule_composition = []
                            const schedule = {
                                id: schedule_id,
                                name: temp_schedule.name,
                                created_at: temp_schedule.created_at,
                                prior_level: temp_composition.prior_level,
                                order_level: temp_composition.order_level,
                                start_date: time_start_date,
                                end_date: time_end_date
                            }

                            const composition_id = temp_composition.id
                            if (temp_composition.is_repeat === 0) {
                                schedule_composition.push({
                                    id: uuidv1(),
                                    composition_id: composition_id,
                                    schedule_id: schedule_id,
                                    date: time_start_date,
                                    start_time: remaining_to_start_time,
                                    end_time: remaining_to_end_time
                                })
                            } else {
                                const num_days = Math.floor((time_end_date - time_start_date) / 86400);
                                for (let i = 0; i <= num_days; i++) {
                                    const new_date = time_start_date + 86400 * i
                                    if (day_in_start_date > 6) {
                                        day_in_start_date = 0;
                                    }

                                    if (isRepeatInDay(day_in_start_date, monday, tuesday, wednesday, thursday, friday, saturday, sunday)) {
                                        if (remaining_to_start_time <= remaining_to_end_time) {
                                            schedule_composition.push({
                                                id: uuidv1(),
                                                composition_id: composition_id,
                                                schedule_id: schedule_id,
                                                date: new_date,
                                                start_time: remaining_to_start_time,
                                                end_time: remaining_to_end_time
                                            })
                                        } else {
                                            if (i <= num_days && i > 0) {
                                                schedule_composition.push({
                                                    id: uuidv1(),
                                                    composition_id: composition_id,
                                                    schedule_id: schedule_id,
                                                    date: new_date,
                                                    start_time: 0,
                                                    end_time: remaining_to_end_time
                                                })
                                            }

                                            if (i < num_days && i >= 0) {
                                                schedule_composition.push({
                                                    id: uuidv1(),
                                                    composition_id: composition_id,
                                                    schedule_id: schedule_id,
                                                    date: new_date,
                                                    start_time: remaining_to_start_time,
                                                    end_time: 86399
                                                })
                                            }
                                        }
                                    }

                                    day_in_start_date++;
                                }
                            }

                            compositionService.getComposition({id: composition_id}).then(response => {
                                const current_composition = response.compositions[0]
                                const temp_zones = current_composition.zones
                                let zones = []
                                let assets = []

                                const composition = {
                                    id: current_composition.id,
                                    name: current_composition.name,
                                    duration: current_composition.duration,
                                    template_id: current_composition.template_id,
                                }

                                const template = {
                                    id: current_composition.template_id,
                                    name: current_composition.template_name,
                                    orientation: current_composition.orientation,
                                    width: current_composition.template_width,
                                    height: current_composition.template_height,
                                    is_custom: current_composition.template_width > 16 && current_composition.template_height > 16
                                }

                                temp_zones.forEach(z => {
                                    const isExist = zones.length > 0 ? zones.filter(tz => tz.id === z.id).length > 0 : false
                                    const {id, name, top, left, width, height, z_index} = z

                                    if (!isExist) zones.push({
                                        id,
                                        template_id: current_composition.template_id,
                                        name,
                                        top,
                                        left,
                                        width,
                                        height,
                                        z_index
                                    })

                                    const temp_asset = z.assets
                                    temp_asset.forEach(a => {
                                        const isExist = assets.length > 0 ? assets.filter(ta => ta.id === a.id).length > 0 : false
                                        const {id, name, dimension, content, type, asset_duration} = a

                                        if (!isExist) assets.push({
                                            id, name, dimension, content, type, asset_duration
                                        })

                                    })

                                })

                                zoneAssetsService.getZoneAsset({composition_id: temp_composition.id}).then(result => {
                                    const zone_assets = result.zoneAsset
                                    resolve({
                                        success: true,
                                        code: "PICK-000000",
                                        message: "Successful",
                                        result: JSON.stringify({
                                            schedule,
                                            schedule_composition,
                                            composition,
                                            template,
                                            zones,
                                            assets,
                                            zone_assets
                                        })
                                    })
                                }).catch(() => {
                                    reject({
                                        success: false,
                                        code: "PICK-000402",
                                        message: "Can't get zone asset!"
                                    })
                                })
                            }).catch(() => {
                                reject({
                                    success: false,
                                    code: "PICK-000402",
                                    message: "Can't get composition!"
                                })
                            })
                        }).catch(() => {
                            reject({
                                success: false,
                                code: "PICK-000402",
                                message: "Can't get schedule!"
                            })
                        })
                    } else {
                        reject({
                            success: false,
                            code: "PICK-000404",
                            message: "Schedule or display not found!"
                        })
                    }
                }).catch(() => {
                    reject({
                        success: false,
                        code: "PICK-000402",
                        message: "Error on find display or schedule!"
                    })
                })
            }
        });

    })
}

const get_composition_default = (request) => {
    const key = new NodeRSA()
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

                compositionService.getComposition(decrypted_data).then(response => {
                    const current_composition = response.compositions[0]
                    const temp_zones = current_composition.zones
                    let zones = []
                    let assets = []

                    const composition = {
                        id: current_composition.id,
                        name: current_composition.name,
                        duration: current_composition.duration,
                        template_id: current_composition.template_id,
                    }

                    const template = {
                        id: current_composition.template_id,
                        name: current_composition.template_name,
                        orientation: current_composition.orientation,
                        width: current_composition.template_width,
                        height: current_composition.template_height,
                        is_custom: current_composition.template_width > 16 && current_composition.template_height > 16
                    }

                    temp_zones.forEach(z => {
                        const isExist = zones.length > 0 ? zones.filter(tz => tz.id === z.id).length > 0 : false
                        const {id, name, top, left, width, height, z_index} = z

                        if (!isExist) zones.push({
                            id,
                            template_id: current_composition.template_id,
                            name,
                            top,
                            left,
                            width,
                            height,
                            z_index
                        })

                        const temp_asset = z.assets
                        temp_asset.forEach(a => {
                            const isExist = assets.length > 0 ? assets.filter(ta => ta.id === a.id).length > 0 : false
                            const {id, name, dimension, content, type, asset_duration} = a

                            if (!isExist) assets.push({
                                id, name, dimension, content, type, asset_duration
                            })

                        })

                    })

                    zoneAssetsService.getZoneAsset({composition_id: composition.id}).then(result => {
                        const zone_assets = result.zoneAsset
                        resolve({
                            success: true,
                            code: "PICK-000000",
                            message: "Successful",
                            result: JSON.stringify({
                                composition,
                                template,
                                zones,
                                assets,
                                zone_assets
                            })
                        })
                    }).catch(() => {
                        reject({
                            success: false,
                            code: "PICK-000402",
                            message: "Can't get zone asset!"
                        })
                    })
                }).catch(() => {
                    reject({
                        success: false,
                        code: "PICK-000402",
                        message: "Can't get composition!"
                    })
                })
            }
        });

    })
}

const send_log_status = (request) => {
    const table = 'displays';
    request = JSON.parse(request)
    return new Promise((resolve, reject) => {
        try {
            const id = request.id;
            db.exec_query(db.build_select_query(table, {id: id}, false)).then(res => {
                if (res.success && res.data.rowCount > 0) {
                    const player = res.data.rows[0]
                    const status = player.is_active

                    if (status === 1) {
                        const temp_player = {
                            network_type: request.network_type,
                            network_status: request.network_status,
                            online_at: utils.format_date(),
                            apk_version_name: request.apk_version_name,
                            apk_version_code: request.apk_version_code,
                            time_zone: request.time_zone,
                            storage: request.storage,
                            total_storage: request.total_storage,
                            manufacturer: request.manufacturer,
                            hardware: request.hardware,
                            model: request.model,
                            brand: request.brand,
                            device: request.device,
                            sdk_version: request.sdk_version,
                            private_ip: request.private_ip,
                            public_ip: request.public_ip,
                            mac_address_wifi: request.mac_address_wifi,
                            mac_address_ethernet: request.mac_address_ethernet,
                        }
                        db.exec_query(db.build_update_query(table, {id: id}, temp_player), true).then(response => {
                            if (response.success && response.data.rowCount > 0) {
                                resolve({
                                    success: true,
                                    code: 'PICK-000000',
                                    message: "Successful"
                                })
                            } else {
                                reject({
                                    success: false,
                                    code: "PICK-000404",
                                    message: "Can not update player",
                                    result: {
                                        code: 1
                                    }
                                })
                            }
                        }).catch(() => {
                            reject({
                                success: false,
                                code: "PICK-000402",
                                message: "Error on update player"
                            })
                        })
                    } else {
                        reject({
                            success: false,
                            code: "PICK-000404",
                            message: "The player has not been activated",
                            result: {
                                code: 1
                            }
                        })
                    }

                } else {
                    reject({
                        success: false,
                        code: "PICK-000404",
                        message: "No player found!",
                        result: {
                            code: 0
                        }
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    code: "PICK-000402",
                    message: "Error on find player"
                })
            })
        } catch (e) {
            reject({
                success: false,
                code: "PICK-000402",
                message: "Exception: " + e
            })
        }
    })
}

// const send_log_action = (request) => {
//     const table = 'displays';
//     request = JSON.parse(request)
//     return new Promise((resolve, reject) => {
//         try {
//             const id = request.playerId;
//             db.exec_query(db.build_select_query(table, {id: id}, false)).then(res => {
//                 if (res.success && res.data.rowCount > 0) {
//                     const kafka = require('kafka-node'),
//                         Producer = kafka.Producer,
//                         client = new kafka.KafkaClient({kafkaHost: config.kafka.host + ':' + config.kafka.port}),
//                         producer = new Producer(client),
//                         payloads = [
//                             {topic: 'pickcel_logs', messages: JSON.stringify(request), timestamp: Date.now()},
//                         ];
//
//                     producer.on('ready', function () {
//                         producer.send(payloads, function (err, data) {
//                             if (err) {
//                                 reject({
//                                     success: false,
//                                     code: "PICK-000404",
//                                     message: "Send log failed"
//                                 })
//                             } else {
//                                 resolve({
//                                     success: false,
//                                     code: "PICK-000000",
//                                     message: data
//                                 })
//                             }
//                             producer.close();
//                             client.close();
//                         });
//                     });
//
//                     producer.on('error', function (err) {
//                         producer.close();
//                         client.close();
//                         reject({
//                             success: false,
//                             code: "PICK-000402",
//                             message: "Error on send log: " + err
//                         })
//                     });
//
//                 } else {
//                     reject({
//                         success: false,
//                         code: "PICK-000404",
//                         message: "No player found!"
//                     })
//                 }
//             }).catch(err => {
//                 reject({
//                     success: false,
//                     code: "PICK-000402",
//                     message: "Error on find player"
//                 })
//             })
//         } catch (e) {
//             reject({
//                 success: false,
//                 code: "PICK-000402",
//                 message: "Exception: " + e
//             })
//         }
//     })
// }

const send_log_action = (request) => {
    const table = 'displays'
    request = JSON.parse(request)
    return new Promise((resolve, reject) => {
        try {
            const id = request.playerId
            db.exec_query(db.build_select_query(table, {id: id}, false)).then(res => {
                if (res.success && res.data.rowCount > 0) {
                    const url = `mongodb://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.database}`
                    const MongoClient = require('mongodb').MongoClient
                    const options = {
                        useUnifiedTopology: true,
                        useNewUrlParser: true
                    }

                    MongoClient.connect(url, options,function (err, client) {
                        if (err) {
                            reject({
                                success: false,
                                code: "PICK-000500",
                                message: "Can't connect db"
                            })
                        } else {
                            const db = client.db(config.mongodb.database)

                            const collection = db.collection(config.mongodb.document);
                            collection.insertMany([request], function (err, result) {
                                if (!err) {
                                    resolve({
                                        success: true,
                                        code: "PICK-000000",
                                        message: 'Successful'
                                    })
                                } else {
                                    client.close()
                                    reject({
                                        success: false,
                                        code: "PICK-000404",
                                        message: "Send log failed"
                                    })
                                }
                            })

                        }
                    })

                } else {
                    reject({
                        success: false,
                        code: "PICK-000404",
                        message: "No player found!"
                    })
                }
            }).catch(err => {
                console.log(err)
                reject({
                    success: false,
                    code: "PICK-000402",
                    message: "Error on find player"
                })
            })
        } catch (e) {
            reject({
                success: false,
                code: "PICK-000402",
                message: "Exception: " + e
            })
        }
    })
}

const get_screenshot = (req, res) => {
    const table = 'displays'
    return new Promise((resolve, reject) => {
        upload(req, res, function (err) {
            const display_id = req.body.display_id
            if (err) {
                reject({
                    success: false,
                    code: "PICK-000402",
                    message: "Exception: " + err
                })
            } else {
                try {
                    let fileInfo = req.file
                    const regPatternImage = new RegExp('image\/')

                    if (fileInfo) {
                        if (regPatternImage.test(fileInfo.mimetype)) {
                            db.exec_query(db.build_select_query(table, {id: display_id})).then(response => {
                                if (response.success && response.data.rowCount > 0) {
                                    const screenshot_path = {
                                        screenshot: `${config.mediaUrl}/${fileInfo.filename}`
                                    }

                                    db.exec_query(db.build_update_query(table, {id: display_id}, screenshot_path), true).then(res => {
                                        if (res.success && res.data.rowCount > 0) {
                                            reject({
                                                success: true,
                                                code: "PICK-000000",
                                                message: "Upload successful"
                                            })
                                        } else {
                                            isDeleteFile(fileInfo.filename)
                                            reject({
                                                success: false,
                                                code: "PICK-000404",
                                                message: "Delete file failed"
                                            })
                                        }
                                    }).catch(() => {
                                        isDeleteFile(fileInfo.filename)
                                        reject({
                                            success: false,
                                            code: "PICK-000402",
                                            message: "Delete file failed"
                                        })
                                    })
                                } else {
                                    isDeleteFile(fileInfo.filename)
                                    reject({
                                        success: false,
                                        code: "PICK-000404",
                                        message: "Display not found!"
                                    })
                                }
                            }).catch(() => {
                                isDeleteFile(fileInfo.filename)
                                reject({
                                    success: false,
                                    code: "PICK-000402",
                                    message: "Error on find display!"
                                })
                            })

                        } else {
                            isDeleteFile(fileInfo.filename)
                            reject({
                                success: false,
                                code: "PICK-000404",
                                message: "Delete file failed"
                            })
                        }
                    } else {
                        reject({
                            success: false,
                            code: "PICK-000404",
                            message: "Can not upload file"
                        })
                    }
                } catch (e) {
                    reject({
                        success: false,
                        code: "PICK-000402",
                        message: "Exception: " + e
                    })
                }

            }
        })
    })
}

export default {
    getSchedule,
    get_screenshot,
    get_composition_default,
    send_log_status,
    send_log_action
}