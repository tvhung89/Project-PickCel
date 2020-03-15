import express from 'express'
import previewController from '../controllers/preview.controller.js'

const router = express.Router()

/* temporary preview for composition */
router.route('/temp')
    .get(previewController.temp_preview)

/* preview composition with id and thumbnail mode */
router.route('/:composition_id/:mode')
    .get(previewController.preview)

/* preview composition with id */
router.route('/:composition_id')
    .get(previewController.preview)

router.param('composition_id', previewController.composition_id)

router.param('mode', previewController.mode)

export default router