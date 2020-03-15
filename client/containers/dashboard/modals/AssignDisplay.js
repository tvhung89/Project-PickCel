import { connect } from 'react-redux'
import AssignDisplayComponent from '../../../components/dashboard/modals/AssignDisplay'
import displayActions from '../../../actions/displayActions'

const mapStateToProps = state => ({
    fetchedDisplay: state.display ? state.display.get : null,
    displayTags: state.display ? state.display.tags : null,
})

const mapDispatchToProps = dispatch => ({
    getDisplay: (user_id) => {
        dispatch(displayActions.get(user_id))
    },
    getDisplayTags: () => {
        dispatch(displayActions.getTags())
    },
})

export const AssignDisplay = connect(mapStateToProps, mapDispatchToProps)(AssignDisplayComponent)