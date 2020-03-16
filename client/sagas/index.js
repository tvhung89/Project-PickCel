import { all } from 'redux-saga/effects'
import userSaga from './userSaga'
import displaySaga from './displaySaga'
import tagSaga from './tagSaga'
import assetSaga from './assetSaga'
import compositionSaga from './compositionSaga'
import scheduleCompositionSaga from './scheduleCompositionSaga'
import scheduleSaga from './scheduleSaga'
import templateSaga from './templateSaga'
import zoneAssetSaga from './zoneAssetSaga'
import appSaga from './appSaga'
import logsSaga from './logsSaga'
import settingSaga from './settingsSaga'
export default function* rootSaga() {
    yield all([
        userSaga.loadRegister(),
        userSaga.loadLogin(),
        userSaga.loadUser(),
        userSaga.loadSendResetPasswordEmail(),
        userSaga.loadResetPassword(),
        userSaga.loadChangePassword(),
        userSaga.verifyUser(),
        userSaga.updateUser(),
        displaySaga.getDisplay(),
        displaySaga.addDisplay(),
        displaySaga.getDisplayTags(),
        displaySaga.updateDisplay(),
        tagSaga.getTag(),
        tagSaga.addTag(),
        tagSaga.updateTag(),
        tagSaga.deleteTag(),
        assetSaga.getAsset(),
        assetSaga.getAssetTags(),
        assetSaga.addAsset(),
        assetSaga.updateAsset(),
        assetSaga.deleteAsset(),
        compositionSaga.getComposition(),
        compositionSaga.addComposition(),
        compositionSaga.updateComposition(),
        compositionSaga.updateCompositionTemplate(),
        compositionSaga.deleteComposition(),
        scheduleCompositionSaga.getScheduleComposition(),
        scheduleCompositionSaga.addScheduleComposition(),
        scheduleCompositionSaga.updateScheduleComposition(),
        scheduleCompositionSaga.deleteScheduleComposition(),
        scheduleSaga.getSchedule(),
        scheduleSaga.addSchedule(),
        scheduleSaga.updateSchedule(),
        scheduleSaga.deleteSchedule(),
        templateSaga.getTemplate(),
        templateSaga.getDefaultTemplate(),
        templateSaga.addTemplate(),
        templateSaga.deleteTemplate(),
        zoneAssetSaga.getZoneAsset(),
        zoneAssetSaga.addZoneAsset(),
        zoneAssetSaga.updateZoneAsset(),
        zoneAssetSaga.deleteZoneAsset(),
        appSaga.getApp(),
        appSaga.addApp(),
        appSaga.updateApp(),
        appSaga.deleteApp(),
        logsSaga.getLog(),
        settingSaga.updateDisplayDefaultComposition()
    ])
}
