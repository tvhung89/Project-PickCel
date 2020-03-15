import compositionService from '../services/compositions'

const get = (req, res, next) => {
    const condition = req.body

    compositionService.getComposition(condition).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const add = (req, res, next) => {
    const composition = req.body

    compositionService.addComposition(composition).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const update = (req, res, next) => {
    const composition = req.body

    compositionService.updateComposition(composition).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const updateCompositionTemplate = (req, res, next) => {
    const composition = req.body

    compositionService.updateCompositionTemplate(composition).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const remove = (req, res, next) => {
    const condition = req.body

    compositionService.deleteComposition(condition).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

export default {
    get,
    add,
    update,
    updateCompositionTemplate,
    remove
}