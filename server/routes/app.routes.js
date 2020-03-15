import express from 'express'
import appController from '../controllers/app.controller'

const router = express.Router()

/*
{
	"user_id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab"
}
or to get all
{

}
*/
router.route('/get')
    .post(appController.get)
/*
{
	"name": "Youtube Video",
	"type": "youtube",
	"content": "{'url': 'https://youtube.com?v=var32wevr'}",
	"user_id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
}
*/
router.route('/add')
    .post(appController.add)
    
/*
{
	"id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
	"name": "Weather",
	"type": "weather",
	"content": "{'url': 'https://youtube.com?v=var32wevr'}"
}
*/
router.route('/update')
	.post(appController.update)

/*
{
	"id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab"
}
*/
router.route('/remove')
    .post(appController.remove)

export default router