import db from '../db/operations'
import utils from '../utils'
import config from '../../config/config'
import displayService from './displays'
import displays from './displays'
const updateDisplayDefaultCompositions = (display,composition_id) => {
    const table = 'displays'
  return new Promise((resolve, reject) => {
        if (display.length>0){
                let displayPromises = display.map(d => {
                    return new Promise((re, rj) => {
                        db.exec_query(db.build_update_query(table, {id: d}, {
                            default_composition_id: composition_id
                        })).then(response => {
                            const res = response
                            if (res.success && res.data.rowCount > 0) {
                                const updatedDisplay = res.data.rows[0]
                                const msg = {
                                    command: config.rabbimq.command.set_default,
                                    content: composition_id
                                }    
                                utils.send_msg_to_display(updatedDisplay.queue_name, JSON.stringify(msg)).then(res => {
                                    if (res.success) {
                                        displays.getDisplay({
                                        id: updatedDisplay.id
                                        }).then(response => {
                                            re(response)
                                        }).catch(err => reject(err))
                                    } else {
                                        rj(response)
                                    }
                                }).catch(err => reject(err))
                                // re({
                                //     success: true,
                                //     display: res.data.rows[0]
                                // })
                            } else {
                                rj({
                                    success: false,
                                    error: "Display not found!"
                                })
                            }
                        }).catch(() => {
                            rj({
                                success: false,
                                error: "Error on updating display information!"
                            })
                        })
                    })
                })

                Promise.all(displayPromises).then(response => {
                    const dis = response.map(r => r.display)
                    resolve({
                        success: true,
                        display: dis
                    })
                }).catch(error => reject(error))
            
        } else {
            reject({
                success: false,
                error: "Params not found!"
            })
        }
    })
}
export default {
   updateDisplayDefaultCompositions
}