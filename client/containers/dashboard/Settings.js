import { connect } from 'react-redux'
import SettingsComponent from '../../components/dashboard/Settings'
import displayActions from '../../actions/displayActions'
import compositionActions from '../../actions/compositionActions'
import tagActions from '../../actions/tagActions'
const mapStateToProps = state => ({
    fetchedDisplay: state.display ? state.display.get : null,
    displayTags: state.display ? state.display.tags : null,
    fetchedTag: state.tag ? state.tag.get : null,
    fetchedComposition: state.composition ? state.composition.get : null,
    setting: state.setting ? state.setting : null
})

const mapDispatchToProps = dispatch => ({
    getDisplay: (user_id) => {
        dispatch(displayActions.get(user_id))
    },
    getDisplays: () => {
        dispatch(displayActions.getAll())
    },
    getDisplayTags: () => {
        dispatch(displayActions.getTags())
    },
    getComposition: (user_id) => {
        dispatch(compositionActions.get(user_id))
    },
})

export const Settings = connect(mapStateToProps, mapDispatchToProps)(SettingsComponent)