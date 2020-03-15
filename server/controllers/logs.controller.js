import logsService from '../services/logs.js'

const get = (req, res, next) => {
    const condition = req.body
    logsService.getLogs(condition).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}
export default {
    get
}