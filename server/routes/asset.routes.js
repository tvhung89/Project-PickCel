import express from 'express'
import assetController from '../controllers/asset.controller'

const router = express.Router()

/*
{
	"id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab"
}
or to get all
{

}
*/
router.route('/get')
    .post(assetController.get)

router.route('/tags/get')
	.post(assetController.getTags)
/*
{
	"name": "Image 1",
	"type": 0,
	"size": 2.5,
	"dimension": "1920*1080",
	"content": "images/screenshot1.jpg",
	"user_id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
}
{
	"name": "Video 1",
	"type": 1,
	"size": 25.5,
	"dimension": "1920*1080",
	"duration": 15,
	"content": "images/bunny.mp4",
	"user_id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
},
{
	"name": "Youtube",
	"type": 2,
	"content": "<video src='https://www.youtube.com/watch?v=dsdwre24312v'></video>",
	"user_id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab"
}
*/
router.route('/add')
    .post(assetController.add)
    
/*
{
	"id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
	"key": "first",
	"value": "first value",
}
*/
router.route('/update')
	.post(assetController.update)

/*
{
	"id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab"
}
*/
router.route('/remove')
    .post(assetController.remove)

export default router