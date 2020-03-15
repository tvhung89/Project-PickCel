import React, {Component} from 'react'
import { toast } from 'react-toastify'
import swal from 'sweetalert'
import config from '../../../config/config'
import clientUtils from '../../utils'

import {UploadFile} from '../../containers/dashboard/modals/UploadFile'
import Tags from './Tags'
import Preview from './modals/Preview'

class Asset extends Component {
    constructor(props) {
        super(props)
        this.state = {
            asset: {
                get: null
            },
            assetLoading: true,
            filteredAssets: [],
            pagination: {
                size: config.page_size,
                page: 0,
                total: 0,
                numPage: 0
            },
            selectedAsset: null,
            tag: {
                id: '',
                key: '',
                value: ''
            },
            tags: [],
            tagsLoading: 1,
            isSubmit: false,
            isTagEdit: false,
            isEditSubmit: false,
            isDeleteSubmit: false,
            category: 10,
            isAssetDeleteSubmit: false,
            isAssetEditSubmit: false,
            isAssetEdit: false,
            assetName: '',
            searchAsset: '',
            toggleFilter: false,
            assetTags: []
        }
    }

    componentDidMount() {
        const self = this
        const user_id = clientUtils.get_user_id()
        if (user_id) {
            self.props.getAsset(user_id)
        }
    }

    componentWillReceiveProps(props) {
        const self = this
        const {fetchedAsset, fetchedTag, addedTag, updatedTag, deletedTag, deletedAsset, updatedAsset, assetTags} = props
        const {isSubmit, isEditSubmit, isDeleteSubmit, isTagEdit, asset, isAssetDeleteSubmit, filteredAssets, isAssetEditSubmit} = self.state
        const isNotModified =  !isEditSubmit && !isDeleteSubmit && !isSubmit && !isTagEdit

        if (fetchedAsset && fetchedAsset !== self.props.fetchedAsset) {
            if (fetchedAsset.asset) {
                const assetFetched = fetchedAsset.asset.length > 0 ? fetchedAsset.asset.sort((a, b) => clientUtils.compare_date(b.modified_at, a.modified_at)) : [fetchedAsset.asset]

                self.setState({
                    ...self.state,
                    asset: {
                        ...self.state.asset,
                        get: assetFetched
                    },
                    filteredAssets: assetFetched,
                    pagination: {
                        ...self.state.pagination,
                        total: assetFetched.length,
                        numPage: new Array(Math.ceil(assetFetched.length / self.state.pagination.size)).fill(0)
                    },
                    assetLoading: fetchedAsset.loading
                })
            }

            if (fetchedAsset.error) {
                self.setState({
                    assetLoading: fetchedAsset.loading
                })
            }
        }

        if (fetchedTag && fetchedTag.tag && !fetchedTag.loading && isNotModified) {
            const tags = fetchedTag.tag
            self.setState({
                tags,
                tagsLoading: fetchedTag.loading
            })
        } else {
            if (fetchedTag && fetchedTag.error && !fetchedTag.loading && isNotModified) {
                self.setState({
                    tags: [],
                    tagsLoading: fetchedTag.loading
                })
            }
        }

        if (assetTags && assetTags.tags && !assetTags.loading) {
            const tags = assetTags.tags.reduce(function (r, a) {
                r[a.key] = r[a.key] || [];
                r[a.key].push(a);
                return r;
            }, Object.create(null))

            self.setState({
                assetTags: tags
            })
        } else {
            if (assetTags && assetTags.error && !assetTags.loading) {
                self.setState({
                    assetTags: null
                })
            }
        }

        if (isSubmit) {
            if (addedTag && addedTag.tag && !addedTag.loading) {
                const originalUpdatedAssets = self.state.asset.get.map(a => {
                    let tags = a.tags;
                    if (a.id == addedTag.tag.asset_id) {
                        tags.push(addedTag.tag)
                    }
                    return {
                        ...a,
                        tags
                    }
                })
                const updatedAssets = self.state.filteredAssets.map(a => {
                    let tags = a.tags;

                    if (a.id === addedTag.tag.asset_id) {
                        tags.push(addedTag.tag)
                    }

                    return {
                        ...a,
                        tags
                    }
                })

                self.setState({
                    ...self.state,
                    tags: self.state.tags ? (self.state.tags.filter(t => t.id == addedTag.tag.id).length > 0 ? [...self.state.tags] : [...self.state.tags, addedTag.tag]) : [addedTag.tag],
                    asset: {
                        ...self.state.asset,
                        get: originalUpdatedAssets
                    },
                    filteredAssets: updatedAssets,
                    tag: {
                        key: '',
                        value: ''
                    },
                    isSubmit: false,
                    toggleFilter: false
                })
                toast.success('Tag added successfully!', {
                    onClose: () => {
                        self.props.getAssetTags()
                        self.props.getTag(self.state.selectedAsset.id)
                        self.setState({
                            ...self.state,
                            tagsLoading: addedTag.loading
                        })
                    }
                })
            } else {
                if (addedTag && addedTag.error && !addedTag.loading) {
                    toast.error(addedTag.error, {
                        onClose: () => {
                            self.setState({
                                ...self.state,
                                isSubmit: false,
                                tagsLoading: addedTag.loading
                            })
                        }
                    })
                }
            }
        }

        if (isEditSubmit) {
            if (updatedTag && updatedTag.tag && !updatedTag.loading) {
                const originalUpdatedAssets = self.state.asset.get.map(a => {
                    const newTags = a.tags.map(t => {
                        if (t.id === updatedTag.tag.id) return updatedTag.tag
                        return t
                    })

                    return {
                        ...a,
                        tags: newTags
                    }
                })
                const updatedAssets = self.state.filteredAssets.map(a => {
                    const newTags = a.tags.map(t => {
                        if (t.id === updatedTag.tag.id) return updatedTag.tag
                        return t
                    })

                    return {
                        ...a,
                        tags: newTags
                    }
                })

                self.setState({
                    ...self.state,
                    tags: self.state.tags.map(m => {
                        if (m.id == updatedTag.tag.id) return updatedTag.tag
                        return m
                    }),
                    asset: {
                        ...self.state.asset,
                        get: originalUpdatedAssets
                    },
                    filteredAssets: updatedAssets,
                    tag: {
                        id: '',
                        key: '',
                        value: ''
                    },
                    isEditSubmit: false,
                    isTagEdit: false,
                    toggleFilter: false
                })
                toast.success('Tag updated successfully!')
            } else {
                if (updatedTag && updatedTag.error && !updatedTag.loading) {
                    toast.error(updatedTag.error, {
                        onClose: () => {
                            self.setState({
                                isEditSubmit: false,
                                isTagEdit: false
                            })
                        }
                    })
                }
            }
        }

        if (isDeleteSubmit) {
            if (deletedTag && deletedTag.tag && !deletedTag.loading) {
                const originalUpdatedAssets = self.state.asset.get.map(a => {
                    const newTags = a.tags.filter(t => t.id !== deletedTag.tag.id)

                    return {
                        ...a,
                        tags: newTags
                    }
                })

                const updatedAssets = self.state.filteredAssets.map(a => {
                    const newTags = a.tags.filter(t => t.id !== deletedTag.tag.id)

                    return {
                        ...a,
                        tags: newTags
                    }
                })

                self.setState({
                    ...self.state,
                    tags: self.state.tags.filter(t => t.id !== deletedTag.tag.id),
                    asset: {
                        ...self.state.asset,
                        get: originalUpdatedAssets
                    },
                    filteredAssets: updatedAssets,
                    toggleFilter: false
                })

                toast.success('Tag deleted successfully!', {
                    onClose: () => {
                        self.setState({
                            ...self.state,
                            isDeleteSubmit: false
                        })
                    }
                })
            } else {
                if (deletedTag && deletedTag.error && !deletedTag.loading) {
                    toast.error(deletedTag.error, {
                        onClose: () => {
                            self.setState({
                                ...self.state,
                                isDeleteSubmit: false
                            })
                        }
                    })
                }
            }
        }

        if (isAssetDeleteSubmit) {
            if (deletedAsset && deletedAsset.asset && !deletedAsset.loading) {
                const assetObj = asset.get.filter(a => a.id !== deletedAsset.asset.id)
                const filteredObj = filteredAssets.filter(a => a.id !== deletedAsset.asset.id)
                self.setState({
                    ...self.state,
                    asset: {
                        ...self.state.asset,
                        get: assetObj
                    },
                    filteredAssets: filteredObj,
                    selectedAsset: null,
                    isAssetDeleteSubmit: false
                })

                toast.success('Asset deleted successfully!')
            } else {
                if (deletedAsset && deletedAsset.error && !deletedAsset.loading) {
                    toast.error(deletedAsset.error, {
                        onClose: () => {
                            self.setState({
                                ...self.state,
                                isAssetDeleteSubmit: false
                            })
                        }
                    })
                }
            }
        }

        if (isAssetEditSubmit) {
            if (updatedAsset && updatedAsset.asset && !updatedAsset.loading) {
                const assetObj = asset.get.map(a => {
                    if (a.id === updatedAsset.asset.id)return updatedAsset.asset
                    return a
                })
                const filteredObj = filteredAssets.map(a => {
                    if (a.id === updatedAsset.asset.id)return updatedAsset.asset
                    return a
                })
                self.setState({
                    ...self.state,
                    asset: {
                        ...self.state.asset,
                        get: assetObj
                    },
                    filteredAssets: filteredObj,
                    selectedAsset: updatedAsset.asset,
                    isAssetEditSubmit: false
                })

                toast.success('Asset updated successfully!')
            } else {
                if (updatedAsset && updatedAsset.error && !updatedAsset.loading) {
                    toast.error(updatedAsset.error, {
                        onClose: () => {
                            self.setState({
                                ...self.state,
                                isAssetEditSubmit: false
                            })
                        }
                    })
                }
            }
        }
    }

    handleSelecteAsset = (e, selectedAsset) => {
        e.preventDefault()
        const self = this
        self.setState({
            selectedAsset: null
        })

        setTimeout(() => {
            self.setState({
                ...self.state,
                selectedAsset,
                isTagEdit: false,
                isSubmit: false,
                isEditSubmit: false,
                isDeleteSubmit: false,
                tag: {
                    id: '',
                    key: '',
                    value: ''
                }
            })
        }, 10)

        setTimeout(() => {
            self.props.getTag(selectedAsset.id)
        }, 100)

        return false
    }

    handleAddTag = e => {
        e.preventDefault()
        const self = this
        const form = $(e.target)
        const {tag, selectedAsset, isTagEdit} = self.state
        const updatedTag = Object.assign(tag)

        if (form.valid()) {
            if (!isTagEdit) {
                self.setState({
                    ...self.state,
                    isSubmit: true
                })

                delete updatedTag.id
                setTimeout(() => {
                    self.props.addTag({
                        ...updatedTag,
                        asset_id: selectedAsset.id
                    })
                }, 100)
            } else {
                self.setState({
                    ...self.state,
                    isEditSubmit: true
                })

                setTimeout(() => {
                    self.props.updateTag({
                        ...updatedTag
                    })
                }, 100)
            }
        }

        return false
    }

    handleDeleteTag = (e, tag) => {
        e.preventDefault()
        const self = this

        self.setState({
            ...self.state,
            isDeleteSubmit: true
        })

        swal({
            text: "Are you sure you want to delete tag ?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                self.props.deleteTag(tag.id)
            }
        });

        return false
    }

    handleToggleUpdate = e => {
        e.preventDefault()
        const self = this
        const {selectedAsset, assetName} = self.state

        self.setState({
            assetName: selectedAsset.name,
            isAssetEdit: true
        })

        setTimeout(() => {
            $('#asset-name').focus()
        }, 100)

        return false
    }

    handleUpdateAsset = (e, asset, isKey) => {
        e.preventDefault()
        const self = this
        const {assetName} = self.state

        if (isKey && e.keyCode === 13) {
            if (asset && assetName) {
                self.setState({
                    isAssetEditSubmit: true,
                    isAssetEdit: false
                })

                setTimeout(() => {
                    self.props.updateAsset({
                        id: asset.id,
                        name: assetName
                    })
                }, 100)
            }
        }

        if (!isKey || (isKey && e.keyCode === 27)) {
            self.setState({
                isAssetEdit: false
            })
        }

        return false
    }

    handleDeleteAsset = (e, asset) => {
        e.preventDefault()
        const self = this

        self.setState({
            ...self.state,
            isAssetDeleteSubmit: true
        })

        swal({
            text: "Are you sure you want to delete asset?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                self.props.deleteAsset(asset.id)
            }
        });

        return false
    }

    handlePaginationChange = (e, page) => {
        e.preventDefault();
        const self = this
        self.setState({
            ...self.state,
            pagination: {
                ...self.state.pagination,
                page
            }
        })
        return false
    }

    handleSearchAsset = (e) => {
        e.preventDefault()
        const self = this
        const value = e ? e.target.value : ''
        const {category, asset} = self.state

        self.setState({
            searchAsset: value
        })

        if (value) {
            const assets = asset.get.filter(d => {
                const name = d.name.toString().toLowerCase()
                const val = value.toString().toLowerCase()
                return name.indexOf(val) > -1 && (d.type == category || category == 10)
            })
            self.setState({
                filteredAssets: assets,
                pagination: {
                    ...self.state.pagination,
                    total: assets.length,
                    numPage: new Array(Math.ceil(assets.length / self.state.pagination.size)).fill(0),
                    page: 0
                }
            })
        } else {
            const assets = asset.get.filter(a => a.type == category || category == 10)
            self.setState({
                filteredAssets: assets,
                pagination: {
                    ...self.state.pagination,
                    total: assets.length,
                    numPage: new Array(Math.ceil(assets.length / self.state.pagination.size)).fill(0),
                    page: 0
                }
            })
        }

        return false
    }

    assetByCategory = (e, category) => {
        e.preventDefault()
        const self = this
        const {asset, pagination} = self.state
        const allAssets = asset && asset.get && asset.get.length > 0 ? (category == 10 ? asset.get : asset.get.filter(a => a.type == category)) : []

        self.setState({
            category,
            searchAsset: '',
            filteredAssets: allAssets,
            pagination: {
                ...pagination,
                total: allAssets.length,
                numPage: new Array(Math.ceil(allAssets.length / pagination.size)).fill(0)
            }
        })
    }

    handleToggleFilter = e => {
        e.preventDefault();
        const self = this;
        self.state.selectedAsset?self.props.getTag(self.state.selectedAsset.id):''
        self.setState({
            toggleFilter: !self.state.toggleFilter
        })
        
        return false;
    }

    handleFilter = conditions => {
        const self = this
        const {asset, searchAsset, category} = self.state

        const assets = asset.get.filter(d => {
            const name = d.name.toString().toLowerCase()
            const val = searchAsset.toString().toLowerCase()
            const isTruthy = name.indexOf(val) > -1 && (d.type == category || category == 10)

            if (conditions.length > 0) {
                return isTruthy && d.tags.find(t => conditions.find(c => c.key === t.key && c.value === t.value))
            }
            return isTruthy
        })

        self.setState({
            filteredAssets: assets,
            pagination: {
                ...self.state.pagination,
                total: assets.length,
                numPage: new Array(Math.ceil(assets.length / self.state.pagination.size)).fill(0),
                page: 0
            }
        })
    }

    render() {
        const {selectedAsset, assetLoading, tags, tag, isSubmit, pagination, filteredAssets, category, isAssetEdit, assetName, searchAsset, toggleFilter, assetTags} = this.state
        const displayAssets = filteredAssets && filteredAssets.length > 0 ? filteredAssets.filter(a => a.type == category || category === 10) : []
        const assetListMarkup = displayAssets && displayAssets.length > 0 ? (
            <div className="table-content">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Created Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayAssets.slice(pagination.page * pagination.size, (pagination.page + 1) * pagination.size).map(a => {
                            return (
                                <tr key={a.id} onClick={e => this.handleSelecteAsset(e, a)}>
                                    <td>
                                        <div className='image-wrapper'>
                                            {a.type == 1 ? (
                                                <video>
                                                    <source src={a.content} type={`video/${clientUtils.get_media_extension(a.content)}`} />
                                                </video>
                                            ) : (
                                                <img src={a.type == 2 ? `/dist/images/apps/${a.dimension}` : a.content} alt={a.name}/>
                                            )}
                                        </div>
                                        <span>{a.name}</span>
                                    </td>
                                    <td>{clientUtils.get_asset_type(a.type)}</td>
                                    <td>{clientUtils.format_date(a.created_at)}</td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table>
                <div className="foot">
                    {displayAssets && displayAssets.length > 0 && (
                        <p>{displayAssets.length} {displayAssets.length > 1 ? 'assets' : 'asset'}</p>
                    )}

                    {pagination && pagination.numPage.length > 1 && (
                        <ul className="pagination">
                            <li className={`page-item ${pagination.page == 0 ? 'disabled' : ''}`}><a className="page-link" href="#" onClick={e => this.handlePaginationChange(e, 0)}><i className="icon-angle-double-left"></i></a></li>
                            <li className={`page-item ${pagination.page == 0 ? 'disabled' : ''}`}><a className="page-link" href="#" onClick={e => this.handlePaginationChange(e, pagination.page - 1)}><i className="icon-angle-left"></i></a></li>
                            {pagination.numPage.length > 0 && pagination.numPage.map((n, index) => {
                                const activePageClasses = `page-item ${pagination.page === index ? 'active' : ''}`
                                return (
                                    <li className={activePageClasses} key={index}><a className="page-link" href="#" onClick={e => this.handlePaginationChange(e, index)}>{index + 1}</a></li>
                                )
                            })}
                            <li className={`page-item ${pagination.page == pagination.numPage.length - 1 ? 'disabled' : ''}`}><a className="page-link" href="#" onClick={e => this.handlePaginationChange(e, pagination.page + 1)}><i className="icon-angle-right"></i></a></li>
                            <li className={`page-item ${pagination.page == pagination.numPage.length - 1 ? 'disabled' : ''}`}><a className="page-link" href="#" onClick={e => this.handlePaginationChange(e, pagination.numPage.length - 1)}><i className="icon-angle-double-right"></i></a></li>
                        </ul>
                    )}
                </div>
            </div>
        ) : (
            <div className="table-content no-content">
                <img src="/dist/images/assets.svg" alt="Assets"/>
                <p>You can start adding your files by clicking on the upload button, The files you add can be Images, Videos, Application</p>
                {category == 2 ? (
                    <a className="btn btn-primary rounded" href="/dashboard/apps"><i className="icon-download"></i><span>Create apps</span></a>
                ) : (
                    <button className="btn btn-primary rounded" type="button" data-toggle="modal" data-target="#upload-modal"><i className="icon-download"></i><span>Upload a file</span></button>
                )}
            </div>
        )
        return(
            <div className={`ads__display ${assetLoading ? 'loading-text' : ''}`}>
                <Preview selectedAsset={selectedAsset} />
                <UploadFile />
                <div className="ads__top-bar">
                    <div className="ads__top-bar-left">
                        <a href="#" onClick={this.handleToggleFilter}>
                            <i className="icon-filter"></i>
                        </a>
                        <button className="btn btn-primary rounded" type="button" data-toggle="modal" data-target="#upload-modal">
                            <i className="icon-download"></i>
                            <span>Upload a file</span>
                        </button>
                    </div>
                    <div className="ads__search-box">
                        <input type="text" onChange={this.handleSearchAsset} value={searchAsset} placeholder="Search..."/>
                        <i className="icon-search"></i>
                    </div>
                </div>
                <div className="ads__display_grid">
                    {toggleFilter && (<Tags assetTags={assetTags}
                                            onFilterClose={() => this.setState({toggleFilter: false})}
                                            onInit={e => this.props.getAssetTags()}
                                            onFilter={this.handleFilter} />)}
                    <div className="ads__display_list type-2">
                        <ul className="nav nav-tabs">
                            <li className="nav-item"><a className="nav-link active" data-toggle="tab" href="#all" onClick={e => this.assetByCategory(e, 10)}>All</a></li>
                            <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#all" onClick={e => this.assetByCategory(e, 0)}>Image</a></li>
                            <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#all" onClick={e => this.assetByCategory(e, 1)}>Video</a></li>
                            <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#all" onClick={e => this.assetByCategory(e, 2)}>Apps</a></li>
                        </ul>
                        <div className="tab-content">
                            <div className="tab-pane fade show active" id="all">
                                {assetListMarkup}
                            </div>
                        </div>
                    </div>
                    {selectedAsset && (
                        <div className="ads__display_detail">
                            <div className="ads__display_detail-content">
                                <ul className="nav nav-tabs">
                                    <li className="nav-item"><a className="nav-link active" data-toggle="tab" href="#content">Content</a></li>
                                    <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#tags">Tags</a></li>
                                    <div className="right-icons">
                                        <a href="#" onClick={e => this.handleDeleteAsset(e, selectedAsset)}><i className="icon-trash"></i></a>
                                        <a href="#" onClick={e => this.handleSelecteAsset(e, null)}><i className="icon-close"></i></a>
                                    </div>
                                </ul>
                                <div className="tab-content">
                                    <div className="tab-pane fade show active" id="content">
                                        <div className="detail-block">
                                            <div className="preview">
                                                <a href="#preview-modal" data-toggle="modal">
                                                    {selectedAsset.type === 1 ? (
                                                        <video>
                                                            <source src={selectedAsset.content} type={`video/${clientUtils.get_media_extension(selectedAsset.content)}`} />
                                                        </video>
                                                    ) : (
                                                        <img src={selectedAsset.type == 2 ? `/dist/images/apps/${selectedAsset.dimension}` : selectedAsset.content} alt={selectedAsset.name}/>
                                                    )}
                                                    <span className="mask"></span>
                                                    <span className="play-btn"></span>
                                                </a>
                                            </div>
                                            <p>
                                                <span>Name</span>
                                                {isAssetEdit ? (
                                                    <input id="asset-name" className="form-control" value={assetName} onChange={e => this.setState({
                                                        assetName: e.target.value
                                                    })} onBlur={e => this.handleUpdateAsset(e, selectedAsset, false)} onKeyUp={e => this.handleUpdateAsset(e, selectedAsset, true)} required maxLength="50" />
                                                ) : (
                                                    <React.Fragment>
                                                        <span>: {selectedAsset.name}</span>
                                                        <a href="#" onClick={this.handleToggleUpdate}>
                                                            <i className="icon-pencil"></i>
                                                        </a>
                                                    </React.Fragment>
                                                )}
                                            </p>
                                            <p><span>Type</span><span>: {clientUtils.get_asset_type(selectedAsset.type)}</span></p>
                                            {selectedAsset.type != 2 && (
                                                <React.Fragment>
                                                    <p><span>Size</span><span>: {clientUtils.format_memory_unit(selectedAsset.size)}</span></p>
                                                    <p><span>Dimension</span><span>: {selectedAsset.dimension}</span></p>
                                                </React.Fragment>
                                            )}
                                            {selectedAsset.duration && (<p><span>Duration</span><span>: {clientUtils.format_duration(selectedAsset.duration)}</span></p>)}
                                            <p><span>Creation Date</span><span>: {clientUtils.format_date(selectedAsset.created_at)}</span></p>
                                            <p><span>Modified Date</span><span>: {clientUtils.format_date(selectedAsset.modified_at)}</span></p>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="tags">
                                        <form action="#" method="post" noValidate onSubmit={this.handleAddTag}>
                                            <div className="form-row form-group">
                                                <div className="col-sm-4">
                                                    <label htmlFor="key">Key</label>
                                                    <input className="form-control"
                                                        id="key"
                                                        type="text"
                                                        name="key"
                                                        value={tag.key}
                                                        onChange={e => this.setState({
                                                            ...this.state,
                                                            tag: {
                                                                ...this.state.tag,
                                                                key: e.target.value
                                                            }
                                                        })}
                                                        data-rule-required="true"
                                                        placeholder="Key"/>
                                                </div>
                                                <div className="col-sm-4">
                                                    <label htmlFor="val">Value</label>
                                                    <input className="form-control"
                                                        id="val"
                                                        type="text"
                                                        name="value"
                                                        value={tag.value}
                                                        onChange={e => this.setState({
                                                            ...this.state,
                                                            tag: {
                                                                ...this.state.tag,
                                                                value: e.target.value
                                                            }
                                                        })}
                                                        data-rule-required="true"
                                                        placeholder="Value"/>
                                                </div>
                                                <div className="col-auto">
                                                    <button className={`btn btn-primary rounded ${isSubmit ? 'loading' : ''}`} type="submit">Update</button>
                                                </div>
                                            </div>
                                        </form>
                                        <p>* Avoid adding standard keys (ex: name, current schedule)</p>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Key</th>
                                                    <th>Value</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tags && tags.length > 0 && tags.map((t, index) => (
                                                    <tr key={t.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{t.key}</td>
                                                        <td>{t.value}</td>
                                                        <td>
                                                            <a href="#" onClick={() => {
                                                                this.setState({
                                                                    isTagEdit: true,
                                                                    tag: {
                                                                        id: t.id,
                                                                        key: t.key,
                                                                        value: t.value
                                                                    }
                                                                })
                                                            }}>
                                                                <i className="icon-note"></i>
                                                            </a>
                                                            <a href="#" onClick={e => this.handleDeleteTag(e, t)}>
                                                                <i className="icon-close"></i>
                                                            </a>
                                                            </td>
                                                    </tr>
                                                ))}
                                                {(!tags || (tags && tags.length == 0)) && (
                                                    <tr>
                                                        <td colSpan="4">No tag!</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default Asset

