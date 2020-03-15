import { connect } from 'react-redux'
import CompositionComponent from '../../components/dashboard/Composition'
import compositionActions from '../../actions/compositionActions'
import tagActions from '../../actions/tagActions'

const mapStateToProps = state => ({
    fetchedComposition: state.composition ? state.composition.get : null,
    addedComposition: state.composition ? state.composition.add : null,
    updatedComposition: state.composition ? state.composition.update : null,
    deletedComposition: state.composition ? state.composition.delete : null,
    fetchedTag: state.tag ? state.tag.get : null,
    addedTag: state.tag ? state.tag.add : null,
    updatedTag: state.tag ? state.tag.update : null,
    deletedTag: state.tag ? state.tag.delete : null
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
    getTag: (asset_id) => {
        dispatch(tagActions.get(asset_id))
    },
    addTag: (tag) => {
        dispatch(tagActions.add(tag))
    },
    updateTag: (tag) => {
        dispatch(tagActions.update(tag))
    },
    deleteTag: (id) => {
        dispatch(tagActions.remove(id))
    }
})

export const Composition = connect(mapStateToProps, mapDispatchToProps)(CompositionComponent)