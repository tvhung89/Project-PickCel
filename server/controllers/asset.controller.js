import assetService from '../services/assets'

const get = (req, res, next) => {
    const condition = req.body

    assetService.getAsset(condition).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const getTags = (req, res, next) => {
    const condition = req.body

    assetService.getAssetTags(condition).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const add = (req, res, next) => {
    const asset = req.body

    assetService.addAsset(asset).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const update = (req, res, next) => {
    const asset = req.body

    assetService.updateAsset(asset).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const remove = (req, res, next) => {
    const condition = req.body

    assetService.deleteAsset(condition).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

export default {
    get,
    getTags,
    add,
    update,
    remove
}