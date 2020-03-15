import express from 'express'
import templateController from '../controllers/template.controller'

const router = express.Router()

/* Get all templates and its zones
{
	"id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab"
}
or to get all
{

}
*/
router.route('/get')
    .post(templateController.get)

/* Get default templates */
router.route('/get')
    .get(templateController.getDefault)
    
/*
{
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
}
*/
router.route('/add')
    .post(templateController.add)

/* Will remove both template and related zones
{
	"id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab"
}
*/
router.route('/remove')
    .post(templateController.remove)

export default router