import express from 'express'
import scheduleCompositionController from '../controllers/scheduleComposition.controller'

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
    .post(scheduleCompositionController.get)
/*
{
	"schedule_id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
	"composition_id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
	"start_date": "2019-08-25 15:00:00",
    "end_date": "2019-08-25 22:00:00",
    "is_repeat": false,
    "monday": false,
    "tuesday": false,
    "wednesday": false,
    "thursday": false,
    "friday": false,
    "saturday": false,
    "sunday": false,
}
*/
router.route('/add')
    .post(scheduleCompositionController.add)
    
/*
{
	"id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
	"schedule_id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
	"composition_id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
	"start_date": "2019-08-25 15:00:00",
    "end_date": "2019-08-25 22:00:00",
    "is_repeat": false,
    "monday": false,
    "tuesday": false,
    "wednesday": false,
    "thursday": false,
    "friday": false,
    "saturday": false,
    "sunday": false,
}
*/
router.route('/update')
	.post(scheduleCompositionController.update)

/*
{
	"id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab"
}
*/
router.route('/remove')
    .post(scheduleCompositionController.remove)

export default router