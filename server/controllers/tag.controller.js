import tagService from '../services/tags'

const get = (req, res, next) => {
    const condition = req.body

    tagService.getTag(condition).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const add = (req, res, next) => {
    const tag = req.body

    tagService.addTag(tag).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const update = (req, res, next) => {
    const tag = req.body

    tagService.updateTag(tag).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const remove = (req, res, next) => {
    const condition = req.body

    tagService.deleteTag(condition).then(response => {
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