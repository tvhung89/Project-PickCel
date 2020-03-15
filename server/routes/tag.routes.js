import express from 'express'
import tagController from '../controllers/tag.controller'

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
    .post(tagController.get)
/*
{
	"key": "first",
	"value": "first value",
	"asset_id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
	"type": 0
}
*/
router.route('/add')
    .post(tagController.add)
    
/*
{
	"id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
	"key": "first",
	"value": "first value",
}
*/
router.route('/update')
	.post(tagController.update)

/*
{
	"id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab"
}
*/
router.route('/remove')
    .post(tagController.remove)

export default router