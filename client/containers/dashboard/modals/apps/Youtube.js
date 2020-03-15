import { connect } from 'react-redux'
import YoutubeComponent from '../../../../components/dashboard/modals/apps/Youtube'
import assetActions from '../../../../actions/assetActions'

const mapStateToProps = state => ({
    addedAsset: state.asset ? state.asset.add : null
})

const mapDispatchToProps = dispatch => ({
    addAsset: (asset) => {
        dispatch(assetActions.add(asset))
    }
})

export const Youtube = connect(mapStateToProps, mapDispatchToProps)(YoutubeComponent)