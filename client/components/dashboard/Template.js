import React, {Component} from 'react'
import { toast } from 'react-toastify'
import _ from 'lodash'

import AddZone from './modals/AddZone'
import CustomResolution from './modals/CustomResolution'

import clientUtils from '../../utils'

class Template extends Component {
    constructor(props) {
        super(props)

        this.state = {
            zones: [],
            zone: {
                add: {
                    zone: null,
                    loading: 0,
                    error: null
                }
            },
            isShowGrid: true,
            isCustomResulution: false,
            defaultResolution: '1920*1080',
            resolutions: ['1920*1080', '1080*1920'],
            resolution: {
                width: 1920,
                height: 1080
            },
            minSize: {
                width: 64,
                height: 36
            },
            minSnap: {
                width: 16,
                height: 9
            },
            templateName: '',
            addedTemplate: {
                loading: 0,
                template: null,
                error: null
            }
        }   
    }

    componentDidMount() {
        const self = this

        if (window.jQuery) {
            // Zone initialization
            self.initDraggableItems()

            // Sortable Initialization
            self.initSortableItems();

            // Init scrollbar
            jQuery('.scrollbar-outer').scrollbar()
        }
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

    componentWillReceiveProps(props) {
        const self = this
        const {addedTemplate, isPopup} = props

        if (addedTemplate && addedTemplate.template && !addedTemplate.loading) {
            toast.success(`Template has been created successfully!`, {
                onClose: () => {
                    self.setState({
                        addedTemplate
                    })
                }
            })
            
            if (isPopup) {
                self.props.onTemplateAdded()
            } else {
                window.location.reload()
            }
        } else {
            if (addedTemplate && addedTemplate.error && !addedTemplate.loading) {
                self.setState({
                    addedTemplate
                })

                toast.error(addedTemplate.error)
            }
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
                                            
                                            newZones[originalIndex].zIndex = idx
                                        })

                                        self.setState({
                                            zones: newZones
                                        })
                                        // ToolMan.cookies().set("list-" + id, 
                                        //                     junkdrawer.serializeList(list), 365)
                                    })
                                })
        }
    }

    initDraggableItems() {
        const self = this
        const {zones, isShowGrid, resolution, minSize, minSnap} = self.state
        const selector = '.handler-drag'
        if (zones && zones.length > 0) {
            detailEvents();

            if (interact.isSet(selector)) interact(selector).unset();

            interact(selector)
            .draggable({
                onmove: _.debounce(event => {
                    if (Math.abs(event.dx) > 64 || Math.abs(event.dy) > 36) return;
                    var target = event.target
                    var parent = target.parentNode;
                    var params = {
                        pWidth: parseFloat(resolution.width / 3),
                        pHeight: parseFloat(resolution.height / 3),
                        cWidth: minSnap.width,
                        cHeight: minSnap.height,
                        caWidth: target.clientWidth,
                        caHeight: target.clientHeight
                    }
                    var xSign = event.dx % params.cWidth;
                    var ySign = event.dy % params.cHeight;
        
                    var x = (parseFloat(target.getAttribute('data-x')) || 0) + (isShowGrid ? (xSign == 0 ? event.dx : 0) : event.dx);
                    var y = (parseFloat(target.getAttribute('data-y')) || 0) + (isShowGrid ? (ySign == 0 ? event.dy : 0) : event.dy);

                    var currentZoneIndex = target.getAttribute('data-zone-index')
                    
                    x = x > 0 ? (x <= params.pWidth - params.caWidth ? (isShowGrid ? (x % params.cWidth > 0 ? x - (x % params.cWidth) : x) : x) : params.pWidth - params.caWidth) : 0;
                    y = y > 0 ? (y <= params.pHeight - params.caHeight ? (isShowGrid ? (y % params.cHeight > 0 ? y - (y % params.cHeight) : y) : y) : params.pHeight - params.caHeight) : 0;

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
        
                    setDetails(x, y, params.caWidth, params.caHeight);
                }, 1),
                modifiers: isShowGrid ? [
                    interact.modifiers.snap({
                        targets:  [
                            interact.createSnapGrid({ x: minSnap.width, y: minSnap.height })
                        ],
                        range: Infinity
                    }),
                    interact.modifiers.restrict({
                        restriction: 'parent',
                        elementRect: { top: 0, left: 0, bottom: resolution.height / 3, right: resolution.width / 3 },
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
        
                modifiers: isShowGrid ? [
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
            .on('resizemove', _.debounce(function (event) {
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
            }, 1))

            setTimeout(() => {
                $(`${selector}, .ads__template-layer`).off('mousedown').on('mousedown', function(event) {
                    var target = event.target
                    var currentZoneIndex = event.target.getAttribute('data-zone-index')
                    
                    if (currentZoneIndex) {
                        target = $(`${selector}[data-zone-index="${currentZoneIndex}"]`)

                        var params = {
                            caWidth: target.width(),
                            caHeight: target.height()
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

    handleAddZone = name => {
        const self = this
        const {zones, resolution} = self.state
        const newZone = {
            name,
            top: 0,
            left: 0,
            width: resolution.width < 480 ? resolution.width / 3 : 160,
            height: resolution.height < 270 ? resolution.height / 3 : 90,
            selected: true
        }
        const isExisting = zones.find(z => z.name === name)

        if (isExisting) {
            toast.error(`Zone '${name}' is existed. Please choose another name!`)
        } else {
            self.setState({
                zones: [
                    ...self.state.zones.map(z => {
                        return {
                            ...z,
                            selected: false
                        }
                    }),
                    {
                        ...newZone,
                        zIndex: self.state.zones.length
                    }
                ],
                zone: {
                    ...self.state.zone,
                    add: {
                        ...self.state.zone.add,
                        zone: newZone,
                        loading: 1
                    }
                }
            })

            setTimeout(() => {
                setDetails(newZone.left, newZone.top, newZone.width, newZone.height)

                if (self.state.zones.length == 1) self.trackInputChanges()
            }, 50)
        }

        setTimeout(() => {
            self.initDraggableItems()
            self.initSortableItems()
        }, 300)
    }

    handleDeleteZone = (e, zone) => {
        e.preventDefault()
        const self = this
        const {zones} = self.state

        if (zone) {
            const newZones = zones.filter(z => z.name !== zone.name)
            if (newZones && newZones.length > 0) {
                newZones[0].selected = true
                setDetails(newZones[0].left, newZones[0].top, newZones[0].width, newZones[0].height)
            }

            self.setState({
                zones: newZones
            })
        }

        return false
    }

    handleResolutionChange = e => {
        e.preventDefault()
        const self = this
        const res = e.target.value
        switch(res) {
            case 'custom':
                $("#custom-resolution-modal").modal('show')
                break;
            default:
                const customSize = res.split('*')
                const width = parseInt(customSize[0])
                const height = parseInt(customSize[1])

                self.setState({
                    resolution: {
                        width,
                        height
                    },
                    zones: [],
                    defaultResolution: res
                })
                break;
        }

        self.initDraggableItems()
        
        return false
    }

    handleCustomResolution = newResolution => {
        const self = this
        const customSize = newResolution.split('*')
        const width = parseInt(customSize[0])
        const height = parseInt(customSize[1])
        const {minSnap} = self.state
        const isSnap = (width / 3) % minSnap.width > 0 || (height / 3) % minSnap.height > 0

        self.setState({
            resolution: {
                width,
                height
            },
            isCustomResulution: isSnap,
            isShowGrid: !isSnap,
            defaultResolution: newResolution,
            resolutions: [
                ...self.state.resolutions,
                newResolution
            ],
            zones: []
        })

        self.initDraggableItems()
    }

    handleCreateTemplate = e => {
        e.preventDefault()
        const self = this
        const form = $(e.target)
        const {zones, templateName, resolution} = self.state

        if (zones && zones.length == 0) {
            toast.error(`Please add zone to your template!`)
        } else {
            if (form.valid()) {
                const user_id = clientUtils.get_user_id()

                let template = {
                    template: {
                        name : templateName,
                        orientation: resolution.width >= resolution.height,
                        width: resolution.width,
                        height: resolution.height,
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
                        z_index: z.zIndex
                    })
                })

                self.setState({
                    addedTemplate: {
                        ...self.state.addedTemplate,
                        loading: 1
                    }
                })

                self.props.addTemplate(template)
            }
        }

        return false
    }

    render() {
        const {zones, zone, isShowGrid, defaultResolution, resolution, resolutions, isCustomResulution, templateName, addedTemplate} = this.state
        const gridClasses = `ads__template-handler ${isShowGrid || isCustomResulution ? '' : 'no-grid'}`

        return(
            <div className="ads__template">
                <AddZone zone={zone} onAddZone={this.handleAddZone} />
                <CustomResolution onHandleCustomResolution={this.handleCustomResolution} />
                <form action="#" method="post" noValidate onSubmit={this.handleCreateTemplate}>
                    <div className={`ads__template-left ${zones && zones.length > 0 ? 'two' : 'one'}`}>
                        <div className="ads__template-header">
                            <h2>Create Template</h2>
                            <div className="row">
                                <div className="col-12 col-sm-4">
                                    <div className="form-group">
                                        <label htmlFor="templateName">Template Name</label>
                                        <input name="templateName"
                                                className="form-control" 
                                                type="text"
                                                value={templateName}
                                                onChange={e => this.setState({
                                                    templateName: e.target.value
                                                })}
                                                data-rule-required="true"
                                                data-rule-minlength="3"
                                                data-msg-required="Please enter template name"
                                                data-msg-minlength="Template name must be at least 3 characters"
                                                maxLength="25"
                                                placeholder="Enter template name"/>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4">
                                    <div className="form-group">
                                        <label htmlFor="templateResolution">Resolution</label>
                                        <select className="form-control" value={defaultResolution} onChange={this.handleResolutionChange}>
                                            {resolutions && resolutions.length > 0 && resolutions.map((r, index) => {
                                                return (
                                                    <option defaultValue={r} key={index}>{r}</option>
                                                )
                                            })}
                                            <option defaultValue="custom">custom</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
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
                            <div className="ads__template-info">
                                <button className="btn btn-primary rounded" type="button" data-target="#add-zone-modal" data-toggle="modal"><i className="icon-plus"></i><span>Add Zone</span></button>
                            </div>
                            <div className="ads__template-handler-wrapper scrollbar-outer">
                                <div className={gridClasses} style={{width: `${resolution.width / 3}px`, height: `${resolution.height / 3}px`}}>
                                    {zones && zones.length > 0 && zones.map((z, index) => {
                                        const zoneClasses = `handler-drag ${z.selected ? 'selected' : ''} zIndex-${z.zIndex}`
                                        return (
                                            <div className={zoneClasses} data-width="16" data-height="9" key={index} data-zone-index={index}>
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
                                <button className={`btn btn-primary rounded ${addedTemplate.loading ? 'loading' : ''}`} type="submit">Create Template</button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        )
    }
}

export default Template

