import express from 'express'
import displayController from '../controllers/display.controller'

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
    .post(displayController.get)

/*
{
	"code": "PICKCEL1",
	"user_id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab"
}
*/
router.route('/tags/get')
	.post(displayController.getTags)


router.route('/add')
    .post(displayController.add)
    
/*
{
	"id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
	"name": "Ubuntu Demo Display New"
}
*/
router.route('/update')
	.post(displayController.update)

export default router