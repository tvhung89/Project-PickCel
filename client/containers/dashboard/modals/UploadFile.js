import { connect } from 'react-redux'
import UploadFileComponent from '../../../components/dashboard/modals/UploadFile'
import assetActions from '../../../actions/assetActions'

const mapStateToProps = state => ({
    fetchedAsset: state.asset ? state.asset.get : null,
})

const mapDispatchToProps = dispatch => ({
    getAsset: (user_id) => {
        dispatch(assetActions.get(user_id))
    }
})

export const UploadFile = connect(mapStateToProps, mapDispatchToProps)(UploadFileComponent)