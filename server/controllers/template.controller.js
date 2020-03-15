import templateService from '../services/templates'

const get = (req, res, next) => {
    const condition = req.body

    templateService.getTemplate(condition).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const getDefault = (req, res, next) => {
    templateService.getDefaultTemplate().then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const add = (req, res, next) => {
    const template = req.body

    templateService.addTemplate(template).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const remove = (req, res, next) => {
    const condition = req.body

    templateService.deleteTemplate(condition).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

export default {
    get,
    getDefault,
    add,
    remove
}