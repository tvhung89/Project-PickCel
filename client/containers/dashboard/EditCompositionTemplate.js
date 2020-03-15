import { connect } from 'react-redux'
import EditCompositionTemplateComponent from '../../components/dashboard/EditCompositionTemplate'
import compositionActions from '../../actions/compositionActions'
import templateActions from '../../actions/templateActions'

const mapStateToProps = state => ({
    fetchedComposition: state.composition ? state.composition.get : null,
    updatedTemplateComposition: state.composition ? state.composition.updateTemplate : null
})

const mapDispatchToProps = dispatch => ({
    getComposition: (user_id) => {
        dispatch(compositionActions.get(user_id))
    },
    updateTemplate: (composition) => {
        dispatch(compositionActions.updateTemplate(composition))
    }
})

export const EditCompositionTemplate = connect(mapStateToProps, mapDispatchToProps)(EditCompositionTemplateComponent)