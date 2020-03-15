import { connect } from 'react-redux'
import AddCompositionComponent from '../../../components/dashboard/modals/AddComposition'
import compositionActions from '../../../actions/compositionActions'

const mapStateToProps = state => ({
    fetchedComposition: state.composition ? state.composition.get : null
})

const mapDispatchToProps = dispatch => ({
    getComposition: (user_id) => {
        dispatch(compositionActions.get(user_id))
    }
})

export const AddComposition = connect(mapStateToProps, mapDispatchToProps)(AddCompositionComponent)