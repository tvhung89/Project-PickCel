import { connect } from 'react-redux'
import AddDisplayComponent from '../../../components/dashboard/modals/AddDisplay'
import displayActions from '../../../actions/displayActions'

const mapStateToProps = state => ({
    addedDisplay: state.display ? state.display.add : null
})

const mapDispatchToProps = dispatch => ({
    addDisplay: (display) => {
        dispatch(displayActions.add(display))
    },
    getDisplay: (id) => {
        dispatch(displayActions.get(id))
    }
})

export const AddDisplay = connect(mapStateToProps, mapDispatchToProps)(AddDisplayComponent)