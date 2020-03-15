import express from 'express'
import registerServerController from '../controllers/registerServer.controller'

const router = express.Router()

router.route('/register_server')
    .post(registerServerController.register_server)

export default router