import { combineReducers } from 'redux'
import user from './userReducer'
import display from './displayReducer'
import tag from './tagReducer'
import asset from './assetReducer'
import app from './appReducer'
import composition from './compositionReducer'
import scheduleComposition from './scheduleCompositionReducer'
import schedule from './scheduleReducer'
import template from './templateReducer'
import zoneAsset from './zoneAssetReducer'
import logs from './logsReducer'
const rootReducer = combineReducers({
    user,
    display,
    tag,
    asset,
    app,
    composition,
    scheduleComposition,
    schedule,
    template,
    zoneAsset,
    logs
})

export default rootReducer;