import express from 'express'
import compositionController from '../controllers/composition.controller'

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
    .post(compositionController.get)
/*
{
    "name": "Composition 1",
    "version": 2,
    "duration": 50,
    "template_id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
    "user_id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
    "zones": [
        {
            "id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
            "assets": [
                {
                    "id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
                    "duration": 10,
                    "z_index": 0
                }
            ]
        }
    ]
}
*/
router.route('/add')
    .post(compositionController.add)
    
/*
{
	"id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
	"name": "Composition 1",
    "version": 2,
    "duration": 50,
    "orientation": true,
    "template_id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab"
}
*/
router.route('/update')
    .post(compositionController.update)
    
/*
 {
     template: {
        "template": {
            "name": "Template 1",
            "orientation": true,
            "width": 1920,
            "height": 1080,
            "user_id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
        },
        "zones": [
            {
                "name": "Zone 1",
                "top": 0,
                "left": 0,
                "width": 160,
                "height": 80,
                "z_index": 0
            },
            {
                "name": "Zone 2",
                "top": 0,
                "left": 0,
                "width": 160,
                "height": 80,
                "z_index": 0
            }
        ]
     },
     composition: {
        "name": "Composition 1",
        "version": 2,
        "duration": 50,
        "template_id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
        "user_id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
        "created_at": "2019-10-20T13:30:30Z",
        "zones": [
            {
                "id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
                "assets": [
                    {
                        "id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
                        "duration": 10,
                        "z_index": 0
                    }
                ]
            }
        ]
    }
 }
*/
router.route('/update-template')
	.post(compositionController.updateCompositionTemplate)

/*
{
	"id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab"
}
*/
router.route('/remove')
    .post(compositionController.remove)


export default router