import { connect } from 'react-redux'
import RegisterComponent from '../../components/home/Register'
import userActions from '../../actions/userActions'

const mapStateToProps = state => ({
    registeredUser: state.user ? state.user.register : null
})

const mapDispatchToProps = dispatch => ({
    register: (user) => {
        dispatch(userActions.register(user))
    }
})

export const Register = connect(mapStateToProps, mapDispatchToProps)(RegisterComponent)