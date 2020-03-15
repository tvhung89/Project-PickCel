import React, {Component} from 'react'

class CopyComposition extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isSaveAndExit: false
        }   
    }

    componentDidMount() {
        if (window.jQuery) {
            jQuery.validator.addMethod("cname", function(value, element, param) {
                return value.match(new RegExp("^" + param + "$"));
            },'Please enter valid component name!');
        }
    }

    handleCreateComposition = e => {
        e.preventDefault()
        const self = this
        const form = $(e.target)
        const {isSaveAndExit} = self.state

        if (form.valid()) {
            self.props.onCreateComposition(isSaveAndExit, () => {
                $('#save-composition-modal').modal('hide')
            })
        }

        return false
    }

    render() {
        const {compositionName, isDuplicateComposition, oldComposition} = this.props

        return(
            <div className="modal fade ads__display-add ads__save-composition-modal show" id="save-composition-modal">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <form action="#" method="post" noValidate onSubmit={this.handleCreateComposition}>
                            <div className="modal-header">
                                <h3 className="modal-title">{isDuplicateComposition ? `Duplicate composition: ${oldComposition ? oldComposition.name : ''}` : 'Save Composition'}</h3>
                                <a href="#" data-dismiss="modal"><i className="icon-close"></i></a>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <input className="form-control"
                                        name="compositionName" 
                                        type="text"  
                                        value={compositionName}
                                        onChange={e => this.props.onChangeCompositionName(e.target.value)}
                                        data-rule-cname="[a-zA-Z0-9-: ]*"
                                        data-rule-required="true"
                                        data-msg-required="Please enter a name for composition"
                                        placeholder="Enter composition name"/>
                                </div>
                            </div>
                            <div className="modal-footer">
                                {isDuplicateComposition && (
                                    <button className="btn btn-primary rounded" data-dismiss="modal">Close</button>
                                )}
                                <button className="btn btn-success rounded" type="submit" onClick={e => this.setState({isSaveAndExit: false})}>{isDuplicateComposition ? 'Confirm to Copy' : 'Save'}</button>
                                {!isDuplicateComposition && (
                                    <button className="btn btn-primary rounded" type="submit" onClick={e => this.setState({isSaveAndExit: true})}>Save and Exit</button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default CopyComposition

