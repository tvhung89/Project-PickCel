import registerService from '../services/registerServer'

const register_server = (req, res, next) => {
    registerService.register_server(req.body.data).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

export default {
    register_server
}