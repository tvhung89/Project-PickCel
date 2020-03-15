import settingService from '../services/setting'
const update = (req, res, next) => {

    const {display,default_composition_id} = req.body

    settingService.updateDisplayDefaultCompositions(display,default_composition_id).then(response => {
        return res.json(response)
    }).catch(error => {
        return res.json(error)
    })
}
export default {
    update
}