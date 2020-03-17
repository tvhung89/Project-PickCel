import React, {Component} from 'react'
import { toast } from 'react-toastify'
import swal from 'sweetalert'

import config from '../../../config/config'
import clientUtils from '../../utils'

import {AddDisplay} from '../../containers/dashboard/modals/AddDisplay'
import {Welcome} from '../../containers/dashboard/modals/Welcome'
import Guide from '../../components/dashboard/modals/Guide'
import Preview from '../../components/dashboard/modals/Preview'
import AssignComposition from '../../components/dashboard/modals/AssignComponent'
import TroubleShoot from '../../components/dashboard/modals/TroubleShoot'
import Tags from './Tags'
class Display extends Component {
    constructor(props) {
        super(props)

        this.state = {
            display: {
              get: []
            },
            fetchedDisplays: null,
            fetchedDisplaysLoading: 1,
            filteredDisplays: [],
            selectedDisplay: null,
            pagination: {
                size: config.page_size,
                page: 0,
                total: 0,
                numPage: 0
            },
            tag: {
                id: '',
                key: '',
                value: ''
            },
            tags: null,
            tagsLoading: 1,
            isSubmit: false,
            isTagEdit: false,
            isEditSubmit: false,
            isDeleteSubmit: false,
            detailSection: 0,
            details: {
                name: '',
                address: '',
                location: '',
                orientation: true
            },
            isDetailsSubmit: false,
            isOrientationSubmit: false,
            isSchedulePreviewing: true,
            searchDisplay: '',
            toggleFilter: false,
            displayTags: [],
            category: 10,
        }
    }

    componentDidMount() {
        const self = this
        const user_id = clientUtils.get_user_id()
        if (user_id) {
            self.props.getDisplay(user_id)
        }
    }

    componentWillReceiveProps(props) {
        const self = this
        const {fetchedDisplay, fetchedTag, addedTag, updatedTag, deletedTag, updatedDisplay, displayTags} = props
        const {isSubmit, isEditSubmit, isDeleteSubmit, isDetailsSubmit, filteredDisplays, isOrientationSubmit, isTagEdit} = self.state
        const isNotModified =  !isEditSubmit && !isDeleteSubmit && !isSubmit && !isTagEdit
        if (fetchedDisplay && fetchedDisplay.display && fetchedDisplay != self.props.fetchedDisplay) {
            const displays = fetchedDisplay.display
            if(displays){
                const displayFetched = fetchedDisplay.display.length > 0 ? fetchedDisplay.display.sort((a, b) => clientUtils.compare_date(b.modified_at, a.modified_at)) : [fetchedDisplay.display]
                self.setState({
                    display: {
                        get: displayFetched
                    },
                    fetchedDisplays: displays,
                    fetchedDisplaysLoading: fetchedDisplay.loading,
                    filteredDisplays: displays,
                    pagination: {
                        ...self.state.pagination,
                        total: displays.length,
                        numPage: new Array(Math.ceil(displays.length / self.state.pagination.size)).fill(0)
                    }
                })
            }
        } else {
            if (fetchedDisplay && fetchedDisplay.error && !fetchedDisplay.loading && isNotModified) {
                self.setState({
                    fetchedDisplaysLoading: fetchedDisplay.loading
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

        
        if (displayTags && displayTags.tags && !displayTags.loading) {
            const tags = displayTags.tags.reduce(function (r, a) {
                r[a.key] = r[a.key] || [];
                r[a.key].push(a);
                return r;
            }, Object.create(null))

            self.setState({
                displayTags: tags
            })
        } else {
            if (displayTags && displayTags.error && !displayTags.loading) {
                self.setState({
                    displayTags: null
                })
            }
        }

        if (isSubmit) {
            if (addedTag && addedTag.tag && !addedTag.loading) {
                self.setState({
                    ...self.state,
                    tags: self.state.tags ? (self.state.tags.filter(t => t.id == addedTag.tag.id).length > 0 ? [...self.state.tags] : [...self.state.tags, addedTag.tag]) : [addedTag.tag],
                    tag: {
                        key: '',
                        value: ''
                    },
                    isSubmit: false,
                    toggleFilter: false,
                })

                toast.success('Tag added successfully!', {
                    onClose: () => {
                        self.props.getDisplay(clientUtils.get_user_id())
                        self.props.getDisplayTags()
                        self.props.getTag(self.state.selectedDisplay.id)
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

                const originalUpdatedDisplays = self.state.display.get.map(a => {
                    const newTags = a.tags.map(t => {
                        if (t.id === updatedTag.tag.id) return updatedTag.tag
                        return t
                    })
                    return {
                        ...a,
                        tags: newTags
                    }
                })
                const updatedDisplays = self.state.filteredDisplays.map(a => {
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
                    display: {
                        ...self.state.display,
                        get: originalUpdatedDisplays
                    },
                    filteredDisplays: updatedDisplays,
                    tag: {
                        id: '',
                        key: '',
                        value: ''
                    },
                    isEditSubmit: false,
                    toggleFilter: false,
                })

                toast.success('Tag updated successfully!')
            } else {
                if (updatedTag && updatedTag.error && !updatedTag.loading) {
                    toast.error(updatedTag.error, {
                        onClose: () => {
                            // self.props.getDisplay(clientUtils.get_user_id())
                            // self.props.getDisplayTags()
                            // self.props.getTag(self.state.selectedDisplay.id)
                            self.setState({
                                ...self.state,
                                isEditSubmit: false
                            })
                        }
                    })
                }
            }
        }

        if (isDeleteSubmit) {
            if (deletedTag && deletedTag.tag && !deletedTag.loading) {

                const originalUpdatedDisplays = self.state.display.get.map(a => {
                    const newTags = a.tags.filter(t => t.id !== deletedTag.tag.id)

                    return {
                        ...a,
                        tags: newTags
                    }
                })

                const updatedDisplays = self.state.filteredDisplays.map(a => {
                    const newTags = a.tags.filter(t => t.id !== deletedTag.tag.id)

                    return {
                        ...a,
                        tags: newTags
                    }
                })

                self.setState({
                    ...self.state,
                    tags: self.state.tags.filter(t => t.id !== deletedTag.tag.id),
                    display: {
                        ...self.state.display,
                        get: originalUpdatedDisplays
                    },
                    filteredDisplays: updatedDisplays,
                    toggleFilter: false,
                })

                toast.success('Tag deleted successfully!', {
                    onClose: () => {
                        // self.props.getDisplay(clientUtils.get_user_id())
                        // self.props.getDisplayTags()
                        // self.props.getTag(self.state.selectedDisplay.id)
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

        if (isDetailsSubmit || isOrientationSubmit) {
            if (updatedDisplay && updatedDisplay.display && !updatedDisplay.loading) {
                self.setState({
                    ...self.state,
                    filteredDisplays: self.state.filteredDisplays.map(d => {
                        if (d.id === updatedDisplay.display.id) {
                            return updatedDisplay.display
                        }
                        return d
                    }),
                    selectedDisplay: updatedDisplay.display,
                    detailSection: 0,
                    isDetailsSubmit: false,
                    isOrientationSubmit: false
                })

                toast.success('Display details updated successfully!', {
                    onClose: () => {
                        $('#assign-composition-modal').modal('hide')
                    }
                })
            } else {
                if (updatedDisplay && updatedDisplay.error && !updatedDisplay.loading) {
                    self.setState({
                        ...self.state,
                        isDetailsSubmit: false,
                        isOrientationSubmit: false
                    })
                    toast.error(updatedDisplay.error, {
                        onClose: () => {
                            $('#assign-composition-modal').modal('hide')
                        }
                    })
                }
            }
        }
    }

    handleSearchDisplay = e => {
        e.preventDefault()
        const self = this
        const value = e.target.value

        if (value) {
            const displays = self.state.filteredDisplays.filter(d => {
                const name = d.name.toString().toLowerCase()
                const val = value.toString().toLowerCase()
                return name.indexOf(val) > -1
            })
            self.setState({
                ...self.state,
                filteredDisplays: displays,
                pagination: {
                    ...self.state.pagination,
                    total: displays.length,
                    numPage: new Array(Math.ceil(displays.length / self.state.pagination.size)).fill(0),
                    page: 0
                }
            })
        } else {
            const displays = self.state.fetchedDisplays
            self.setState({
                ...self.state,
                filteredDisplays: displays,
                pagination: {
                    ...self.state.pagination,
                    total: displays.length,
                    numPage: new Array(Math.ceil(displays.length / self.state.pagination.size)).fill(0),
                    page: 0
                }
            })
        }

        return false
    }

    handleSelectDisplay = (e, selectedDisplay) => {
        e.preventDefault()
        const self = this
        self.setState({
            ...self.state,
            selectedDisplay,
            isTagEdit: false,
            isSubmit: false,
            isEditSubmit: false,
            isDeleteSubmit: false,
            tag: {
                id: '',
                key: '',
                value: ''
            },
            details: {
                name: selectedDisplay && selectedDisplay.name ? selectedDisplay.name : '',
                address: selectedDisplay && selectedDisplay.address ? selectedDisplay.address: '',
                location: selectedDisplay && selectedDisplay.location ? selectedDisplay.location : '',
                orientation: selectedDisplay ? selectedDisplay.orientation : true
            }
        })

        setTimeout(() => {
            self.props.getTag(selectedDisplay.id)
        }, 100)

        return false
    }

    handlePaginationChange = (e, page) => {
        e.preventDefault()
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

    handleAddTag = e => {
        e.preventDefault()
        const self = this
        const form = $(e.target)
        const {tag, selectedDisplay, isTagEdit} = self.state
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
                        display_id: selectedDisplay.id
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

    handleChangeSection = (e, section) => {
        e.preventDefault()
        const self = this

        self.setState({
            ...self.state,
            detailSection: section
        })

        return false
    }

    handleChangeDetails = e => {
        e.preventDefault()
        const self = this
        const form = $(e.target)
        const {details, selectedDisplay} = self.state

        if (form.valid()) {
            self.setState({
                ...self.state,
                isDetailsSubmit: true
            })

            setTimeout(() => {
                self.props.updateDisplay({
                    id: selectedDisplay.id,
                    name: details.name,
                    address: details.address,
                    location: details.location,
                    selected: false
                })
            }, 100)
        }

        return false
    }

    handleOrientationChange = e => {
        e.preventDefault()
        const self = this
        const form = $(e.target)
        const {details, selectedDisplay} = self.state

        if (form.valid()) {
            self.setState({
                isOrientationSubmit: true
            })

            setTimeout(() => {
                self.props.updateDisplay({
                    id: selectedDisplay.id,
                    orientation: details.orientation,
                    selected: false
                })
            }, 100)
        }

        return false
    }

    handlePreview = (e, isSchedulePreviewing) => {
        const self = this
        self.setState({
            isSchedulePreviewing
        })
    }

    handleAssignComposition = (composition) => {
        const self = this
        const {selectedDisplay} = self.state

        if (selectedDisplay && composition) {
            self.setState({
                isDetailsSubmit: true
            })

            self.props.updateDisplay({
                id: selectedDisplay.id,
                default_composition_id: composition.id,
                selected: false
            })
        }
    }

    displayByCategory = (e, category) => {
        e.preventDefault()
        const self = this
        const {display, pagination} = self.state
        const allDisplays = display && display.get && display.get.length > 0 ? (category == 10 ? display.get : display.get.filter(a => a.type == category)) : []

        self.setState({
            category,
            searchDisplay: '',
            filteredDisplays: allDisplays,
            pagination: {
                ...pagination,
                total: allDisplays.length,
                numPage: new Array(Math.ceil(allDisplays.length / pagination.size)).fill(0)
            }
        })
    }

    handleToggleFilter = e => {
        e.preventDefault();
        const self = this;
        self.state.selectedDisplay?self.props.getTag(self.state.selectedDisplay.id):''
        self.setState({
            toggleFilter: !self.state.toggleFilter
        })

        return false;
    }

    handleFilter = conditions => {
        const self = this
        const {display, searchDisplay, category} = self.state
        const displays = display.get.filter(d => { //assets là nội dung
            const name = d.name.toString().toLowerCase()
            const val = searchDisplay.toString().toLowerCase()
            const isTruthy = name.indexOf(val) > -1 && (d.type == category || category == 10)

            if (conditions.length > 0) {
                return isTruthy && d.tags.find(t => conditions.find(c => c.key === t.key && c.value === t.value))
            }
            return isTruthy
        })
        self.setState({
            filteredDisplays: displays,
            pagination: {
                ...self.state.pagination,
                total: displays.length,
                numPage: new Array(Math.ceil(displays.length / self.state.pagination.size)).fill(0),
                page: 0
            }
        })
    }

    render() {
        const {fetchedDisplays, fetchedDisplaysLoading, filteredDisplays, selectedDisplay, pagination, tags, tagsLoading, tag, isSubmit, detailSection, details, isSchedulePreviewing,toggleFilter, displayTags, searchDisplay} = this.state
        const loaderClasses = `${fetchedDisplaysLoading || tagsLoading ? 'loading' : ''}`
        let playingComposition = clientUtils.is_schedule_playing(selectedDisplay ? selectedDisplay.schedule : null)
        playingComposition = playingComposition ? (playingComposition.length > 0 && isSchedulePreviewing ? playingComposition[0] : selectedDisplay.composition) : (selectedDisplay ? selectedDisplay.composition : null)
        const displayMarkup = fetchedDisplays && fetchedDisplays.length > 0 ? (
            <div className={`ads__display ${loaderClasses}`}>
                <div className="ads__top-bar">

                <div className="ads__top-bar-left">
                                    <a href="#" onClick={this.handleToggleFilter}>
                            <i className="icon-filter"></i>
                        </a>
                    <button className="btn btn-primary rounded" type="button" data-toggle="modal" data-target="#display-modal"><i className="icon-plus"></i><span>Add display</span></button>
                </div>
                    <div className="ads__search-box">
                        <input type="text" onChange={this.handleSearchDisplay}  value={searchDisplay} placeholder="Search..."/><i className="icon-search"></i>
                    </div>
                </div>
                <div className="ads__display_grid">
                {toggleFilter && (<Tags 
                                            displayTags={displayTags}
                                            onFilterClose={() => this.setState({toggleFilter: false})}
                                            onInit={e => {this.props.getDisplayTags()}}
                                            onFilter={this.handleFilter} 
                                            />)
                                            }
                    <div className="ads__display_list">
                        <table id="display_list">
                            <thead>
                                <tr>
                                    <th>Display Name</th>
                                    <th>Current Schedule</th>
                                    <th>Last Seen Online</th>
                                    <th>Content Status</th>
                                    <th>Network Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDisplays && filteredDisplays.length > 0 && filteredDisplays.slice(pagination.page * pagination.size, (pagination.page + 1) * pagination.size).map(d => {
                                    const networkStatusClasses = `network-status ${d.network_status ? 'on' : 'off'}`
                                    return (
                                        <tr key={d.id} onClick={e => this.handleSelectDisplay(e, d)}>
                                            <td>{d.name}</td>
                                            <td>{d.schedule ? d.schedule.name : 'No Schedule'}</td>
                                            <td>{clientUtils.format_date(d.online_at)}</td>
                                            <td><i className="icon-close"></i></td>
                                            <td>
                                                <div className={networkStatusClasses}></div>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {filteredDisplays && filteredDisplays.length == 0 && (
                                    <tr>
                                        <td colSpan="5">No display found!</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="foot">
                            {fetchedDisplays && fetchedDisplays.length > 0 && (
                                <p>{fetchedDisplays.length} {fetchedDisplays.length > 1 ? 'displays' : 'display'}</p>
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
                                    <li className={`page-item ${pagination.page == pagination.numPage.length - 1 ? 'disabled' : ''}`}><a className="page-link" href="#"><i className="icon-angle-double-right"></i></a></li>
                                    <li className={`page-item ${pagination.page == pagination.numPage.length - 1 ? 'disabled' : ''}`}><a className="page-link" href="#"><i className="icon-angle-right"></i></a></li>
                                </ul>
                            )}
                        </div>
                    </div>
                    {selectedDisplay && (
                        <React.Fragment>
                            <div className={`ads__display_detail ${detailSection !== 0 ? 'd-none' : ''}`}>
                                <div className="ads__display_detail-header">
                                    <h4 className="off"><span>{selectedDisplay.name}</span>
                                        <a href="#" onClick={e => this.handleChangeSection(e, 1)}>
                                            <i className="icon-pencil"></i>
                                        </a>
                                    </h4>
                                    <a href="#" onClick={e => this.handleSelectDisplay(e, null)}>
                                        <i className="icon-close"></i>
                                    </a>
                                    <p><i className="icon-location-pin"></i><span>: {selectedDisplay.location} - {selectedDisplay.address}</span></p>
                                </div>
                                <div className="ads__display_detail-content">
                                    <ul className="nav nav-tabs">
                                        <li className="nav-item"><a className="nav-link active" data-toggle="tab" href="#content">Content</a></li>
                                        <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#device-info">Device Info</a></li>
                                        <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#tags">Tags</a></li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-toggle="modal" href="#troubleshoot-modal">
                                                <i className="icon-shield"></i>
                                            </a>
                                        </li>
                                        <div className="right-icons">
                                            <a href="#" onClick={e => this.handleChangeSection(e, 2)}>
                                                <i className="icon-settings"></i>
                                            </a>
                                        </div>
                                    </ul>
                                    <div className="tab-content">
                                        <div className="tab-pane fade show active" id="content">
                                            <div className="detail-block">
                                                <h4><span>Currently Playing</span><a href="#preview-modal" data-toggle="modal" onClick={e => this.handlePreview(e, true)}><i className="icon-eye"></i></a></h4>
                                                {selectedDisplay.schedule && playingComposition && !playingComposition.template_width ? (
                                                    <React.Fragment>
                                                        <p><span>Composition</span><span>: {selectedDisplay.schedule.name}</span></p>
                                                        <p><span>Type</span><span>: Schedule</span></p>
                                                    </React.Fragment>
                                                ) : (
                                                    <React.Fragment>
                                                        <p><span>Composition</span><span>: {selectedDisplay.composition.name}</span></p>
                                                        <p><span>Type</span><span>: {selectedDisplay.composition.id == config.default_composition_id ? 'Default' : ''} Composition</span></p>
                                                    </React.Fragment>
                                                )}

                                            </div>
                                            {selectedDisplay.composition && (
                                                <div className="detail-block">
                                                    <h4>
                                                        <span>Default Composition</span>
                                                        <a href="#preview-modal" data-toggle="modal" onClick={e => this.handlePreview(e, false)}>
                                                            <i className="icon-eye"></i>
                                                        </a>
                                                            <a href="#assign-composition-modal" data-toggle="modal">
                                                                <i className="icon-pencil"></i>
                                                            </a>
                                                        </h4>
                                                    <p><span>Name</span><span>:{selectedDisplay.composition.name}</span></p>
                                                    <p><span>Version</span><span>:{selectedDisplay.composition.version}</span></p>
                                                </div>
                                            )}
                                            <div className="detail-block">
                                                <h4><span>Active Schedule</span></h4>
                                                {selectedDisplay.schedule && (
                                                    <React.Fragment>
                                                        <p><span>Name</span><span>:{selectedDisplay.schedule.name}</span></p>
                                                        <p><span>Version</span><span>:{selectedDisplay.schedule.version}</span></p>
                                                        <p><span>Schedule Start Time</span><span>:{clientUtils.get_min_max_date(selectedDisplay.schedule).min}</span></p>
                                                        <p><span>Schedule End Time</span><span>:{clientUtils.get_min_max_date(selectedDisplay.schedule).max}</span></p>
                                                    </React.Fragment>
                                                )}
                                                {!selectedDisplay.schedule && (
                                                    <p>Currently, no schedule associated</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="device-info">
                                            <div className="detail-block">
                                                <h4><span>Current Status</span></h4>
                                                <p><span>Last Network Speed</span><span>:{clientUtils.is_available(selectedDisplay.network_speed)}</span></p>
                                                <p><span>Private IP</span><span>:{clientUtils.is_available(selectedDisplay.private_ip)}</span></p>
                                                <p><span>Public IP</span><span>:{clientUtils.is_available(selectedDisplay.public_ip)}</span></p>
                                                <p><span>APK Version</span><span>:{clientUtils.is_available(selectedDisplay.apk_version)}</span></p>
                                                <p><span>Javascript Version</span><span>:{clientUtils.is_available(selectedDisplay.javascript_version)}</span></p>
                                                <p><span>SDK Version (android)</span><span>:{clientUtils.is_available(selectedDisplay.sdk_version)}</span></p>
                                                <p><span>Available Storage</span><span>:{clientUtils.is_available(selectedDisplay.storage)}</span></p>
                                                <p><span>Available RAM</span><span>:{clientUtils.is_available(selectedDisplay.available_ram)}</span></p>
                                            </div>
                                            <div className="detail-block">
                                                <h4><span>Hardware Details</span></h4>
                                                <p><span>Brand</span><span>:{clientUtils.is_available(selectedDisplay.brand)}</span></p>
                                                <p><span>Device</span><span>:{clientUtils.is_available(selectedDisplay.device)}</span></p>
                                                <p><span>Manufacturer</span><span>:{clientUtils.is_available(selectedDisplay.manufacturer)}</span></p>
                                                <p><span>Hardware</span><span>:{clientUtils.is_available(selectedDisplay.hardware)}</span></p>
                                                <p><span>Model</span><span>:{clientUtils.is_available(selectedDisplay.model)}</span></p>
                                                <p><span>Total Storage</span><span>:{clientUtils.is_available(selectedDisplay.total_storage)}</span></p>
                                                <p><span>Total RAM</span><span>:{clientUtils.is_available(selectedDisplay.total_ram)}</span></p>
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
                                                                        ...this.state,
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
                            <div className={`ads__display_detail ${detailSection !== 2 ? 'd-none' : ''}`}>
                                <div className="ads__display_detail-popup ads__display_detail-settings">
                                    <h4><a href="#" onClick={e => this.handleChangeSection(e, 0)}><i className="icon-arrow-left-line"></i></a><span>Settings</span></h4>
                                    <div className="ads__display_detail-main">
                                        <p>Orientation</p>
                                        <form action="#" method="post" noValidate onSubmit={this.handleOrientationChange}>
                                            <div className="radio-list">
                                                <div className="radio">
                                                    <input className="form-control" id="horizontal" type="radio" checked={details.orientation} onChange={e => this.setState({
                                                        ...this.state,
                                                        details: {
                                                            ...this.state.details,
                                                            orientation: true
                                                        }
                                                    })} name="orientation"/>
                                                    <label htmlFor="horizontal">Horizontal</label>
                                                </div>
                                                <div className="radio">
                                                    <input className="form-control" id="vertical" type="radio" checked={!details.orientation} onChange={e => this.setState({
                                                        ...this.state,
                                                        details: {
                                                            ...this.state.details,
                                                            orientation: false
                                                        }
                                                    })} name="orientation"/>
                                                    <label htmlFor="vertical">Vertical</label>
                                                </div>
                                            </div>
                                            <button className="btn btn-success rounded" type="submit">Update</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className={`ads__display_detail ${detailSection !== 1 ? 'd-none' : ''}`}>
                                <div className="ads__display_detail-popup ads__display_detail-info">
                                    <h4><a href="#" onClick={e => this.handleChangeSection(e, 0)}><i className="icon-arrow-left-line"></i></a><span>Basic Details</span></h4>
                                    <form action="#" method="post" noValidate onSubmit={this.handleChangeDetails}>
                                        <div className="ads__display_detail-main">
                                            <div className="form-group">
                                                <label htmlFor="displayName">Display name</label>
                                                <input
                                                    className="form-control"
                                                    id="displayName"
                                                    type="text"
                                                    name="displayName"
                                                    value={details.name}
                                                    onChange={e => this.setState({
                                                        ...this.state,
                                                        details: {
                                                            ...this.state.details,
                                                            name: e.target.value
                                                        }
                                                    })}
                                                    data-rule-required="true"
                                                    placeholder="Enter display name"/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="completeAddress">Complete Address</label>
                                                <input
                                                    className="form-control"
                                                    id="completeAddress"
                                                    type="text"
                                                    name="completeAddress"
                                                    value={details.address}
                                                    onChange={e => this.setState({
                                                        ...this.state,
                                                        details: {
                                                            ...this.state.details,
                                                            address: e.target.value
                                                        }
                                                    })}
                                                    data-rule-required="true"
                                                    placeholder="Enter complete address"/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="googleLocation">Google Location</label>
                                                <input
                                                    className="form-control"
                                                    id="googleLocation"
                                                    type="text"
                                                    name="googleLocation"
                                                    value={details.location}
                                                    onChange={e => this.setState({
                                                        ...this.state,
                                                        details: {
                                                            ...this.state.details,
                                                            location: e.target.value
                                                        }
                                                    })}
                                                    data-rule-required="true"
                                                    placeholder="Enter a location"/>
                                            </div>
                                            <button className="btn btn-success rounded" type="submit">Update</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </div>
        ) : (
            <div className={`ads__display ${loaderClasses}`}>
                <img src="/dist/images/screen.svg" alt="Screen" />
                <p>Connect your display to Signage device and install Signage player to add display</p>
                <ul>
                    <li><a href="#">By Device</a></li>
                    <li><a href="#">Install Player</a></li>
                </ul>
                <button className="btn btn-primary rounded" type="button" data-target="#display-modal" data-toggle="modal">
                    <i className="icon-plus"></i>
                    <span>Add display</span>
                </button>
                <div className="players">
                    <p>Pickcel signage players</p>
                    <ul>
                        <li>
                            <a href="#">
                                <img src="/dist/images/android.png" />
                                <span>Android</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img src="/dist/images/chrome.png" />
                                <span>Chrome</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img src="/dist/images/windows.png" />
                                <span>Windows</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img src="/dist/images/amazon.png" />
                                <span>Firestick</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img src="/dist/images/macos.png" />
                                <span>MacOS</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img src="/dist/images/linux.png" />
                                <span>Linux</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img src="/dist/images/lg.png" />
                                <span>WebOS</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        )

        return(
            <React.Fragment>
                <Welcome />
                <Guide />
                <AddDisplay />
                <Preview selectedAsset={playingComposition} isIframe={true} />
                <AssignComposition selectedDisplay={selectedDisplay} onAssignComposition={this.handleAssignComposition} />
                <TroubleShoot />

                {displayMarkup}
            </React.Fragment>
        )
    }
}

export default Display