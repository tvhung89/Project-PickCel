import scheduleService from '../services/schedules'

const get = (req, res, next) => {
    const condition = req.body

    scheduleService.getSchedule(condition).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const add = (req, res, next) => {
    const schedule = req.body

    scheduleService.addSchedule(schedule).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const update = (req, res, next) => {
    const schedule = req.body

    scheduleService.updateSchedule(schedule).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const remove = (req, res, next) => {
    const condition = req.body

    scheduleService.deleteSchedule(condition).then(response => {
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