import { connect } from 'react-redux'
import HeaderComponent from '../../components/layouts/dashboard/Header'
import userActions from '../../actions/userActions'

const mapStateToProps = state => ({
    fetchedUser: state.user ? state.user.get : null
})

const mapDispatchToProps = dispatch => ({
    getUser: (user) => {
        dispatch(userActions.getUser(user))
    }
})

export const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)