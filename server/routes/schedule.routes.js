import express from 'express'
import scheduleController from '../controllers/schedule.controller'

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
    .post(scheduleController.get)
/*
{
    "name": "Schedule 1",
    "version": 1,
    "user_id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
    "compositions": [
        {
            "composition_id": '9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab',
            "start_date": "2019-13-12 11:03:22",
            "end_date": "2019-13-12 11:03:22",
            "is_repeat": true,
            "monday": true,
            "tuesday": true,
            "wednesday": false,
            "thursday": false,
            "friday": true,
            "saturday": true,
            "sunday": false
        }
    ]
}
*/
router.route('/add')
    .post(scheduleController.add)
    
/*
{
    "id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
    "name": "Schedule 1",
    "version": 1
	
}
*/
router.route('/update')
	.post(scheduleController.update)

/*
{
	"id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab"
}
*/
router.route('/remove')
    .post(scheduleController.remove)

export default router