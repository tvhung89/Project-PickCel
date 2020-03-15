import express from 'express'
import userController from '../controllers/user.controller'

const router = express.Router()

/*
    {
		"name": "Ha Manh Do",
		"email": "hadm@gmail.com",
		"password": "Demo@123"
	}
 */
router.route('/register')
	.post(userController.register)

/*
    {
		"email": "hadm@gmail.com",
		"password": "Demo@123"
	}
 */
router.route('/login')
.post(userController.login)

/*
    {
		{
			"email": "hadm@gmail.com",
			"password": "Demo@123",
			"newPassword": "Admin@123"
		}
	}
 */
router.route('/change-password')
.post(userController.verifyCredential)

/*
    {
		"email": "hadm@gmail.com"
	}

	OR

	{
		"id": "1fsdgf-ewrgaerge-dfvsdgerg-sdbsd"
	}
 */
router.route('/get')
.post(userController.getUser)

/*
    {
		"email": "hadm@gmail.com"
	}
 */
router.route('/send-reset-password-email')
.post(userController.sendResetPasswordEmail)

/*
    {
		"user": {
			"id": "3fab1854-a00b-4f9f-bd9e-f9271a6d3d11",
			"password": "Demo@123"
		},
		"token": "dasdasdasds"
	}
*/

router.route('/reset-password')
.post(userController.resetPassword)

/*
    {
		"user": {
			"id": "3fab1854-a00b-4f9f-bd9e-f9271a6d3d11",
			"verify": true
		},
		"token": "dasdasdasds"
	}
*/

router.route('/verify-user')
.post(userController.verifyUser)

/*
    {
		{
			"id": "3fab1854-a00b-4f9f-bd9e-f9271a6d3d11",
			"company_name": "Unknown",
			"country_code": "VN",
			"phone_number": "123123123"
		}
	}
*/

router.route('/update-user-info')
.post(userController.updateUserInfo)

export default router