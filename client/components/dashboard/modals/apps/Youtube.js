import React, {Component} from 'react'

import clientUtils from '../../../../utils'
import { toast } from 'react-toastify';

class Youtube extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isPreview: false,
            url: '',
            name: '',
            user_id: clientUtils.get_user_id(),
            isSaving: false
        }   
    }

    componentDidMount() {
        if (window.jQuery) {
            jQuery.validator.addMethod("url", function(value, element, param) {
                return value.match(new RegExp("^" + param + "$"))
            },'Please enter valid youtube url');
        }
    }

    componentWillReceiveProps(props) {
        const self = this
        const {addedAsset} = props

        if (addedAsset && addedAsset != self.props.addedAsset) {
            if (addedAsset.asset) {
                toast.success('App added successfully!', {
                    onClose: () => {
                        self.setState({
                            isSaving: false
                        })

                        window.location = '/dashboard/asset'
                    }
                })
            }

            if (addedAsset.error) {
                toast.error('There is something wrong when trying to add app!')

                self.setState({
                    isSaving: false
                })
            }
        }
    }

    handleCreateApp = e => {
        e.preventDefault()
        const self = this
        const form = $(e.target)
        const {isPreview, user_id, name, url} = self.state

        if (!isPreview) {
            if (form.valid()) {
                let appAsset = {
                    name,
                    type: 2,
                    dimension: 'youtube.svg',
                    content: `<iframe src="${url.replace('watch?v=', 'embed/')}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>`,
                    user_id
                }

                self.setState({
                    isSaving: true
                })
                
                self.props.addAsset(appAsset)
            }
        }
        return false
    }

    render() {
        const {isPreview, url, name, isSaving} = this.state

        return(
            <div className="modal fade ads__display-add show" id="youtube-modal" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                    <div className="modal-header">
                            <h3 className="modal-title">Youtube Video App</h3><a href="#" data-dismiss="modal"><i className="icon-close"></i></a>
                        </div>
                        <form noValidate onSubmit={this.handleCreateApp}>
                            <div className={`modal-body ${isPreview ? 'playing' : ''}`}>
                                {isPreview ? (
                                    <iframe width="100%" height="400px" src={`${url.replace('watch?v=', 'embed/')}?autoplay=1`} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>
                                ) : (
                                    <React.Fragment>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="youtube-name">Name</label>
                                            </div>
                                            <div className="form-group col-md-9">
                                                <input className="form-control" name="name" type="text" id="youtube-name" value={name} onChange={e => this.setState({name: e.target.value})} data-rule-required="true" data-rule-pattern placeholder="App Name" />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="youtube-url">Video URL</label>
                                            </div>
                                            <div className="form-group col-md-9">
                                                <input className="form-control" name="url" type="text" id="youtube-url" value={url} onChange={e => this.setState({url: e.target.value})} data-rule-required="true" data-rule-url="(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+" placeholder="https://www.youtube.com/watch?v=xxxxxxxxxxx" />
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )}
                            </div>
                            <div className="modal-footer">
                                {isPreview ? (
                                    <button className={`btn btn-primary rounded ${isSaving ? 'disabled' : ''}`} type="button" onClick={e => this.setState({isPreview: false})}>Back</button>
                                ) : (
                                    <button className={`btn btn-primary rounded ${isSaving ? 'disabled' : ''}`} type="button" onClick={e => {
                                        if ($(e.target).parents('form').valid()) {
                                            this.setState({isPreview: true})
                                        }
                                    }}>Preview</button>
                                )}
                                <button className={`btn btn-success rounded ${isSaving ? 'loading' : ''}`} type="submit">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Youtube

