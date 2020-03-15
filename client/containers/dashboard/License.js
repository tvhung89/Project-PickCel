import {connect} from 'react-redux'
import LicenseComponent from '../../components/dashboard/License'
import userActions from '../../actions/userActions'

const mapStateToProps = state => ({
    fetchedUser: state.user ? state.user.get : null
})

const mapDispatchToProps = dispatch => ({
    getUser: (user) => {
        dispatch(userActions.getUser(user))
    }
})


export const License = connect(mapStateToProps, mapDispatchToProps)(LicenseComponent)