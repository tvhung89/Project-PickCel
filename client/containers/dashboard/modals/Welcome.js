import { connect } from 'react-redux'
import WelcomeComponent from '../../../components/dashboard/modals/Welcome'
import userActions from '../../../actions/userActions'

const mapStateToProps = state => ({
    updatedUser: state.user ? state.user.update : null
})

const mapDispatchToProps = dispatch => ({
    update: (user) => {
        dispatch(userActions.update(user))
    }
})

export const Welcome = connect(mapStateToProps, mapDispatchToProps)(WelcomeComponent)