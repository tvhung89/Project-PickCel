import appService from '../services/apps'

const get = (req, res, next) => {
    const condition = req.body

    appService.getApp(condition).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const add = (req, res, next) => {
    const app = req.body

    appService.addApp(app).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const update = (req, res, next) => {
    const app = req.body

    appService.updateApp(app).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const remove = (req, res, next) => {
    const condition = req.body

    appService.deleteApp(condition).then(response => {
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