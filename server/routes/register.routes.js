import express from 'express'
import registerController from '../controllers/register.controller'

const router = express.Router()

router.route('/info')
    .post(registerController.get)

export default router