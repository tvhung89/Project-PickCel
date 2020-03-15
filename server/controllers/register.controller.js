import registerService from '../services/register'

const get = (req, res, next) => {
    registerService.getInfo().then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}

export default {
    get
}