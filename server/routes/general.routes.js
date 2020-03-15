import express from 'express'
import generalController from '../controllers/general.controller'

const router = express.Router()

router.route('/schedule/get_schedule').post(generalController.get_schedule)

router.route('/composition/get_composition_default').post(generalController.get_composition_default)

router.route('/log/send_log_action').post(generalController.send_log_action)

router.route('/log/send_log_status').post(generalController.send_log_status)

router.route('/get_screenshot').post(generalController.get_screenshot)

export default router