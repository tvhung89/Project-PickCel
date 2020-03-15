import { connect } from 'react-redux'
import ResetPasswordComponent from '../../components/home/ResetPassword'
import userActions from '../../actions/userActions'

const mapStateToProps = state => ({
    resetPasswordUser: state.user ? state.user.resetPassword : null
})

const mapDispatchToProps = dispatch => ({
    resetPassword: (user, token) => {
        dispatch(userActions.resetPassword(user, token))
    }
})

export const ResetPassword = connect(mapStateToProps, mapDispatchToProps)(ResetPasswordComponent)