import generalService from '../services/general'

const get_schedule = (req, res, next) => {
    generalService.getSchedule(req.body.data).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const get_composition_default = (req, res, next) => {
    generalService.get_composition_default(req.body.data).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const send_log_action = (req, res, next) => {
    generalService.send_log_action(req.body.data).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const send_log_status = (req, res, next) => {
    generalService.send_log_status(req.body.data).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

const get_screenshot = (req, res, next) => {
    generalService.get_screenshot(req, res).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

export default {
    get_schedule,
    get_composition_default,
    get_screenshot,
    send_log_action,
    send_log_status
}