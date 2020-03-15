import express from 'express'
import settingController from '../controllers/setting.controller'

const router = express.Router()

router.route('/update')
	.post(settingController.update)

export default router
