import { connect } from 'react-redux'
import ForgotPasswordComponent from '../../components/home/ForgotPassword'
import userActions from '../../actions/userActions'

const mapStateToProps = state => ({
    forgotPasswordUser: state.user ? state.user.sendEmail : null
})

const mapDispatchToProps = dispatch => ({
    sendResetPasswordEmail: (user) => {
        dispatch(userActions.sendResetPasswordEmail(user))
    }
})

export const ForgotPassword = connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordComponent)