import { connect } from 'react-redux'
import CreateCompositionComponent from '../../components/dashboard/CreateComposition'
import compositionActions from '../../actions/compositionActions'
import assetActions from '../../actions/assetActions'
import templateActions from '../../actions/templateActions'

const mapStateToProps = state => ({
    fetchedComposition: state.composition ? state.composition.get : null,
    addedComposition: state.composition ? state.composition.add : null,
    updatedComposition: state.composition ? state.composition.update : null,
    deletedComposition: state.composition ? state.composition.delete : null,
    fetchedAsset: state.asset ? state.asset.get : null,
    defaultTemplates: state.template ? state.template.templates : null,
    fetchedTemplate: state.template ? state.template.get : null
})

const mapDispatchToProps = dispatch => ({
    getComposition: (user_id) => {
        dispatch(compositionActions.get(user_id))
    },
    addComposition: (composition) => {
        dispatch(compositionActions.add(composition))
    },
    updateComposition: (composition) => {
        dispatch(compositionActions.update(composition))
    },
    deleteComposition: (id) => {
        dispatch(compositionActions.remove(id))
    },
    getAsset: (user_id) => {
        dispatch(assetActions.get(user_id))
    },
    getDefaultTemplates: () => {
        dispatch(templateActions.getDefault())
    },
    getTemplates: (user_id) => {
        dispatch(templateActions.get(user_id))
    }
})

export const CreateComposition = connect(mapStateToProps, mapDispatchToProps)(CreateCompositionComponent)