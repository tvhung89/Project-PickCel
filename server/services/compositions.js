import db from '../db/operations'
import compositionDb from '../db/composition'
import utils from '../utils'
import zoneService from './zones'
import zoneAssetService from './zoneAssets'
import assetService from './assets'
import templateService from './templates'
import uuidv1 from 'uuid/v1'

const getCompositionOldVersion = (condition) => {
    const table = 'compositions'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(condition)) {
            db.exec_query(db.build_select_query(table, condition)).then(response => {
                const res = response

                if (res.success && res.data.rowCount > 0) {
                    const selectedCmps = res.data.rows
                    let templatePromises = []

                    selectedCmps.forEach(c => {
                        const {template_id} = c
                        templatePromises = [
                            ...templatePromises,
                            zoneService.getZone({
                                template_id
                            }, true)
                        ]
                    })

                    db.exec_query(db.build_select_query('templates')).then(tResponse => {
                        let tInfo = tResponse.data.rows

                        Promise.all(templatePromises).then(zoneResponse => {
                            const zs = zoneResponse.map(zR => {
                                return {
                                    zones: zR.zones,
                                    template_id: zR.template_id
                                }
                            })
    
                            let zAs = []
                            zoneResponse.forEach(zR => {
                                zR.zones.forEach(zRz => {
                                    zAs = [
                                        ...zAs,
                                        zoneAssetService.getZoneAsset({
                                            zone_id: zRz.id 
                                        })
                                    ]
                                })
                            })
    
                            Promise.all(zAs).then(zAResponse => {
                                let zAssets = []
                                let assetPromises = []
                                zAResponse.forEach(zAR => {
                                    zAR.zoneAsset.forEach(zASub => {
                                        zAssets.push(zASub)
                                        assetPromises = [
                                            ...assetPromises,
                                            assetService.getAsset({
                                                id: zASub.asset_id
                                            })
                                        ]
                                    })
                                })

                                if (condition.user_id) {
                                    resolve({
                                        success: true,
                                        compositions: [
                                            ...selectedCmps.map(sC => {
                                                const selectedTemplateInfo = tInfo.find(t => t.id == sC.template_id)
                                                let templateZones = zs.filter(z => z.template_id == sC.template_id)[0].zones
        
                                                templateZones = templateZones.map(tZ => {
                                                    const assetsZone = zAssets.filter(aZ => aZ.composition_id == sC.id && aZ.zone_id == tZ.id)
        
                                                    return {
                                                        ...tZ,
                                                        assets: assetsZone
                                                    }
                                                })
            
                                                return {
                                                    ...sC,
                                                    template_name: selectedTemplateInfo.name,
                                                    orientation: selectedTemplateInfo.orientation,
                                                    template_width: selectedTemplateInfo.width,
                                                    template_height: selectedTemplateInfo.height,
                                                    template_user_id: selectedTemplateInfo.user_id,
                                                    zones: templateZones
                                                }
                                            })
                                        ]
                                    })
                                } else {
                                    Promise.all(assetPromises).then(assetResponse => {
                                        const assets = assetResponse.map(aR => aR.asset)
    
                                        resolve({
                                            success: true,
                                            compositions: [
                                                ...selectedCmps.map(sC => {
                                                    const selectedTemplateInfo = tInfo.find(t => t.id == sC.template_id)
                                                    let templateZones = zs.filter(z => z.template_id == sC.template_id)[0].zones
            
                                                    templateZones = templateZones.map(tZ => {
                                                        const assetsZone = zAssets.filter(aZ => aZ.composition_id == sC.id && aZ.zone_id == tZ.id)
            
                                                        return {
                                                            ...tZ,
                                                            assets: assetsZone.map(aZ => {
                                                                let assetInfo = assets.find(a => a.id == aZ.asset_id)
                                                                delete assetInfo.id
                                                                delete assetInfo.created_at
                                                                delete assetInfo.modified_at
                                                                delete assetInfo.user_id,
                                                                delete assetInfo.duration
                                                                return {
                                                                    ...aZ,
                                                                    ...assetInfo
                                                                }
                                                            })
                                                        }
                                                    })
                
                                                    return {
                                                        ...sC,
                                                        template_name: selectedTemplateInfo.name,
                                                        orientation: selectedTemplateInfo.orientation,
                                                        template_width: selectedTemplateInfo.width,
                                                        template_height: selectedTemplateInfo.height,
                                                        template_user_id: selectedTemplateInfo.user_id,
                                                        zones: [
                                                            ...templateZones
                                                        ]
                                                    }
                                                })
                                            ]
                                        })
                                    }).catch(error => {
                                        reject(error)
                                    })
                                }
                            }).catch(() => {
                                reject({
                                    success: false,
                                    error: "Can't get composition zone assets!"
                                })
                            })
                        }).catch(() => {
                            reject({
                                success: false,
                                error: "Can't get composition zones!"
                            })
                        })
                    }).catch(() => {
                        reject({
                            success: false,
                            error: "Can't get template!"
                        })
                    })
                } else {
                    reject({
                        success: false,
                        error: "No composition found!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Composition not found!"
                })
            })
        } else {
            reject({
                success: false,
                error: 'Params not found!'
            })
        }
    })
}

const getComposition = (condition) => {
    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(condition)) {
            db.exec_query(compositionDb.getCompositionInfo(condition)).then(response => {
                const compositions = response.data.rows
                let tempComps = []

                compositions.forEach(c => {
                    const isExist = tempComps.length > 0 ? tempComps.filter(tc => tc.id == c.id).length > 0 : false
                    const {id, name, created_at, version, duration, modified_at, template_id, user_id, template_name, orientation, template_width, template_height, template_user_id} = c

                    if (!isExist) tempComps.push({
                        id,
                        name,
                        created_at,
                        version,
                        duration,
                        modified_at,
                        template_id,
                        user_id,
                        template_name,
                        orientation,
                        template_width,
                        template_height,
                        template_user_id
                    })
                })

                tempComps = tempComps.map(t => {
                    let zones = compositions.filter(c => t.id == c.id)
                    let tempZones = []
                    
                    zones.forEach(z => {
                        const isExist = tempZones.length > 0 ? tempZones.filter(tz => tz.id == z.zone_id).length > 0 : false

                        if (!isExist) tempZones.push({
                            id: z.zone_id,
                            name: z.zone_name,
                            top: z.top,
                            left: z.left,
                            width: z.zone_width,
                            height: z.zone_height,
                            z_index: z.zone_z_index
                        })
                    })

                    return {
                        ...t,
                        zones: tempZones.map(z => {
                            const assets = compositions.filter(c => c.id == t.id && c.zone_id == z.id)

                            return {
                                ...z,
                                assets: assets.map(a => {
                                    return {
                                        id: a.asset_id,
                                        name: a.asset_name,
                                        dimension: a.dimension,
                                        content: a.content,
                                        type: a.type,
                                        duration: a.za_duration,
                                        asset_duration: a.a_duration,
                                        size: a.size,
                                        z_index: a.z_index
                                    }
                                })
                            }
                        })
                    }
                })

                resolve({
                    success: true,
                    compositions: tempComps
                })
            }).catch(() => {
                reject({
                    success: false,
                    error: "Composition not found!"
                })
            })
        } else {
            reject({
                success: false,
                error: 'Params not found!'
            })
        }
    })
}

const addComposition = (composition, is_id = true) => {
    const table = 'compositions'

    return new Promise((resolve, reject) => {
        if (!composition.id) {
            composition.id = uuidv1()
        }
        if (utils.check_properties_validity(composition)) {
            let compInfo = {...composition}
            delete compInfo.zones
            
            db.exec_query(db.build_insert_query(table, compInfo, is_id)).then(res => {
                if (res.success && res.data.rowCount > 0) {
                    const insertedComp = res.data.rows[0]

                    if (insertedComp) {
                        const compId = insertedComp.id
                        const zones = [
                            ...composition.zones
                        ]

                        if (zones && zones.length > 0) {
                            let zoneAssetPromises = []
                            zones.forEach(z => {
                                zoneAssetPromises = [
                                    ...zoneAssetPromises,
                                    ...z.assets.map(zA => {
                                        return zoneAssetService.addZoneAsset({
                                            id: uuidv1(),
                                            zone_id: z.id,
                                            asset_id: zA.id,
                                            duration: zA.duration,
                                            z_index: zA.z_index,
                                            composition_id: compId
                                        })
                                    })
                                ]
                            })

                            if (zoneAssetPromises && zoneAssetPromises.length > 0) {
                                Promise.all(zoneAssetPromises).then(response => {
                                    const zoneAssetResponses = zones.map(z => {
                                        const selectedZoneAsset = response.filter(zA => zA.zoneAsset.zone_id === z.id)
                                        return {
                                            id: z.id,
                                            assets: [
                                                ...selectedZoneAsset.map(zA => zA.zoneAsset)
                                            ]
                                        }
                                    })

                                    resolve({
                                        success: true,
                                        composition: {
                                            ...insertedComp,
                                            zones: zoneAssetResponses
                                        }
                                    })
                                }).catch(() => {
                                    reject({
                                        success: false,
                                        error: "Can't add zone assets!"
                                    })
                                })
                            } else {
                                reject({
                                    success: false,
                                    error: "Zone asset(s) is/are missing!"
                                })
                            }
                        } else {
                            reject({
                                success: false,
                                error: "No zones found in composition!"
                            })
                        }
                    } else {
                        reject({
                            success: false,
                            error: "No composition inserted!"
                        })
                    }
                } else {
                    reject({
                        success: false,
                        error: "No composition added!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Error on adding composition!"
                })
            })
        } else {
            reject({
                success: false,
                error: "Params not found!"
            })
        }
    })
}

const updateComposition = (composition) => {
    return new Promise((resolve, reject) => {
        deleteComposition({
            id: composition.id
        }).then(response => {
            let comp = {...composition}
            if (comp.version) comp.version++

            addComposition(comp, true).then(res => {
                resolve(res)
            }).catch(error => reject(error))
        }).catch(error => reject(error))
    })
}

const updateCompositionTemplate = (composition) => {
    return new Promise((resolve, reject) => {
        const newTemplate = {
            ...composition.template
        }
        const compo = {
            ...composition.composition
        }
        templateService.addTemplate(newTemplate).then(tRes => {
            const template = tRes.template
            const zones = tRes.zones

            const comp = {
                ...compo,
                template_id: template.id,
                zones: compo.zones.map(z => {
                    const selectedZone = zones.find(zz => zz.name == z.name)

                    return {
                        id: selectedZone ? selectedZone.id : null,
                        assets: z.assets.map(a => {
                            return {
                                id: a.id,
                                duration: a.duration,
                                z_index: a.z_index
                            }
                        })
                    }
                })
            }
            
            updateComposition(comp).then(response => {
                resolve(response)
            }).catch(error => reject(error))
        }).catch(error => reject(error))
    })
}

const deleteComposition = (condition) => {
    const table = 'compositions'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(condition)) {
            db.exec_query(db.build_delete_query(table, condition)).then(response => {
                const res = response

                if (res.success && res.data.rowCount > 0) {
                    const composition = res.data.rows[0]
                    const compId = composition.id

                    zoneAssetService.deleteZoneAsset({
                        composition_id: compId
                    }).then(zaResponse => {
                        resolve({
                            success: true,
                            composition
                        })
                    }).catch(() => {
                        reject({
                            success: false,
                            error: "Can't delete composition zone assets!"
                        })
                    })
                } else {
                    reject({
                        success: false,
                        error: "No composition found!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Composition not found!"
                })
            })
        } else {
            reject({
                success: false,
                error: "Params not found!"
            })
        }
    })
}

export default {
    getComposition,
    addComposition,
    updateComposition,
    deleteComposition,
    updateCompositionTemplate
}