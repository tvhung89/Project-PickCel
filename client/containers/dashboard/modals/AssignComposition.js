import { connect } from 'react-redux'
import AssignCompositionComponent from '../../../components/dashboard/modals/AssignComposition'
import compositionActions from '../../../actions/compositionActions'
import settingActions from '../../../actions/settingsActions'
const mapStateToProps = state => ({
    fetchedComposition: state.composition ? state.composition.get : null,
})

const mapDispatchToProps = dispatch => ({
    getComposition: (user_id) => {
        dispatch(compositionActions.get(user_id))
    },
    updateDisplayDefaultComposition: (display, composition_id) => {
        dispatch(settingActions.updateDisplayDefaultComposition(display, composition_id))
    },
})
export const AssignComposition = connect(mapStateToProps, mapDispatchToProps)(AssignCompositionComponent)