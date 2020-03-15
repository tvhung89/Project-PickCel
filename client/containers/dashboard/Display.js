import { connect } from 'react-redux'
import DisplayComponent from '../../components/dashboard/Display'
import displayActions from '../../actions/displayActions'
import tagActions from '../../actions/tagActions'

const mapStateToProps = state => ({
    fetchedDisplay: state.display ? state.display.get : null,
    addedDisplay: state.display ? state.display.add : null,
    updatedDisplay: state.display ? state.display.update : null,
    displayTags: state.display ? state.display.tags : null,
    fetchedTag: state.tag ? state.tag.get : null,
    addedTag: state.tag ? state.tag.add : null,
    updatedTag: state.tag ? state.tag.update : null,
    deletedTag: state.tag ? state.tag.delete : null
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
    updateDisplay: (display) => {
        dispatch(displayActions.update(display))
    },
    getTag: (display_id) => {
        dispatch(tagActions.getByDisplay(display_id))
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

export const Display = connect(mapStateToProps, mapDispatchToProps)(DisplayComponent)