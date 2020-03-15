import express from 'express'
import logsController from '../controllers/logs.controller'

const router = express.Router()

router.route('/get')
    .post(logsController.get)

export default router