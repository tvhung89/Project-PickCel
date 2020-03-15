import express from 'express'
import zoneAssetController from '../controllers/zoneAsset.controller'

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
    .post(zoneAssetController.get)
/*
{
    "zone_id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
    "asset_id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
    "duration": 20,
    "z_index": 0
}
*/
router.route('/add')
    .post(zoneAssetController.add)
    
/*
{
	"id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
	"zone_id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
    "asset_id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab",
    "duration": 20,
    "z_index": 0
}
*/
router.route('/update')
	.post(zoneAssetController.update)

/*
{
	"id": "9bfe83fa-ceb9-4df4-ac8f-40e8c1bb2aab"
}
*/
router.route('/remove')
    .post(zoneAssetController.remove)

export default router