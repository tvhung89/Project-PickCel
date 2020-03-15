import { connect } from 'react-redux'
import VerifyUserComponent from '../../components/home/VerifyUser'
import userActions from '../../actions/userActions'

const mapStateToProps = state => ({
    verifiedUser: state.user ? state.user.verify : null
})

const mapDispatchToProps = dispatch => ({
    verify: (user) => {
        dispatch(userActions.verify(user))
    }
})

export const VerifyUser = connect(mapStateToProps, mapDispatchToProps)(VerifyUserComponent)