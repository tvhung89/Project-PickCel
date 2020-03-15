import React, {Component} from 'react'

class CustomResolution extends Component {
    constructor(props) {
        super(props)  

        this.state = {
            resolution: ''
        }
    }

    componentDidMount() {
        if (window.jQuery) {
            jQuery.validator.addMethod("resolution", function(value, element, param) {
                const isValid = value.match(new RegExp("^" + param + "$"));
                const resolution = value.split('*')
                const width = parseInt(resolution[0])
                const height = parseInt(resolution[1])

                return isValid && (width >= 160 && width <= 7680) && (height >= 90 && height <= 4320);
            },'Please enter valid resolution (between 160*90 and 7680*4320)');
        }
    }

    handleCustomResolution = e => {
        e.preventDefault()
        const self = this
        const form = $(e.target)
        const {resolution} = self.state

        if (form.valid() && resolution) {
            self.props.onHandleCustomResolution(resolution)

            $('#custom-resolution-modal').modal('hide')
        }

        return false;
    }

    render() {
        const {resolution} = this.state

        return(
            <div className="modal fade ads__display-add show" id="custom-resolution-modal" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <form noValidate onSubmit={this.handleCustomResolution}>
                            <div className="modal-body">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <div className="input-group-text">Resolution</div>
                                    </div>
                                    <input className="form-control" 
                                            type="text" 
                                            name="resolution"
                                            value={resolution}
                                            onChange={e => this.setState({
                                                resolution: e.target.value
                                            })}
                                            data-rule-required="true"
                                            data-msg-required="Please specify your device screen size"
                                            data-rule-resolution="[0-9]{1,4}\*[0-9]{1,4}"
                                            data-rule-minr="160*90"
                                            data-rule-maxresolution="7680*4320"
                                            autoComplete="off"
                                            placeholder="e.g: 1920*1080" />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary rounded" type="button" onClick={e => {
                                    $('#custom-resolution-modal').modal('hide')
                                }}>Cancel</button>
                                <button className="btn btn-success rounded" type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default CustomResolution

