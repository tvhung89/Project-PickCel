import { connect } from 'react-redux'
import HomeComponent from '../../components/home/Home'
import userActions from '../../actions/userActions'

const mapStateToProps = state => ({
    loggedInUser: state.user ? state.user.login : null,
    registeredUser: state.user ? state.user.register : null
})

const mapDispatchToProps = dispatch => ({
    login: (user) => {
        dispatch(userActions.login(user))
    },
    register: (user) => {
        dispatch(userActions.register(user))
    }
})

export const Home = connect(mapStateToProps, mapDispatchToProps)(HomeComponent)