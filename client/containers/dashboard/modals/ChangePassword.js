import { connect } from 'react-redux'
import ChangePasswordComponent from '../../../components/dashboard/modals/ChangePassword'
import userActions from '../../../actions/userActions'

const mapStateToProps = state => ({
    changePasswordUser: state.user ? state.user.changePassword : null
})

const mapDispatchToProps = dispatch => ({
    changePassword: (user) => {
        dispatch(userActions.changePassword(user))
    }
})

export const ChangePassword = connect(mapStateToProps, mapDispatchToProps)(ChangePasswordComponent)