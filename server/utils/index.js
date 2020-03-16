import moment from 'moment'
import config from '../../config/config'

const sync_promises = (array, promise, token = null) => {
    return array.reduce((p, item) => {
        return p.then(function () {
            return token ? promise(item, token).then(response => {
                if (response.message) console.log(response.message)
            }) : promise(item).then(response => {
                console.log(response.message)
            })
        });
    }, Promise.resolve())
}

const chunk_array = (array, chunkSize) => {
    return [].concat.apply([],
        array.map(function (elem, i) {
            return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
        })
    );
}

const check_properties_validity = (obj) => {
    let count = 0
    if (!obj) return true
    if (obj && Object.keys(obj).length > 0) {
        Object.keys(obj).forEach(field => {
            if (obj[field] === '' || obj[field] === null || typeof obj[field] === 'undefined') count++
        })
        return count == 0
    } else return false
}

const sort_by_key = (arr, key) => {
    return arr.sort((a, b) => a[key] - b[key])
}

const format_date = (date = null) => {
    const formatDate = date ? date : moment()
    return moment(formatDate).format('YYYY-MM-DD HH:mm:ss')
}

const send_msg_to_display = (queue, msg) => {
    return new Promise((resolve, reject) => {
        const amqp = require('amqplib/callback_api')
        // const connection = 'amqp://' + config.rabbimq.user + ':' + config.rabbimq.password + '@' + config.rabbimq.host + ':' + config.rabbimq.port
        const conn = 'amqp://' + config.rabbimq.user + ':' + config.rabbimq.password + '@' + config.rabbimq.host + ':' + config.rabbimq.port

        amqp.connect(conn, function (error0, connection) {
            if (error0) {
                reject({
                    success: false,
                    message: 'Error when connect server'
                })
            } else {
                connection.createChannel(function (error1, channel) {
                    if (error1) {
                        reject({
                            success: false,
                            message: 'Exception when connect server'
                        })
                    } else {
                        channel.assertQueue(queue, {
                            durable: false
                        })
                        channel.sendToQueue(queue, Buffer.from(msg))

                        channel.close()
                    }
                })
                setTimeout(function () {
                    connection.close()
                    resolve({
                        success: true
                    })
                }, 500)
            }
        });
    })
}


export default {
    sync_promises,
    chunk_array,
    check_properties_validity,
    sort_by_key,
    send_msg_to_display,
    format_date
}