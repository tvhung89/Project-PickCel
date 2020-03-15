import React, {Component} from 'react'
import {Link} from "react-router-dom"

import {UploadFile} from '../../containers/dashboard/modals/UploadFile'
import {EditTemplate} from '../../containers/dashboard/modals/EditTemplate'
import SaveComposition from './modals/SaveComposition'
import Preview from './modals/Preview'

import config from '../../../config/config'
import clientUtils from '../../utils'
import * as types from '../../actions/actionTypes'
import {toast} from 'react-toastify'
import swal from 'sweetalert'

class CreateComposition extends Component {
    constructor(props) {
        super(props)

        this.state = {
            asset: {
                get: null
            },
            filteredAssets: [],
            category: 0,
            pagination: {
                size: config.page_size,
                page: 0,
                total: 0,
                numPage: 0
            },
            searchAsset: '',
            defaultTemplates: null,
            templates: null,
            selectedTemplate: null,
            compositionName: '',
            isEditCompositionName: false,
            isSaving: false,
            isSaveAndExit: false,
            isEditComposition: false,
            fetchedCompositionLoading: true,
            compositionId: null,
            isTempPreview: false
        }
    }

    componentDidMount() {
        const self = this
        const user_id = clientUtils.get_user_id()
        const {composition_id} = self.props.match.params

        if (user_id) {
            self.props.getAsset(user_id)
            self.props.getDefaultTemplates()
            self.props.getTemplates(user_id)

            self.setState({
                compositionName: `C - ${clientUtils.format_date(null, true)}`
            })

            if (composition_id) {
                self.props.getComposition({
                    id: composition_id
                })

                self.setState({
                    isEditComposition: true,
                    compositionId: composition_id
                })
            }
        }
    }

    initSortableItems(selectorId) {
        const self = this
        var layers = document.getElementById(selectorId)

        if (layers) {
            junkdrawer.restoreListOrder(selectorId)

            dragsort.makeListSortable(layers,
                verticalOnly, function (item) {
                    var group = item.toolManDragGroup
                    var list = group.element.parentNode
                    var id = list.getAttribute("id")
                    if (id == null) return

                    group.register('dragend', function () {
                        setTimeout(() => {
                            const {selectedTemplate} = self.state
                            let newZoneAssets = [...selectedTemplate.zones.find(z => z.selected).assets]

                            list.childNodes.forEach((i, idx) => {
                                const originalIndex = parseInt(i.getAttribute('data-zone-asset-index'))

                                if (newZoneAssets[originalIndex]) newZoneAssets[originalIndex].z_index = idx
                            })

                            const newSelectedTemplate = {
                                ...selectedTemplate,
                                zones: [
                                    ...selectedTemplate.zones.map(z => {
                                        if (z.selected) {
                                            return {
                                                ...z,
                                                assets: newZoneAssets
                                            }
                                        }
                                        return z
                                    })
                                ]
                            }

                            self.setState({
                                selectedTemplate: newSelectedTemplate
                            })

                            localStorage.setItem(types.CURRENT_COMPOSITION, JSON.stringify(newSelectedTemplate))
                        }, 500)
                    })
                })
        }
    }

    componentWillReceiveProps(props) {
        const self = this
        const {fetchedAsset, defaultTemplates, fetchedTemplate, addedComposition, updatedComposition, fetchedComposition} = props
        const {category, isSaveAndExit} = self.state

        if (fetchedAsset && fetchedAsset.asset && !fetchedAsset.loading && fetchedAsset.asset !== self.props.fetchedAsset.asset) {
            const assetFetched = fetchedAsset.asset && fetchedAsset.asset.length > 0 ? fetchedAsset.asset.sort((a, b) => clientUtils.compare_date(b.created_at, a.created_at)) : [fetchedAsset.asset]
            const displayAssets = assetFetched.filter(a => a.type == category)

            self.setState({
                ...self.state,
                asset: {
                    ...self.state.asset,
                    get: assetFetched
                },
                filteredAssets: assetFetched,
                pagination: {
                    ...self.state.pagination,
                    total: displayAssets.length,
                    numPage: new Array(Math.ceil(displayAssets.length / self.state.pagination.size)).fill(0)
                }
            })
        }

        if (defaultTemplates && defaultTemplates.templates && !defaultTemplates.loading && defaultTemplates.templates !== self.props.defaultTemplates.templates) {
            let preDefinedTemplates = [
                ...defaultTemplates.templates
            ]

            preDefinedTemplates = preDefinedTemplates.map(p => {
                const sortedZones = p.zones.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
                return {
                    ...p,
                    zones: [
                        ...sortedZones.map((z, index) => {
                            return {
                                ...z,
                                selected: index == 0,
                                assets: []
                            }
                        })
                    ]
                }
            })

            let selectedTemplate = localStorage.getItem(types.DEFAULT_TEMPLATE)
            selectedTemplate = selectedTemplate ? JSON.parse(selectedTemplate) : preDefinedTemplates[0]

            self.setState({
                ...self.state,
                defaultTemplates: preDefinedTemplates,
                selectedTemplate
            })

            localStorage.setItem(types.CURRENT_COMPOSITION, JSON.stringify(selectedTemplate))
        }

        if (fetchedTemplate && fetchedTemplate.template && !fetchedTemplate.loading && fetchedTemplate.template !== self.props.fetchedTemplate.template) {
            let selectedTemplate = localStorage.getItem(types.DEFAULT_TEMPLATE)
            selectedTemplate = selectedTemplate = selectedTemplate ? JSON.parse(selectedTemplate) : (self.state.defaultTemplates && self.state.defaultTemplates.length > 0 ? self.state.defaultTemplates[0] : fetchedTemplate.template[0])

            self.setState({
                ...self.state,
                templates: fetchedTemplate.template,
                selectedTemplate
            })
        }

        if (addedComposition && addedComposition.composition && addedComposition.composition != self.props.addedComposition.composition) {
            self.setState({
                isSaving: false
            })

            toast.success('Composition created successfully!')

            if (isSaveAndExit) {
                window.location = '/dashboard/composition'
            } else {
                window.location = `/dashboard/composition/edit/${addedComposition.composition.id}`
            }
        } else {
            if (addedComposition.error && !addedComposition.loading && addedComposition != self.props.addedComposition) {
                toast.error('There is an error when adding composition, please try again later!')

                self.setState({
                    isSaving: false
                })
            }
        }

        if (updatedComposition && updatedComposition.composition && updatedComposition.composition != self.props.updatedComposition.composition) {
            self.setState({
                isSaving: false
            })

            toast.success('Composition updated successfully!')
            if (isSaveAndExit) {
                window.location = '/dashboard/composition'
            } else {
                window.location = `/dashboard/composition/edit/${updatedComposition.composition.id}`
            }
        } else {
            if (updatedComposition.error && !updatedComposition.loading && updatedComposition != self.props.updatedComposition) {
                toast.error('There is an error when updating composition, please try again later!')

                self.setState({
                    isSaving: false
                })
            }
        }

        if (fetchedComposition && fetchedComposition.composition !== self.props.fetchedComposition.composition) {
            if (fetchedComposition.composition && fetchedComposition.composition.length > 0) {
                const cFetched = fetchedComposition.composition[0]
                const {template_id, template_name, template_width, template_height, orientation, zones, name, created_at, version} = cFetched

                setTimeout(() => {
                    const newSelectedTemplate = {
                        id: template_id,
                        name: template_name,
                        width: template_width,
                        height: template_height,
                        orientation,
                        created_at,
                        version,
                        zones: clientUtils.sort_by_key(zones, 'z_index').map((z, zIndex) => {
                            const {id, name, top, left, width, height, z_index, assets} = z
                            const returnedAssets = assets.map(a => {
                                const {id, name, content, type, duration, size, z_index} = a

                                return {
                                    id,
                                    name,
                                    content,
                                    type,
                                    duration,
                                    playbackDuration: duration,
                                    size,
                                    z_index
                                }
                            })

                            return {
                                id,
                                name,
                                top,
                                left,
                                width,
                                height,
                                z_index,
                                selected: !zIndex,
                                assets: clientUtils.sort_by_key(returnedAssets, 'z_index')
                            }
                        })
                    }

                    self.setState({
                        compositionName: name,
                        fetchedCompositionLoading: 0,
                        selectedTemplate: newSelectedTemplate
                    })

                    localStorage.setItem(types.CURRENT_COMPOSITION, JSON.stringify(newSelectedTemplate))
                }, 500)
            } else {
                window.location = '/dashboard/composition'
            }
        }
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

    handleRefreshTemplates = () => {
        const self = this
        const user_id = clientUtils.get_user_id()
        if (user_id) {
            self.props.getTemplates(user_id)
        }
    }

    handleSetDefaultTemplate = (template, callback) => {
        const self = this

        self.setState({
            selectedTemplate: template
        })

        localStorage.setItem(types.CURRENT_COMPOSITION, JSON.stringify(template))

        callback()
    }

    showCompositionNameInput = e => {
        e.preventDefault()
        const self = this
        const $this = $(e.target)
        const target = $($this.attr('data-target'))

        if (target) {
            setTimeout(() => {
                target.focus()
            }, 100)

            target.on('keyup', e => {
                const keyCode = e.keyCode

                if (keyCode == 13 || keyCode == 27) {
                    self.setState({
                        isEditCompositionName: false
                    })
                }

            })
            target.on('blur', () => {
                self.setState({
                    isEditCompositionName: false
                })
            })

            self.setState({
                isEditCompositionName: true
            })
        }

        return false
    }

    handleChangeAssetDuration = (e, zone, assetIndex) => {
        const self = this
        const {selectedTemplate} = self.state
        const dur = parseInt(e.target.value)

        if (!isNaN(dur)) {
            const newSelectedTemplate = {
                ...selectedTemplate,
                zones: [
                    ...selectedTemplate.zones.map(z => {
                        if (zone.id == z.id && z.selected) return {
                            ...z,
                            assets: [
                                ...z.assets.map((a, aIndex) => {
                                    return aIndex == assetIndex ? {
                                        ...a,
                                        playbackDuration: dur
                                    } : a
                                })
                            ]
                        }
                        return z
                    })
                ]
            }

            self.setState({
                selectedTemplate: newSelectedTemplate
            })

            localStorage.setItem(types.CURRENT_COMPOSITION, JSON.stringify(newSelectedTemplate))
        }
    }

    handleRemoveZoneAsset = (e, zone, assetIndex) => {
        e.preventDefault()
        const self = this
        const {selectedTemplate} = self.state
        const newSelectedTemplate = {
            ...selectedTemplate,
            zones: [
                ...selectedTemplate.zones.map(z => {
                    if (zone.id == z.id && z.selected) {
                        const fAssets = z.assets.filter(a => a.z_index != assetIndex)
                        return {
                            ...z,
                            assets: [
                                ...fAssets.map((sZ, sZIndex) => {
                                    return {
                                        ...sZ,
                                        z_index: sZIndex
                                    }
                                })
                            ]
                        }
                    }
                    return z
                })
            ]
        }

        self.setState({
            selectedTemplate: newSelectedTemplate
        })

        localStorage.setItem(types.CURRENT_COMPOSITION, JSON.stringify(newSelectedTemplate))

        return false
    }

    handleAddZoneAsset = (e, asset) => {
        e.preventDefault()
        const self = this
        const {selectedTemplate} = self.state
        const selectedAsset = {
            ...asset,
            playbackDuration: (asset.duration) ? asset.duration : 10
        }
        const newSelectedTemplate = {
            ...selectedTemplate,
            zones: [
                ...selectedTemplate.zones.map(z => {
                    if (z.selected) return {
                        ...z,
                        assets: [
                            ...z.assets,
                            {
                                ...selectedAsset,
                                z_index: z.assets.length
                            }
                        ]
                    }
                    return z
                })
            ]
        }

        self.setState({
            selectedTemplate: newSelectedTemplate
        })

        localStorage.setItem(types.CURRENT_COMPOSITION, JSON.stringify(newSelectedTemplate))

        setTimeout(() => {
            self.initSortableItems(`zone${selectedTemplate.zones.findIndex(z => z.selected)}`)
        }, 300)

        return false
    }

    getSelectedZoneDuration(isGetMaxDuration = false) {
        const self = this
        const {selectedTemplate} = self.state
        const selectedZone = selectedTemplate.zones && selectedTemplate.zones.length > 0 ? selectedTemplate.zones.find(z => z.selected) : []
        let duration = 0

        if (isGetMaxDuration) {
            const durations = selectedTemplate.zones && selectedTemplate.zones.length > 0 ? selectedTemplate.zones.map(z => {
                let tempDuration = 0
                const assets = z.assets

                if (assets && assets.length > 0) {
                    assets.forEach(a => {
                        tempDuration += a.playbackDuration
                    })
                }
                return tempDuration
            }) : [0]

            duration = Math.max.apply(null, durations)
        } else {
            if (selectedZone) {
                const assets = selectedZone.assets

                if (assets && assets.length > 0) {
                    assets.forEach(a => {
                        duration += a.playbackDuration
                    })
                }
            }
        }

        return duration
    }

    handleSwitchSelectedZone = (e, zoneIndex) => {
        const self = this
        const {selectedTemplate} = self.state
        const newSelectedTemplate = {
            ...selectedTemplate,
            zones: [
                ...selectedTemplate.zones.map((z, zIndex) => {
                    return {
                        ...z,
                        selected: zIndex == zoneIndex
                    }
                })
            ]
        }

        self.setState({
            selectedTemplate: newSelectedTemplate
        })

        localStorage.setItem(types.CURRENT_COMPOSITION, JSON.stringify(newSelectedTemplate))
    }

    handleValidComposition = e => {
        e.preventDefault()
        const self = this
        const {selectedTemplate, compositionName} = self.state
        const isZoneAssetsFilled = selectedTemplate.zones.filter(z => z.assets.length == 0)

        if (isZoneAssetsFilled.length > 0) {
            swal({
                text: 'Please add assets to all zones to proceed!',
                icon: "warning",
                dangerMode: true,
            })
        } else {
            $('#save-composition-modal').modal('show')
        }

        return false
    }

    handleCreateComposition = (isSaveAndExit, callback) => {
        const self = this
        const {selectedTemplate, compositionName, isEditComposition, compositionId} = self.state
        let comp = {
            name: compositionName,
            version: 1,
            duration: self.getSelectedZoneDuration(true),
            template_id: selectedTemplate.id,
            user_id: clientUtils.get_user_id(),
            zones: [
                ...selectedTemplate.zones.map(z => {
                    return {
                        id: z.id,
                        assets: [
                            ...z.assets.map(zA => {
                                return {
                                    id: zA.id,
                                    duration: zA.playbackDuration,
                                    z_index: zA.z_index
                                }
                            })
                        ]
                    }
                })
            ]
        }

        self.setState({
            isSaving: true,
            isSaveAndExit
        })

        if (isEditComposition && compositionId) {
            comp.id = compositionId
            comp.created_at = selectedTemplate.created_at
            comp.version = selectedTemplate.version

            setTimeout(() => {
                self.props.updateComposition(comp)
            }, 100)
        } else {
            setTimeout(() => {
                self.props.addComposition(comp)
            }, 100)
        }

        callback()
    }

    handleTempPreview = e => {
        e.preventDefault()
        const self = this
        const {selectedTemplate} = self.state
        const target = $(e.target)
        const modal = $(target.attr('data-target'))
        const isZoneAssetsFilled = selectedTemplate.zones.filter(z => z.assets.length == 0)

        if (isZoneAssetsFilled.length > 0) {
            swal({
                text: 'Please add assets to all zones to see preview!',
                icon: "warning",
                dangerMode: true,
            })
        } else {
            if (modal) {
                self.setState({
                    isTempPreview: true
                })

                modal.modal('show')
            }
        }

        return false
    }

    handleChangeTemplate = e => {
        e.preventDefault()
        const self = this
        const {selectedTemplate} = self.state
        const target = $(e.target)
        const modal = $(target.attr('data-target'))
        const isZoneAssetsFilled = selectedTemplate.zones.filter(z => z.assets.length > 0)

        if (isZoneAssetsFilled.length > 0) {
            swal({
                text: 'All changes will be lost, are you sure you want to proceed?',
                icon: "warning",
                dangerMode: true,
                buttons: true
            }).then((ok) => {
                if (ok) {
                    if (modal) {
                        modal.modal('show')
                    }
                }
            })
        } else {
            if (modal) {
                modal.modal('show')
            }
        }

        return false
    }

    refreshTemplate = () => {
        const self = this
        const user_id = clientUtils.get_user_id()

        if (user_id) {
            self.props.getTemplates(user_id)
        }
    }

    render() {
        const {filteredAssets, category, pagination, searchAsset, defaultTemplates, templates, selectedTemplate, compositionName, isEditCompositionName, isSaving, isEditComposition, fetchedCompositionLoading, isTempPreview, compositionId} = this.state

        const displayAssets = filteredAssets && filteredAssets.length > 0 ? filteredAssets.filter(a => a.type == category || category === 10) : []
        const assetListMarkup = displayAssets && displayAssets.length > 0 ? (
            <div className="table-content">
                <div className="ads__comp-right_items">
                    {displayAssets.slice(pagination.page * pagination.size, (pagination.page + 1) * pagination.size).map(a => {
                        return (
                            <div className="ads__comp-right_item" onClick={e => this.handleAddZoneAsset(e, a)}
                                 key={a.id}>
                                <div className="first">
                                    {a.type == 1 ? (
                                        <video>
                                            <source src={a.content}
                                                    type={`video/${clientUtils.get_media_extension(a.content)}`}/>
                                        </video>
                                    ) : (
                                        <img src={a.type == 2 ? `/dist/images/apps/${a.dimension}` : a.content}
                                             alt={a.name}/>
                                    )}
                                </div>
                                <div className="second">
                                    <p>{a.name}</p>
                                    {a.type == 2 ? (
                                        <p>App</p>
                                    ) : (
                                        <p>{a.dimension}</p>
                                    )}
                                </div>
                                <div className="third">
                                    <p>{clientUtils.format_date(a.created_at)}</p>
                                    {a.type != 2 && (
                                        <p>{clientUtils.format_memory_unit(a.size)}</p>
                                    )}
                                    {a.duration && (<p>{clientUtils.format_duration(a.duration)}</p>)}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="foot">
                    {displayAssets && displayAssets.length > 0 && (
                        <p>{displayAssets.length} {displayAssets.length > 1 ? 'assets' : 'asset'}</p>
                    )}
                    {pagination && pagination.numPage.length > 1 && (
                        <ul className="pagination">
                            <li className={`page-item ${pagination.page == 0 ? 'disabled' : ''}`}><a
                                className="page-link" href="#" onClick={e => this.handlePaginationChange(e, 0)}><i
                                className="icon-angle-double-left"></i></a></li>
                            <li className={`page-item ${pagination.page == 0 ? 'disabled' : ''}`}><a
                                className="page-link" href="#"
                                onClick={e => this.handlePaginationChange(e, pagination.page - 1)}><i
                                className="icon-angle-left"></i></a></li>
                            {pagination.numPage.length > 0 && pagination.numPage.map((n, index) => {
                                const activePageClasses = `page-item ${pagination.page === index ? 'active' : ''}`
                                return (
                                    <li className={activePageClasses} key={index}><a className="page-link" href="#"
                                                                                     onClick={e => this.handlePaginationChange(e, index)}>{index + 1}</a>
                                    </li>
                                )
                            })}
                            <li className={`page-item ${pagination.page == pagination.numPage.length - 1 ? 'disabled' : ''}`}>
                                <a className="page-link" href="#"
                                   onClick={e => this.handlePaginationChange(e, pagination.page + 1)}><i
                                    className="icon-angle-right"></i></a></li>
                            <li className={`page-item ${pagination.page == pagination.numPage.length - 1 ? 'disabled' : ''}`}>
                                <a className="page-link" href="#"
                                   onClick={e => this.handlePaginationChange(e, pagination.numPage.length - 1)}><i
                                    className="icon-angle-double-right"></i></a></li>
                        </ul>
                    )}
                </div>
            </div>
        ) : (
            <div className="table-content no-content">
                <img src="/dist/images/assets.svg" alt="Assets"/>
                <p>{`No ${category == 2 ? 'app' : 'asset'} found. Please start adding your ${category == 2 ? 'app' : 'asset'}!`}</p>
            </div>
        )

        return (
            <div
                className={`ads__comp ${(isEditComposition && fetchedCompositionLoading) || !defaultTemplates ? 'loading-text' : ''}`}>
                <UploadFile/>
                <EditTemplate defaultTemplates={defaultTemplates} templates={templates}
                              onRefreshTemplates={this.handleRefreshTemplates}
                              onSetDefaultTemplate={this.handleSetDefaultTemplate}
                              onRefreshTemplates={this.refreshTemplate}/>
                <SaveComposition compositionName={compositionName} onChangeCompositionName={val => this.setState({
                    compositionName: val
                })} onCreateComposition={this.handleCreateComposition}/>
                <Preview isTempPreview={isTempPreview} selectedAsset={selectedTemplate} isIframe={false}/>
                {selectedTemplate && (
                    <div className="ads__comp-left">
                        <div className="ads__comp-left_template">
                            <form action="#" method="post" noValidate onSubmit={this.handleValidComposition}>
                                <div
                                    className={`ads__comp-left_template-thumb ${selectedTemplate.orientation ? 'horizontal' : 'vertical'}`}>
                                    {selectedTemplate.zones && selectedTemplate.zones.length > 0 && selectedTemplate.zones.map((z, zIndex) => {
                                        return z.width <= 100 && z.height <= 100 ? (
                                            <div className={`${z.selected && 'selected'}`} style={{
                                                left: `${z.left}%`,
                                                top: `${z.top}%`,
                                                width: `${z.width}%`,
                                                height: `${z.height}%`,
                                                zIndex: z.z_index,
                                                display: 'block',
                                                position: 'absolute'
                                            }} key={zIndex}></div>
                                        ) : (
                                            <div className={`${z.selected && 'selected'}`} style={{
                                                left: `${z.left / selectedTemplate.width * 100}%`,
                                                top: `${z.top / selectedTemplate.height * 100}%`,
                                                width: `${z.width / selectedTemplate.width * 100}%`,
                                                height: `${z.height / selectedTemplate.height * 100}%`,
                                                zIndex: z.z_index,
                                                display: 'block',
                                                position: 'absolute'
                                            }} key={zIndex}></div>
                                        )
                                    })}
                                    {isEditComposition && (
                                        <a href={`/dashboard/composition/template/${compositionId}`}>
                                            <i className="icon icon-pencil"></i>
                                        </a>
                                    )}
                                </div>
                                <div className="ads__comp-left_template-info">
                                    <h3>
                                        {!isEditCompositionName && (
                                            <span>{compositionName}</span>
                                        )}
                                        <input id="composition-name"
                                               className={`${isEditCompositionName ? '' : 'd-none'}`}
                                               type="text"
                                               value={compositionName}
                                               onChange={e => {
                                                   this.setState({
                                                       compositionName: e.target.value
                                                   })
                                               }}/>
                                        {!isEditCompositionName && (
                                            <a href="#" onClick={this.showCompositionNameInput}
                                               data-target="#composition-name">
                                                <i className="icon-pencil"></i>
                                            </a>
                                        )}
                                    </h3>
                                    <p>
                                        <span>{selectedTemplate.name == config.template_temp_name ? 'Custom Template' : selectedTemplate.name} - {selectedTemplate.orientation ? 'Horizontal' : 'Vertical'}</span>
                                        <a href="#" data-target="#template-modal" onClick={this.handleChangeTemplate}>
                                            <i className="icon-pencil"></i>
                                        </a>
                                    </p>
                                </div>
                                <div className="ads__comp-left_template-actions">
                                    <button className={`btn btn-info rounded ${isSaving ? 'disabled' : ''}`}
                                            type="button" data-target="#preview-modal"
                                            onClick={this.handleTempPreview}>Preview
                                    </button>
                                    <button className={`btn btn-primary rounded ${isSaving ? 'loading disabled' : ''}`}
                                            type="submit">{isEditComposition ? 'Update' : 'Save'}</button>
                                </div>
                            </form>
                        </div>
                        <div className="ads__comp-left_list">
                            <ul className="nav nav-tabs nav-list">
                                {selectedTemplate.zones && selectedTemplate.zones.map((z, zIndex) => {
                                    return (
                                        <li className='nav-item' key={zIndex}>
                                            <a className={`nav-link ${z.selected ? 'active' : ''}`} data-toggle="tab"
                                               href={`#zone${zIndex}`}
                                               onClick={e => this.handleSwitchSelectedZone(e, zIndex)}>{z.name}</a>
                                        </li>
                                    )
                                })}
                                {this.getSelectedZoneDuration() > 0 && (
                                    <div className="right-icons">
                                        <p>{clientUtils.format_duration(this.getSelectedZoneDuration(), false)}</p>
                                    </div>
                                )}
                            </ul>
                            <div className="tab-content">
                                {selectedTemplate.zones && selectedTemplate.zones.map((z, zIndex) => {
                                    return (
                                        <ul className={`tab-pane fade ${z.selected ? 'active show' : ''}`}
                                            id={`zone${zIndex}`} key={zIndex}>
                                            {z.assets && z.assets.length > 0 ? z.assets.map((a, aIndex) => {
                                                return (
                                                    <li className="ads__comp-left_list-item" key={aIndex}
                                                        data-zone-asset-index={aIndex}>
                                                        <div className="first">
                                                            <p>{a.z_index + 1}</p>
                                                        </div>
                                                        <div className="second">
                                                            {a.type == 1 ? (
                                                                <video>
                                                                    <source src={a.content}
                                                                            type={`video/${clientUtils.get_media_extension(a.content)}`}/>
                                                                </video>
                                                            ) : (
                                                                <img
                                                                    src={a.type == 2 ? `/dist/images/apps/${a.dimension}` : a.content}
                                                                    alt={a.name}/>
                                                            )}
                                                        </div>
                                                        <div className="third">
                                                            <p>{a.name}</p>
                                                            <p>{clientUtils.format_memory_unit(a.size)}</p>
                                                        </div>
                                                        <div className="fourth">
                                                            {a.type == 1 ? (
                                                                <input type="text" value={a.playbackDuration} readOnly/>
                                                            ) : (
                                                                <input type="text" value={a.playbackDuration}
                                                                       onChange={e => this.handleChangeAssetDuration(e, z, aIndex)}/>
                                                            )}
                                                            <span>Seconds</span>
                                                        </div>
                                                        <div className="fifth">
                                                            <a href="#"
                                                               onClick={e => this.handleRemoveZoneAsset(e, z, a.z_index)}>
                                                                <i className="icon-trash"></i>
                                                            </a>
                                                        </div>
                                                    </li>
                                                )
                                            }) : (
                                                <li className="no-result">
                                                    <img src="/dist/images/assets_addition.svg"
                                                         alt="Adding assets guide"/>
                                                    <img src="/dist/images/empty_zone.svg" alt="Empty zone"/>
                                                </li>
                                            )}
                                        </ul>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
                <div className="ads__comp-right">
                    <div className="ads__comp-right_assets">
                        <ul className="nav nav-tabs nav-list">
                            <li className="nav-item"><a className="nav-link active" data-toggle="tab" href="#pane"
                                                        onClick={e => this.assetByCategory(e, 0)}>Image</a></li>
                            <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#pane"
                                                        onClick={e => this.assetByCategory(e, 1)}>Video</a></li>
                            <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#pane"
                                                        onClick={e => this.assetByCategory(e, 2)}>Apps</a></li>
                            <div className="right-icons">
                                <div className="ads__search-box">
                                    <input type="text" onChange={this.handleSearchAsset} value={searchAsset}
                                           placeholder="Search..."/><i className="icon-search"></i>
                                </div>
                                <button className="btn btn-primary rounded" type="button" data-toggle="modal"
                                        data-target="#upload-modal"><i
                                    className="icon-download"></i><span>Upload a file</span></button>
                            </div>
                        </ul>
                        <div className="tab-content">
                            <div className="tab-pane fade active show" id="pane">
                                {assetListMarkup}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateComposition

