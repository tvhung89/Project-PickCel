import scheduleCompositionService from '../services/scheduleCompositions'

const get = (req, res, next) => {
    const condition = req.body

    scheduleCompositionService.getScheduleComposition(condition).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const add = (req, res, next) => {
    const scheduleComposition = req.body

    scheduleCompositionService.addScheduleComposition(scheduleComposition).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const update = (req, res, next) => {
    const scheduleComposition = req.body

    scheduleCompositionService.updateScheduleComposition(scheduleComposition).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const remove = (req, res, next) => {
    const condition = req.body

    scheduleCompositionService.deleteScheduleComposition(condition).then(response => {
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