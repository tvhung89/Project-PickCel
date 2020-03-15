import React, {Component} from 'react'

class UpdateLicense extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className="modal fade ads__display-add show" id="updateLicense-modal" data-backdrop="static" data-keyboard="false">
            <div className="modal-dialog modal-md">
                <div className="modal-content">
                <div className="modal-header">
                        <h3 className="modal-title">Update License</h3><a href="#" data-dismiss="modal"><i className="icon-close"></i></a>
                    </div>
                    <form noValidate>
                        <div className={`modal-body`}>
                                <React.Fragment>
                                    <div className="form-row">
                                        <div className="form-group col-md-3">
                                            <label htmlFor="license-code">License code:</label>
                                        </div>
                                        <div className="form-group col-md-9">
                                            <input className="form-control"  name="code" type="text" id="license-code" onChange={()=>{}} data-rule-required="true" placeholder="Input license code"/>
                                        </div>
                                    </div>
                                </React.Fragment>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-success rounded" type="button">Submit</button>
                            <button className="btn btn-primary rounded" type="button" data-dismiss="modal">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        )
    }
}
export default UpdateLicense;