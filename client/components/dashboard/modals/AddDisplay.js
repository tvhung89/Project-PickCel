import React, {Component} from 'react'
import { toast } from 'react-toastify'
import clientUtils from '../../../utils'

class AddDisplay extends Component {
    constructor(props) {
        super(props)

        this.state = {
            code: '',
            isSubmit: false
        }   
    }

    componentWillReceiveProps(props) {
        const self = this
        const {addedDisplay} = props
        const {isSubmit} = self.state
        const user_id = clientUtils.get_user_id()

        if (isSubmit) {
            if (addedDisplay && addedDisplay.display) {
                setTimeout(() => {
                    $('#display-modal').modal('hide')
                }, 1000)

                self.props.getDisplay(user_id)
                
                toast.success('Display added successfully!', {
                    onClose: () => {
                        self.setState({
                            ...self.state,
                            isSubmit: false
                        })
                    }
                })
            } else {
                if (addedDisplay && addedDisplay.error && !addedDisplay.loading) {
                    toast.error(addedDisplay.error, {
                        onClose: () => {
                            self.setState({
                                ...self.state,
                                isSubmit: false
                            })
                        }
                    })
                }
            }
        }
    }

    handleAddDisplay = e => {
        e.preventDefault()
        const self = this
        const form = $(e.target)
        const {code} = self.state
        const user_id = clientUtils.get_user_id()
        const is_active = 1

        if (form.valid() && code && user_id) {

            self.setState({
                ...self.state,
                isSubmit: true
            })

            self.props.addDisplay({
                code,
                user_id,
                is_active
            })
        }

        return false
    }

    render() {
        const {code} = this.state

        return(
            <div className="modal fade ads__display-add show" id="display-modal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form action="#" method="post" noValidate onSubmit={this.handleAddDisplay}>
                            <div className="modal-header">
                                <h3 className="modal-title">Add Display</h3><a href="#" data-dismiss="modal"><i className="icon-close"></i></a>
                            </div>
                            <div className="modal-body"><img src="/dist/images/add-display.png" alt="Add Display"/>
                                <p>Enter registration code as shown on the display</p>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <div className="input-group-text">Code</div>
                                    </div>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        name="code"
                                        value={code}
                                        onChange={e => {
                                            this.setState({
                                                ...self.state,
                                                code: e.target.value
                                            })
                                        }}
                                        data-rule-required="true"
                                        data-msg-required="Please enter display code"
                                        data-rule-minlength="6"
                                        placeholder="Enter registration code"/>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary rounded" type="button" data-dismiss="modal">Cancel</button>
                                <button className="btn btn-success rounded" type="submit">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddDisplay

