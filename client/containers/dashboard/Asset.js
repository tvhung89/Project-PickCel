import { connect } from 'react-redux'
import AssetComponent from '../../components/dashboard/Asset'
import assetActions from '../../actions/assetActions'
import tagActions from '../../actions/tagActions'

const mapStateToProps = state => ({
    fetchedAsset: state.asset ? state.asset.get : null,
    addedAsset: state.asset ? state.asset.add : null,
    updatedAsset: state.asset ? state.asset.update : null,
    deletedAsset: state.asset ? state.asset.delete : null,
    assetTags: state.asset ? state.asset.tags : null,
    fetchedTag: state.tag ? state.tag.get : null,
    addedTag: state.tag ? state.tag.add : null,
    updatedTag: state.tag ? state.tag.update : null,
    deletedTag: state.tag ? state.tag.delete : null
})

const mapDispatchToProps = dispatch => ({
    getAsset: (user_id) => {
        dispatch(assetActions.get(user_id))
    },
    getAssetTags: () => {
        dispatch(assetActions.getTags())
    },
    addAsset: (asset) => {
        dispatch(assetActions.add(asset))
    },
    updateAsset: (asset) => {
        dispatch(assetActions.update(asset))
    },
    deleteAsset: (id) => {
        dispatch(assetActions.remove(id))
    },
    getTag: (asset_id) => {
        dispatch(tagActions.get(asset_id))
    },
    addTag: (tag) => {
        dispatch(tagActions.add(tag))
    },
    updateTag: (tag) => {
        dispatch(tagActions.update(tag))
    },
    deleteTag: (id) => {
        dispatch(tagActions.remove(id))
    }
})

export const Asset = connect(mapStateToProps, mapDispatchToProps)(AssetComponent)