import displayService from '../services/displays'

const get = (req, res, next) => {
    const condition = req.body

    displayService.getDisplay(condition).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const getTags = (req, res, next) => {
    const condition = req.body

    displayService.getDisplayTags(condition).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}


const add = (req, res, next) => {
    const display = req.body

    displayService.addDisplay(display).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const update = (req, res, next) => {
    const display = req.body

    displayService.updateDisplay(display).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

export default {
    get,
    getTags,
    add,
    update
}