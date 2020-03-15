import React, {Component} from 'react'

import Preview from './modals/Preview'

import clientUtils from '../../utils'
import * as types from '../../actions/actionTypes'
import { toast } from 'react-toastify'
import config from '../../../config/config'

class EditCompositionTemplate extends Component {
    constructor(props) {
        super(props)

        this.state = {
            compositionId: null,
            selectedComposition: null,
            fetchedCompositionLoading: true,
            zones: [],
            isShowGrid: true,
            resolution: {
                width: 640,
                height: 360
            },
            minSize: {
                width: 64,
                height: 36
            },
            minSnap: {
                width: 16,
                height: 9
            },
            isCustomResolution: false,
            isTempPreview: false,
            isSaving: false
        }   
    }

    componentDidMount() {
        const self = this
        const {composition_id} = self.props.match.params

        if (composition_id) {
            self.props.getComposition({
                id: composition_id
            })

            self.setState({
                compositionId: composition_id
            })
        }

        if (window.jQuery) {
            // Init scrollbar
            jQuery('.scrollbar-outer').scrollbar()
        }
    }

    initSortableItems() {
        const self = this
        var layers = document.getElementById("layers")
        
        if (layers) {
            junkdrawer.restoreListOrder("layers")

            dragsort.makeListSortable(layers,
                                verticalOnly, function(item) {
                                    var group = item.toolManDragGroup
                                    var list = group.element.parentNode
                                    var id = list.getAttribute("id")
                                    if (id == null) return

                                    group.register('dragend', function() {
                                        const newZones = [...self.state.zones]
                                        
                                        list.childNodes.forEach((i, idx) => {
                                            const originalIndex = parseInt(i.getAttribute('data-zone-index'))
                                            
                                            newZones[originalIndex].z_index = idx
                                        })

                                        self.setState({
                                            zones: newZones
                                        })

                                        self.updateSelectedComposition()
                                        // ToolMan.cookies().set("list-" + id, 
                                        //                     junkdrawer.serializeList(list), 365)
                                    })
                                })
        }
    }

    updateSelectedComposition() {
        const self = this

        setTimeout(() => {
            const {selectedComposition, zones, resolution} = self.state

            const selectedComp = {
                ...selectedComposition,
                zones: selectedComposition.zones.map(z => {
                    const zZone = zones.find(zz => zz.name == z.name)
                    return zZone ? (selectedComposition.width <= 16 && selectedComposition.height <= 16 ? {
                        ...z,
                        top: Math.round(zZone.top/resolution.height*100),
                        left: Math.round(zZone.left/resolution.width*100),
                        width: Math.ceil(zZone.width/resolution.width*100),
                        height: Math.ceil(zZone.height/resolution.height*100),
                        z_index: zZone.z_index
                    } : {
                        ...z,
                        top: Math.round(zZone.top * 3),
                        left: Math.round(zZone.left * 3),
                        width: Math.ceil(zZone.width * 3),
                        height: Math.ceil(zZone.height * 3),
                        z_index: zZone.z_index
                    } ) : z
                })
            }

            self.setState({
                selectedComposition: selectedComp
            })

            localStorage.setItem(types.CURRENT_COMPOSITION, JSON.stringify(selectedComp))
        }, 20)
    }

    trackInputChanges() {
        const self = this

        $('input[name="Top"]').on('change', function() {
            setTimeout(() => {
                const val = $(this).val()
                const selectedHandler = $('.handler-drag.selected');
                
                if (selectedHandler) {
                    self.setState({
                        zones: self.state.zones.map(z => {
                            if (z.selected) return {
                                ...z,
                                top: val/3
                            }
                        })
                    })
                }
            }, 300)
        })

        $('input[name="Left"]').on('change', function() {
            setTimeout(() => {
                const val = $(this).val()
                const selectedHandler = $('.handler-drag.selected');
                
                if (selectedHandler) {
                    self.setState({
                        zones: self.state.zones.map(z => {
                            if (z.selected) return {
                                ...z,
                                left: val/3
                            }
                        })
                    })
                }
            }, 300)
        })

        $('input[name="Width"]').on('change', function() {
            setTimeout(() => {
                const val = $(this).val()
                const selectedHandler = $('.handler-drag.selected');
                
                if (selectedHandler) {
                    self.setState({
                        zones: self.state.zones.map(z => {
                            if (z.selected) return {
                                ...z,
                                width: val/3
                            }
                        })
                    })
                }
            }, 300)
        })

        $('input[name="Height"]').on('change', function() {
            setTimeout(() => {
                const val = $(this).val()
                const selectedHandler = $('.handler-drag.selected');
            
                if (selectedHandler) {
                    self.setState({
                        zones: self.state.zones.map(z => {
                            if (z.selected) return {
                                ...z,
                                height: val/3
                            }
                        })
                    })
                }
            })
        })
    }

    initDraggableItems() {
        const self = this
        const {zones, isShowGrid, isCustomResolution, resolution, minSize, minSnap} = self.state
        const selector = '.handler-drag'
        if (zones && zones.length > 0) {
            detailEvents();

            if (interact.isSet(selector)) interact(selector).unset();

            interact(selector)
            .draggable({
                onmove: event => {
                    if (Math.abs(event.dx) > 64 || Math.abs(event.dy) > 36) return;
                    var target = event.target
                    var parent = target.parentNode;
                    var params = {
                        pWidth: parseFloat(resolution.width),
                        pHeight: parseFloat(resolution.height),
                        cWidth: minSnap.width,
                        cHeight: minSnap.height,
                        caWidth: target.clientWidth,
                        caHeight: target.clientHeight
                    }
                    var xSign = event.dx % params.cWidth;
                    var ySign = event.dy % params.cHeight;
        
                    var x = (parseFloat(target.getAttribute('data-x')) || 0) + (isShowGrid && !isCustomResolution ? (xSign == 0 ? event.dx : 0) : event.dx);
                    var y = (parseFloat(target.getAttribute('data-y')) || 0) + (isShowGrid && !isCustomResolution ? (ySign == 0 ? event.dy : 0) : event.dy);

                    var currentZoneIndex = target.getAttribute('data-zone-index')
                    
                    x = Math.abs(Math.round(x > 0 ? (x <= params.pWidth - params.caWidth ? (isShowGrid && !isCustomResolution ? (x % params.cWidth > 0 ? x - (x % params.cWidth) : x) : x) : params.pWidth - params.caWidth) : 0));
                    y = Math.abs(Math.round(y > 0 ? (y <= params.pHeight - params.caHeight ? (isShowGrid && !isCustomResolution ? (y % params.cHeight > 0 ? y - (y % params.cHeight) : y) : y) : params.pHeight - params.caHeight) : 0));

                    target.style.webkitTransform =
                    target.style.transform =
                    'translate(' + x + 'px, ' + y + 'px)'
        
                    target.setAttribute('data-x', x)
                    target.setAttribute('data-y', y)

                    self.setState({
                        zones: self.state.zones.map((z, index) => {
                            if (index == currentZoneIndex) return {
                                ...z,
                                top: y,
                                left: x,
                                width: params.caWidth,
                                height: params.caHeight
                            }
                            return z
                        })
                    })

                    self.updateSelectedComposition()

                    setDetails(x, y, params.pWidth, params.pHeight);
                },
                modifiers: isShowGrid && !isCustomResolution ? [
                    interact.modifiers.snap({
                        targets:  [
                            interact.createSnapGrid({ x: minSnap.width, y: minSnap.height })
                        ],
                        range: Infinity
                    }),
                    interact.modifiers.restrict({
                        restriction: 'parent',
                        elementRect: { top: 0, left: 0, bottom: resolution.height, right: resolution.width },
                        endOnly: true
                    })
                ] : []
            })
            .resizable({
                edges: {
                    right: true,
                    bottom: true,
                    top: true,
                    left: true
                },
        
                modifiers: isShowGrid && !isCustomResolution ? [
                    interact.modifiers.restrictEdges({
                        outer: 'parent'
                    }),
        
                    interact.modifiers.restrictSize({
                        min: {
                            width: minSize.width,
                            height: minSize.height
                        }
                    }),
        
                    interact.modifiers.snapSize({
                        targets: [
                            interact.createSnapGrid({ width: minSnap.width, height: minSnap.height })
                        ]
                    })
                ] : [
                    interact.modifiers.restrictEdges({
                        outer: 'parent'
                    }),
        
                    interact.modifiers.restrictSize({
                        min: {
                            width: minSize.width,
                            height: minSize.height
                        }
                    })
                ],
        
                inertia: true
            })
            .on('resizemove', function (event) {
                var target = event.target
                var x = (parseFloat(target.getAttribute('data-x')) || 0)
                var y = (parseFloat(target.getAttribute('data-y')) || 0)
        
                x += event.deltaRect.left
                y += event.deltaRect.top
        
                if (x < 0 || y < 0) return
        
                var horEdge = parseFloat(event.target.parentNode.style.width) - x
                var verEdge = parseFloat(event.target.parentNode.style.height) - y
        
                var width = horEdge >= event.rect.width ? event.rect.width : horEdge
                var height = verEdge >= event.rect.height ? event.rect.height : verEdge

                // width = horEdge - width > 0.5 && horEdge - width < 1 ? horEdge : width
                // height = verEdge - height > 0.5 && verEdge - width < 1 ? verEdge : height

                var currentZoneIndex = target.getAttribute('data-zone-index')
                target.style.width = width + 'px'
                target.style.height = height + 'px'
        
                target.style.webkitTransform = target.style.transform =
                    'translate(' + x + 'px,' + y + 'px)'
        
                target.setAttribute('data-x', x)
                target.setAttribute('data-y', y)
                // target.textContent = Math.round(width * 3) + '\u00D7' + Math.round(height * 3)
        
                self.setState({
                    zones: self.state.zones.map((z, index) => {
                        if (index == currentZoneIndex) return {
                            ...z,
                            top: y,
                            left: x,
                            width,
                            height
                        }
                        return z
                    })
                })

                setDetails(x, y, width, height);

                self.updateSelectedComposition()
            })

            setTimeout(() => {
                $(`${selector}, .ads__template-layer`).off('mousedown').on('mousedown', function(event) {
                    var target = event.target
                    var currentZoneIndex = event.target.getAttribute('data-zone-index')
                    
                    if (currentZoneIndex) {
                        target = $(`${selector}[data-zone-index="${currentZoneIndex}"]`)

                        var params = {
                            caWidth: zones[currentZoneIndex].width,
                            caHeight: zones[currentZoneIndex].height
                        }
                
                        var x = (parseInt(target.attr('data-x')) || 0);
                        var y = (parseInt(target.attr('data-y')) || 0);

                        setDetails(x, y, params.caWidth, params.caHeight);

                        self.setState({
                            zones: self.state.zones.map((z, index) => {
                                return {
                                    ...z,
                                    selected: index == currentZoneIndex
                                }
                            })
                        })
                    }
                })
            }, 300)
        }
    }

    componentWillReceiveProps(props) {
        const self = this
        const {fetchedComposition, updatedTemplateComposition} = props

        if (fetchedComposition && fetchedComposition.composition !== self.props.fetchedComposition.composition) {
            if (fetchedComposition.composition && fetchedComposition.composition.length > 0) {
                const cFetched = fetchedComposition.composition[0]
                const {template_id, name, template_width, template_height, orientation, zones, version, created_at, user_id, id} = cFetched
                
                setTimeout(() => {
                    const isCustom = !(template_width <= 16 || template_height <= 16)
                    const isVertical = !isCustom && template_width == 9
                    const isHorizontal = !isCustom && template_width == 16
                    const standard = {
                        width: orientation ? 640 : 360,
                        height: orientation ? 360 : 640
                    }
                    const newSelectedTemplate = {
                        composition_id: id,
                        id: template_id,
                        name,
                        width: template_width,
                        height: template_height,
                        orientation,
                        version,
                        created_at,
                        user_id,
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
                        fetchedCompositionLoading: 0,
                        selectedComposition: newSelectedTemplate,
                        zones: zones.map((z, zIndex) => {
                            return {
                                name: z.name,
                                top: isVertical ? z.top*standard.height/100 : (isHorizontal ? z.top*standard.height/100 : z.top/3),
                                left: isVertical ? z.left*standard.width/100 : (isHorizontal ? z.left*standard.width/100 : z.left/3),
                                width: isVertical ? z.width*standard.width/100 : (isHorizontal ? z.width*standard.width/100 : z.width/3) - 0.001,
                                height: isVertical ? z.height*standard.height/100 : (isHorizontal ? z.height*standard.height/100 : z.height/3) - 0.001,
                                z_index: z.z_index,
                                selected: zIndex == 0
                            }
                        }),
                        resolution: isCustom ? {
                            width: template_width / 3,
                            height: template_height / 3
                        } : standard,
                        isCustomResolution: isCustom && (template_width % 3 > 0 || template_height % 3 > 0),
                    })

                    localStorage.setItem(types.CURRENT_COMPOSITION, JSON.stringify(newSelectedTemplate))

                    setTimeout(() => {
                        const selectedZone = self.state.zones.find(z => z.selected)
                        setDetails(selectedZone.left, selectedZone.top, selectedZone.width, selectedZone.height);

                        // Zone initialization
                        self.initDraggableItems()

                        // Sortable Initialization
                        self.initSortableItems();

                        self.trackInputChanges()
                    }, 500)
                }, 500)
            } else {
                window.location = '/dashboard/composition'
            }
        }

        if (updatedTemplateComposition && updatedTemplateComposition.composition && updatedTemplateComposition.composition != self.props.updatedTemplateComposition.composition) {
            toast.success('Composition updated successfully!', {
                onClose: () => {
                    self.setState({
                        isSaving: false
                    })
                    window.location = `/dashboard/composition/edit/${updatedTemplateComposition.composition.id}`
                }
            })
        } else {
            if (updatedTemplateComposition.error && !updatedTemplateComposition.loading && updatedTemplateComposition != self.props.updatedTemplateComposition) {
                toast.error('There is an error when updating composition, please try again later!', {
                    onClose: () => {
                        self.setState({
                            isSaving: false
                        })
                    }
                })
            }
        }
    }

    handleTempPreview = e => {
        e.preventDefault()
        const self = this
        const target = $(e.target)
        const modal = $(target.attr('data-target'))

        if (modal) {
            self.setState({
                isTempPreview: true
            })

            modal.modal('show')
        }

        return false
    }

    handleUpdateCompositionTemplate = e => {
        e.preventDefault()
        const self = this
        const {selectedComposition, zones} = self.state
        const {composition_id, name, version, duration, template_id, user_id, created_at, width, height, orientation} = selectedComposition

        let template = {
            template: {
                name: config.template_temp_name,
                orientation,
                width: width <= 16 ? (orientation ? 1920 : 1080) : width,
                height: height <= 16 ? (orientation ? 1080 : 1920) : height,
                user_id
            },
            zones: []
        }

        zones.forEach(z => {
            template.zones.push({
                name: z.name,
                top: Math.round(z.top * 3),
                left: Math.round(z.left * 3),
                width: Math.ceil(z.width * 3),
                height: Math.ceil(z.height * 3),
                z_index: z.z_index
            })
        })

        let composition = {
            id: composition_id,
            name,
            version,
            duration,
            template_id,
            user_id,
            created_at,
            zones: selectedComposition.zones.map(z => {
                return {
                    id: z.id,
                    name: z.name,
                    assets: z.assets.map(a => {
                        return {
                            id: a.id,
                            duration: a.playbackDuration,
                            z_index: a.z_index
                        }
                    })
                }
            })
        }

        self.setState({
            isSaving: true
        })

        setTimeout(() => {
            self.props.updateTemplate({
                template,
                composition
            })
        }, 100)

        return false
    }

    render() {
        const {zones, isShowGrid, resolution, selectedComposition, isTempPreview, fetchedCompositionLoading, isSaving} = this.state
        const gridClasses = `ads__template-handler ${isShowGrid ? '' : 'no-grid'}`

        return(
            <div className={`ads__template ${fetchedCompositionLoading ? 'loading-text' : ''}`}>
                <Preview isTempPreview={isTempPreview} selectedAsset={selectedComposition} isIframe={false} />
                <form>
                    <div className={`ads__template-left two`}>
                        <div className="ads__template-header">
                            <h2>Edit Composition Template</h2>
                            <div className="checkbox">
                                <input id="templateGrid" type="checkbox" defaultChecked={isShowGrid} onChange={e => {
                                    this.setState({
                                        isShowGrid: e.target.checked
                                    })

                                    setTimeout(() => {
                                        this.initDraggableItems()
                                    }, 300)
                                }}/>
                                <label htmlFor="templateGrid">Show Grid?</label>
                            </div>
                        </div>
                        <div className="ads__template-body">
                            <div className="ads__template-handler-wrapper scrollbar-outer">
                                <div className={gridClasses}  style={{width: `${resolution.width}px`, height: `${resolution.height}px`}}>
                                    {zones && zones.length > 0 && zones.map((z, index) => {
                                        const zoneClasses = `handler-drag ${z.selected ? 'selected' : ''} zIndex-${z.z_index}`
                                        return (
                                            <div className={zoneClasses} data-width="16" data-height="9" key={index} data-zone-index={index} data-x={z.left} data-y={z.top} style={{transform: `translate(${z.left}px,${z.top}px)`, width: z.width, height: z.height}}>
                                                <span>{z.name}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    {zones && zones.length > 0 && (
                        <div className="ads__template-right">
                            <div className="ads__template-details">
                                <h3>Zone Details</h3>
                                <div className="row">
                                    <div className="col-6">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">Top</div>
                                            </div>
                                            <input className="form-control" type="number" name="Top"/>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">Left</div>
                                            </div>
                                            <input className="form-control" type="number" name="Left"/>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">Width</div>
                                            </div>
                                            <input className="form-control" type="number" name="Width"/>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">Height</div>
                                            </div>
                                            <input className="form-control" type="number" name="Height"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="ads__template-layers">
                                <h3>Layers (Drag to sort)</h3>
                                <ul className="ads__template-container" id="layers">
                                    {zones.map((z, index) => {
                                        const zoneClasses = `ads__template-layer ${z.selected ? 'selected' : ''}`
                                        return (
                                            <li className={zoneClasses} key={index} data-zone-index={index}>
                                                <p>{z.name}</p>
                                                <a href="#" onClick={e => this.handleDeleteZone(e, z)}>
                                                    <i className="icon-trash"></i>
                                                </a>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <div className="ads__template-btns">
                                <button className="btn btn-info rounded" type="button" data-target="#preview-modal" onClick={this.handleTempPreview}>Preview</button>
                                <button className={`btn btn-primary rounded ${isSaving ? 'loading' : ''}`} type="button" onClick={this.handleUpdateCompositionTemplate}>Update Composition</button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        )
    }
}

export default EditCompositionTemplate

