import React, {Component} from 'react'

import {Template} from '../../../containers/dashboard/Template'

import * as types from '../../../actions/actionTypes'
import { toast } from 'react-toastify'

class EditTemplate extends Component {
    constructor(props) {
        super(props)

        this.state = {
            templates: null,
            defaultTemplates: null,
            isCreateTemplate: false,
            isTemplateAdded: false,
            templateModal: 'template-modal',
            templateSearch: '',
            filteredDefaultTemplates: null,
            filteredTemplates: null,
            deletingId: null
        }   
    }

    componentDidMount() {
        const self = this

        if (window.jQuery) {
            const {templateModal} = self.state

            $(`#${templateModal}`).on('hidden.bs.modal', e => {
                if (e.target.id == templateModal) {
                    self.setState({
                        isTemplateAdded: false,
                        isCreateTemplate: false
                    })
                }
            })

            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                self.setState({
                    templateSearch: '',
                    filteredDefaultTemplates: self.state.defaultTemplates,
                    filteredTemplates: self.state.templates
                })
            })
        }
    }

    componentWillReceiveProps(props) {
        const self = this
        const {templates, defaultTemplates, deletedTemplate} = props
        const {deletingId} = self.state

        if (defaultTemplates && defaultTemplates.length > 0 && defaultTemplates != self.props.defaultTemplates) {
            self.setState({
                defaultTemplates,
                filteredDefaultTemplates: defaultTemplates
            })
        }

        if (templates && templates.length > 0 && templates != self.props.templates) {
            self.setState({
                templates,
                filteredTemplates: templates
            })
        }

        if (deletedTemplate && deletedTemplate.template && deletedTemplate.template != self.props.deleteTemplate && deletingId) {
            self.setState({
                ...self.state,
                filteredTemplates: self.state.filteredTemplates.filter(t => t.id !== deletingId)
            })

            toast.success('Template deleted successfully!', {
                onClose: () => {
                    self.setState({
                        deletingId: null
                    })

                    self.props.onRefreshTemplates()
                    localStorage.removeItem(types.DEFAULT_TEMPLATE)
                }
            })
        } else {
            if (deletedTemplate && deletedTemplate.error && deletedTemplate != self.props.deleteTemplate) {
                toast.error(deletedTemplate.error, {
                    onClose: () => {
                        self.setState({
                            deletingId: null
                        })
                    }
                })
            }
        }
    }

    showCreateTemplatePage = (e, isShown) => {
        e.preventDefault()
        const self = this

        self.setState({
            isCreateTemplate: isShown
        })

        return false
    }

    handleTemplateAdded = () => {
        const self = this

        self.props.onRefreshTemplates()

        self.setState({
            isCreateTemplate: false,
            isTemplateAdded: true
        })
    }

    handleSetTemplate = (e, template, isDefaultTemplate = false) => {
        const self = this
        const {templateModal} = self.state
        let selectedTemplate = {
            ...template
        }

        if (template) {
            selectedTemplate = {
                ...selectedTemplate,
                zones: [
                    ...selectedTemplate.zones.map((z, index) => {
                        const customTemplate = selectedTemplate.width > 100 ? {
                            top: Math.round((z.top/selectedTemplate.height) * 100),
                            left: Math.round((z.left/selectedTemplate.width) * 100),
                            width: Math.round((z.width/selectedTemplate.width) * 100),
                            height: Math.round((z.height/selectedTemplate.height) * 100)
                        } : null
                        return {
                            ...z,
                            ...customTemplate,
                            selected: index == 0,
                            assets: []
                        }
                    })
                ]
            }

            if (isDefaultTemplate) {
                localStorage.setItem(types.DEFAULT_TEMPLATE, JSON.stringify(selectedTemplate))
            }

            self.props.onSetDefaultTemplate(selectedTemplate, () => {
                $(`#${templateModal}`).modal('hide')
            })
        }
    }

    handleSearchTemplate = e => {
        e.preventDefault()
        const self = this
        const value = e ? e.target.value : ''
        const{defaultTemplates, templates} = self.state

        self.setState({
            templateSearch: value
        })

        if (value) {
            const dTemplates = defaultTemplates.filter(t => {
                const name = t.name.toString().toLowerCase()
                const val = value.toString().toLowerCase() 
                const isVertical = 'vertical'.indexOf(val) > -1 && !t.orientation
                const isHorizontal = 'horizontal'.indexOf(val) > -1 && t.orientation

                return name.indexOf(val) > -1 || isVertical || isHorizontal
            })

            const tmp = templates.filter(t => {
                const name = t.name.toString().toLowerCase()
                const val = value.toString().toLowerCase() 
                const isVertical = 'vertical'.indexOf(val) > -1 && !t.orientation
                const isHorizontal = 'horizontal'.indexOf(val) > -1 && t.orientation

                return name.indexOf(val) > -1 || isVertical || isHorizontal
            })

            self.setState({
                filteredDefaultTemplates: dTemplates,
                filteredTemplates: tmp
            })
        } else {
            self.setState({
                filteredDefaultTemplates: defaultTemplates,
                filteredTemplates: templates
            })    
        }

        return false
    }

    handleDeleteTemplate = (e, template) => {
        e.preventDefault()
        const self = this

        if (template && template.id) {
            self.setState({
                deletingId: template.id
            })
    
            self.props.deleteTemplate(template.id)
        }

        return false
    }

    render() {
        const {filteredTemplates, filteredDefaultTemplates, isCreateTemplate, isTemplateAdded, templateSearch, deletingId} = this.state
        const defaultTemplatesMarkup = filteredDefaultTemplates && filteredDefaultTemplates.length > 0 && filteredDefaultTemplates.map((t, index) => {
            return (
                <div className="col-12 col-md-6 col-lg-3" key={index}>
                    <div className="ads__template-modal-item">
                        <div className="header">
                            <p>{t.name} - {t.orientation ? 'Horizontal' : 'Vertical'}</p>
                        </div>
                        <div className="preview">
                            <div className={`preview-wrapper ${t.orientation ? 'horizontal' : 'vertical'}`}>
                                {t.zones && t.zones.length > 0 && t.zones.map((z, zIndex) => {
                                    return (
                                        <div style={{left: `${z.left}%`, top: `${z.top}%`, width: `${z.width}%`, height: `${z.height}%`, zIndex: z.z_index, display: 'block', position: 'absolute'}} key={zIndex}></div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="btns">
                            <h4>{t.ratio}</h4>
                            <div className="links">
                                <a href="#" onClick={e => this.handleSetTemplate(e, t, true)}>Set As Default</a>
                                <a href="#" onClick={e => this.handleSetTemplate(e, t)}>Use This</a>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
        const templatesMarkup = filteredTemplates && filteredTemplates.length > 0 ? filteredTemplates.map((t, index) => {
            return (
                <div className="col-12 col-md-6 col-lg-3" key={index}>
                    <div className={`ads__template-modal-item ${deletingId == t.id ? 'deleting' : ''}`}>
                        <div className="header">
                            <p>{t.name} - {t.orientation ? 'Horizontal' : 'Vertical'}</p>
                            <div className="dropdown show">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                    <span></span>
                                </a>

                                <div className="dropdown-menu dropdown-menu-right">
                                    <a href="#" className="dropdown-item" onClick={e => this.handleDeleteTemplate(e, t)}>
                                        <i className="icon icon-trash"></i>
                                        <span>Delete</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="preview">
                            <div className={`preview-wrapper ${t.orientation ? 'horizontal' : 'vertical'}`}>
                                {t.zones && t.zones.length > 0 && t.zones.map((z, zIndex) => {
                                    const position = {
                                        top: Math.round((z.top/t.height) * 100),
                                        left: Math.round((z.left/t.width) * 100),
                                        width: Math.ceil((z.width/t.width) * 100),
                                        height: Math.ceil((z.height/t.height) * 100)
                                    }
                                    return (
                                        <div style={{left: `${position.left}%`, top: `${position.top}%`, width: `${position.width}%`, height: `${position.height}%`, zIndex: z.z_index, display: 'block', position: 'absolute'}} key={zIndex}></div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="btns">
                            <h4>{t.width}*{t.height}</h4>
                            <div className="links">
                                <a href="#" onClick={e => this.handleSetTemplate(e, t, true)}>Set As Default</a>
                                <a href="#" onClick={e => this.handleSetTemplate(e, t)}>Use This</a>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }) : (
            <div className="col-12 text-center">
                <h2>No template found!</h2>
            </div>
        )

        return(
            <div className="modal fade ads__display-add ads__template-modal show" id="template-modal" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">
                                {isCreateTemplate && (
                                    <a href="#" onClick={e => this.showCreateTemplatePage(e, false)}>
                                        <i className="icon-arrow-left-line"></i>
                                    </a>
                                )}
                                Templates
                                </h3>
                            <a href="#" data-dismiss="modal">
                                <i className="icon-close"></i>
                            </a>
                        </div>
                        <div className={`modal-body left ${isCreateTemplate ? 'no-padding' : ''}`}>
                            {isCreateTemplate ? (
                                <Template isPopup={true} onTemplateAdded={this.handleTemplateAdded} />
                            ) : (
                                <div className="template-chooser">
                                    <ul className="nav nav-tabs nav-list">
                                        <li className="nav-item"><a className={`nav-link ${isTemplateAdded ? '' : 'active'}`} data-toggle="tab" href="#defaultTemplates">Default Templates</a></li>
                                        <li className="nav-item"><a className={`nav-link ${isTemplateAdded ? 'active' : ''}`} data-toggle="tab" href="#myTemplates">My Templates</a></li>
                                        <li className="right-icons">
                                            <button className="btn btn-primary rounded" type="button" onClick={e => this.showCreateTemplatePage(e, true)}>
                                                <i className="icon-plus"></i>
                                                <span>Create Template</span>
                                            </button>
                                            <div className="ads__search-box">
                                                <input type="text" placeholder="Search..." value={templateSearch} onChange={this.handleSearchTemplate}/>
                                                <i className="icon-search"></i>
                                            </div>
                                        </li>
                                    </ul>
                                    <div className="tab-content">
                                        <div className={`tab-pane fade ${isTemplateAdded ? '' : 'show active'}`} id="defaultTemplates">
                                            <div className="template-rows row">
                                                {defaultTemplatesMarkup}
                                            </div>
                                        </div>
                                        <div className={`tab-pane fade ${isTemplateAdded ? 'show active' : ''}`} id="myTemplates">
                                            <div className="template-rows row">
                                                {templatesMarkup}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default EditTemplate

