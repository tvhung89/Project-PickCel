import zoneAssetService from '../services/zoneAssets'

const get = (req, res, next) => {
    const condition = req.body

    zoneAssetService.getZoneAsset(condition).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const add = (req, res, next) => {
    const zoneAsset = req.body

    zoneAssetService.addZoneAsset(zoneAsset).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const update = (req, res, next) => {
    const zoneAsset = req.body

    zoneAssetService.updateZoneAsset(zoneAsset).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const remove = (req, res, next) => {
    const condition = req.body

    zoneAssetService.deleteZoneAsset(condition).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

export default {
    get,
    add,
    update,
    remove
}