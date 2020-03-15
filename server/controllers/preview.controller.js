import compositionService from '../services/compositions'
import utils from '../utils'
import path from 'path'
import config from '../../config/config'

const preview = (req, res, next) => {
    const {composition_id, mode} = req

    compositionService.getComposition({
        id: composition_id
    }).then(response => {
        if (response.success && response.compositions && response.compositions.length > 0) {
            const composition = response.compositions[0]
            
            res.render('preview', {
                template: {
                    width: composition.template_width,
                    height: composition.template_height,
                    isCustom: composition.template_user_id && composition.id != config.default_composition_id ? true : false
                },
                zones: composition.zones.map(z => {
                    return {
                        ...z,
                        assets: utils.sort_by_key(z.assets, 'z_index')
                    }
                }),
                mode
            })

        } else {
            return res.json({
                success: false,
                error: "No composition found!"
            })
        }
        
    }).catch(error => {
        return res.json(error)
    })
}

const temp_preview = (req, res, next) => {
    res.status(200).sendFile(path.join(process.cwd(), 'views/tempPreview.html'));
}

const composition_id = (req, res, next, value) => {
    req.composition_id = value
    next()
}

const mode = (req, res, next, value) => {
    req.mode = value
    next()
}

export default {
    preview,
    temp_preview,
    composition_id,
    mode
}
