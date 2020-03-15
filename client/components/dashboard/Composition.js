import React, {Component} from 'react'

import SaveComposition from './modals/SaveComposition'
import Preview from './modals/Preview'

import clientUtils from '../../utils'
import { toast } from 'react-toastify'
import config from '../../../config/config'
import swal from 'sweetalert'

class Composition extends Component {
    constructor(props) {
        super(props)

        this.state = {
            get: {
                compositions: null
            },
            compositionLoading: true,
            filteredCompositions: [],
            pagination: {
                size: config.page_size,
                page: 0,
                total: 0,
                numPage: 0
            },
            selectedComposition: null,
            compositionName: '',
            tag: {
                id: '',
                key: '',
                value: ''
            },
            tags: null,
            tagsLoading: 1,
            isTagEdit: false,
            isSubmit: false,
            isEditSubmit: false,
            isDeleteSubmit: false,
            isCompositionDeleteSubmit: false,
            isDuplicateComposition: false,
            newCompositionName: ''
        }   
    }

    componentDidMount() {
        const self = this
        const user_id = clientUtils.get_user_id()

        if (user_id) {
            self.props.getComposition(user_id)
        }
    }

    componentWillReceiveProps(props) {
        const self = this
        const {fetchedComposition, fetchedTag, addedTag, updatedTag, deletedTag, deletedComposition, addedComposition, selectedDisplay} = props
        const {get, isSubmit, isEditSubmit, isDeleteSubmit, isTagEdit, isCompositionDeleteSubmit, filteredCompositions, isDuplicateComposition} = self.state
        const isNotModified =  !isEditSubmit && !isDeleteSubmit && !isSubmit && !isTagEdit

        if (fetchedComposition && fetchedComposition.composition !== self.props.fetchedComposition.composition) {
            if (fetchedComposition.composition) {
                const cFetched = fetchedComposition.composition.sort((a, b) => clientUtils.compare_date(b.modified_at, a.modified_at))
                const selectedComp = selectedDisplay ? cFetched.find(c => c.id == selectedDisplay.default_schedule_id) : (cFetched && cFetched.length > 0 ? cFetched[0] : null)
                self.setState({
                    get: {
                        compositions: cFetched
                    },
                    filteredCompositions: cFetched,
                    pagination: {
                        ...self.state.pagination,
                        total: cFetched.length,
                        numPage: new Array(Math.ceil(cFetched.length / self.state.pagination.size)).fill(0)
                    },
                    compositionLoading: fetchedComposition.loading
                })

                setTimeout(() => {
                    self.handleSelectComposition(null, selectedComp)
                }, 100)
            }

            if (fetchedComposition.error) {
                self.setState({
                    compositionLoading: fetchedComposition.loading
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
                    tags: null,
                    tagsLoading: fetchedTag.loading
                })
            }
        }

        if (isSubmit) {
            if (addedTag && addedTag.tag && !addedTag.loading) {
                self.setState({
                    ...self.state,
                    tags: self.state.tags ? (self.state.tags.filter(t => t.id === addedTag.tag.id).length > 0 ? [...self.state.tags] : [...self.state.tags, addedTag.tag]) : [addedTag.tag],
                    tag: {
                        key: '',
                        value: ''
                    },
                    isSubmit: false
                })

                toast.success('Tag added successfully!', {
                    onClose: () => {
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
                self.setState({
                    ...self.state,
                    tags: self.state.tags.map(m => {
                        if (m.id == updatedTag.tag.id) return updatedTag.tag
                        return m
                    }),
                    tag: {
                        id: '',
                        key: '',
                        value: ''
                    },
                    isEditSubmit: false,
                    isTagEdit: false
                })

                toast.success('Tag updated successfully!')
            } else {
                if (updatedTag && updatedTag.error && !updatedTag.loading) {
                    toast.error(updatedTag.error, {
                        onClose: () => {
                            self.setState({
                                ...self.state,
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
                self.setState({
                    ...self.state,
                    tags: self.state.tags.filter(t => t.id !== deletedTag.tag.id)
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

        if (isCompositionDeleteSubmit) {
            if (deletedComposition && deletedComposition.composition && !deletedComposition.loading) {
                const compObj = get.compositions.filter(c => c.id !== deletedComposition.composition.id)
                const filteredObj = filteredCompositions.filter(c => c.id !== deletedComposition.composition.id)
                self.setState({
                    ...self.state,
                    get: {
                        ...self.state.get,
                        compositions: compObj
                    },
                    filteredCompositions: filteredObj,
                    selectedComposition: filteredObj && filteredObj.length > 0 ? filteredObj[0] : null,
                    isCompositionDeleteSubmit: false
                })

                toast.success('Composition deleted successfully!')
            } else {
                if (deletedComposition && deletedComposition.error && !deletedComposition.loading) {
                    toast.error(deletedComposition.error, {
                        onClose: () => {
                            self.setState({
                                ...self.state,
                                isCompositionDeleteSubmit: false
                            })
                        }
                    })
                }
            }
        }

        if (isDuplicateComposition) {
            if (addedComposition && addedComposition.composition !== self.props.addedComposition.composition) {
                if (addedComposition.composition) {
                    self.setState({
                        isDuplicateComposition: false
                    })

                    self.props.getComposition(clientUtils.get_user_id())

                    swal({
                        text: "Composition duplicated successfully!",
                        icon: "info",
                    })
                }
    
                if (fetchedComposition.error) {
                    toast.error(`Something wrong when trying to duplicate composition!`)
                }
            }
        }
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

    handleSearchComposition = e => {
        e.preventDefault()
        const self = this
        const value = e ? e.target.value : ''
        const {get} = self.state

        self.setState({
            compositionName: value
        })

        if (value) {
            const newCompositions = get.compositions.filter(c => {
                const cName = c.name.toLowerCase()
                const val = value.toLowerCase()

                return cName.indexOf(val) > -1
            })

            self.setState({
                filteredCompositions: newCompositions,
                pagination: {
                    ...self.state.pagination,
                    total: newCompositions.length,
                    numPage: new Array(Math.ceil(newCompositions.length / self.state.pagination.size)).fill(0)
                }
            })
        } else {
            self.setState({
                filteredCompositions: get.compositions,
                pagination: {
                    ...self.state.pagination,
                    total: get.compositions.length,
                    numPage: new Array(Math.ceil(get.compositions.length / self.state.pagination.size)).fill(0)
                }
            })    
        }

        return false
    }

    handleSelectComposition = (e, selectedComposition) => {
        if (e) e.preventDefault()
        const self = this
        self.setState({
            selectedComposition: null
        })

        setTimeout(() => {
            self.setState({
                ...self.state,
                selectedComposition,
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

        if (selectedComposition) {
            setTimeout(() => {
                self.props.getTag(selectedComposition.id)
            }, 100)
        }

        return false
    }

    handleAddTag = e => {
        e.preventDefault()
        const self = this
        const form = $(e.target)
        const {tag, selectedComposition, isTagEdit} = self.state
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
                        asset_id: selectedComposition.id
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
        })

        return false
    }

    handleDeleteComposition = (e, composition) => {
        e.preventDefault()
        const self = this

        self.setState({
            ...self.state,
            isCompositionDeleteSubmit: true
        })

        swal({
            text: "Are you sure you want to delete composition?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                self.props.deleteComposition(composition.id)
            }
        });

        return false
    }

    handleDuplicateComposition = (isSaveAndExit, callback) => {
        const self = this
        const {selectedComposition, newCompositionName} = self.state
        const comp = {
            name: newCompositionName,
            version: 1,
            duration: selectedComposition.duration,
            template_id: selectedComposition.template_id,
            user_id: selectedComposition.user_id,
            zones: [
                ...selectedComposition.zones.map(z => {
                    return {
                        id: z.id,
                        assets: [
                            ...z.assets.map(zA => {
                                return {
                                    id: zA.id,
                                    duration: zA.duration,
                                    z_index: zA.z_index
                                }
                            })
                        ]
                    }
                })
            ]
        }

        self.setState({
            isDuplicateComposition: true
        })
        
        self.props.addComposition(comp)
        callback()
    }

    handleAssignComposition = (e, composition) => {
        e.preventDefault()
        const self = this

        if (composition) {
            swal({
                text: `Are you sure you want to assign '${composition.name}' as default template?`,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then(ok => {
                if (ok) {
                    self.props.onAssignComposition(composition)
                }
            });
        }

        return false
    }

    render() {
        const {isAssignable} = this.props
        const {get, compositionLoading, selectedComposition, filteredCompositions, pagination, compositionName, tags, tag, isSubmit, newCompositionName} = this.state
        const displayCompositions = filteredCompositions && filteredCompositions.length > 0 ? filteredCompositions.slice(pagination.page * pagination.size, (pagination.page + 1) * pagination.size) : []
        const compositionsMarkup = get.compositions && get.compositions.length > 0 ? (
            <React.Fragment>
                {!isAssignable && (
                    <React.Fragment>
                        <Preview selectedAsset={selectedComposition} isIframe={true} />
                        <SaveComposition oldComposition={selectedComposition} compositionName={newCompositionName} isDuplicateComposition={true} onChangeCompositionName={val => this.setState({
                                                            newCompositionName: val
                                                        })} onCreateComposition={this.handleDuplicateComposition} />
                        <div className="ads__top-bar">
                            <a href="/dashboard/composition/create" className="btn btn-primary rounded">
                                <i className="icon-plus"></i>
                                <span>Create Composition</span>
                            </a>
                            <div className="ads__search-box">
                                <input type="text" placeholder="Search..." value={compositionName} onChange={this.handleSearchComposition}/>
                                <i className="icon-search"></i>
                            </div>
                        </div>
                    </React.Fragment>
                )}
                <div className="ads__display_grid">
                    <div className="ads__display_list type-2">
                        <div className="table-content">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Content Name</th>
                                        <th>Aspect Ratio</th>
                                        <th>Creation Date</th>
                                        {isAssignable && (
                                            <th>Options</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayCompositions && displayCompositions.length > 0 ? displayCompositions.map((c, cIndex) => {
                                        return (
                                            <tr key={cIndex} onClick={e => this.handleSelectComposition(e, c)} className={selectedComposition && c.id == selectedComposition.id ? 'selected' : ''}>
                                                <td>{c.name}</td>
                                                <td>{c.template_user_id ? `${c.template_width}*${c.template_height}` : `${c.template_width}:${c.template_height}`}</td>
                                                <td>{clientUtils.format_date(c.created_at)}</td>
                                                {isAssignable && (
                                                    <td>
                                                        <a className="action-btn" href="#" onClick={e => this.handleAssignComposition(e, c)}>
                                                            <i className="icon-eye"></i>
                                                            <span>Assign</span>
                                                        </a>
                                                    </td>
                                                )}
                                            </tr>
                                        )
                                    }) : (
                                        <tr>
                                            <td colspan="3">No composition found!</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className="foot">
                                {filteredCompositions && filteredCompositions.length > 0 ? (
                                    <p>{filteredCompositions.length} {filteredCompositions.length > 1 ? 'compositions' : 'composition'}</p>
                                ) : (
                                    <p>0 composition</p>
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
                    </div>
                    {selectedComposition && (
                        <div className="ads__display_detail">
                            <div className="ads__display_detail-content">
                                <ul className="nav nav-tabs">
                                    <li className="nav-item"><a className="nav-link active" data-toggle="tab" href="#content">Content</a></li>
                                    {!isAssignable && (
                                        <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#tags">Tags</a></li>
                                    )}
                                    <div className="right-icons">
                                        {!isAssignable && (
                                            <React.Fragment>
                                                <a href="#save-composition-modal" data-toggle="modal"><i className="icon-files"></i></a>
                                                <a href={`/dashboard/composition/edit/${selectedComposition.id}`}><i className="icon-pencil"></i></a>
                                                <a href="#" onClick={e => this.handleDeleteComposition(e, selectedComposition)}><i className="icon-trash"></i></a>
                                            </React.Fragment>
                                        )}
                                        <a href="#" onClick={e => this.handleSelectComposition(e, null)}><i className="icon-close"></i></a>
                                    </div>
                                </ul>
                                <div className="tab-content">
                                    <div className="tab-pane fade show active" id="content">
                                        <div className="detail-block">
                                            <div className={`preview ${isAssignable ? 'disabled' : ''}`}>
                                                <a href={isAssignable ? '' : '#preview-modal'} data-toggle="modal">
                                                    <iframe src={`/preview/${selectedComposition.id}/thumbnail`}></iframe>
                                                    {!isAssignable && (
                                                        <React.Fragment>
                                                            <span className="mask"></span>
                                                            <span className="play-btn"></span>
                                                        </React.Fragment>
                                                    )}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="detail-block">
                                            <h4><span>Composition</span></h4>
                                            <p><span>Name</span><span>: {selectedComposition.name}</span></p>
                                            <p><span>Version</span><span>: {selectedComposition.version}</span></p>
                                            {selectedComposition.duration && (<p><span>Duration</span><span>: {clientUtils.format_duration(selectedComposition.duration)}</span></p>)}
                                            <p><span>Modified Time</span><span>: {clientUtils.format_date(selectedComposition.modified_at)}</span></p>
                                            <p><span>Aspect Ratio</span><span>: {selectedComposition.template_user_id ? `${selectedComposition.template_width}*${selectedComposition.template_height}` : `${selectedComposition.template_width}:${selectedComposition.template_height}`}</span></p>
                                            <p><span>Screen Type</span><span>: {selectedComposition.orientation ? 'Horizontal' : 'Vertical'}</span></p>
                                        </div>
                                        <div className="detail-block d-none">
                                            <h4><span>Active In Schedules</span></h4>
                                            <p>Sch - 22-Aug-19 11:07</p>
                                        </div>
                                    </div>
                                    {!isAssignable && (
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
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </React.Fragment>
        ) : (
            <div className="no-result">
                <img src="/dist/images/composition.svg" alt="Composition" />
                <p>You can make composition out of the assets added.</p>
                <a href="/dashboard/composition/create" className="btn btn-primary rounded">
                    <i className="icon-plus"></i>
                    <span>Create Composition</span>
                </a>
            </div>
        )
        
        return(
            <div className={`ads__display ${compositionLoading ? 'loading' : ''}`}>
                {compositionsMarkup}
            </div>
        )
    }
}

export default Composition

