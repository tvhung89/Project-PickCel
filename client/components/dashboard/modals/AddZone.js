import React, {Component} from 'react'

class AddZone extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
            zone: null
        }   
    }

    componentWillReceiveProps(props) {
        const self = this
        const {zone} = props

        self.setState({
            zone
        })

        if (zone && zone.add && zone.add.zone && !zone.add.zone.loading) {
            $("#add-zone-modal").modal('hide')

            self.setState({
                name: ''
            })
        }
    }

    handleAddZone = e => {
        e.preventDefault()
        const self = this
        const form = $(e.target)
        const {name} = self.state

        if (form.valid() && name) {
            self.props.onAddZone(name)
        }

        return false;
    }

    render() {
        const {name, zone} = this.state
        const zoneBtnClasses = `btn btn-success rounded ${zone && zone.loading ? 'loading' : ''}`

        return(
            <div className="modal fade ads__display-add show" id="add-zone-modal" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                        <form noValidate onSubmit={this.handleAddZone}>
                            <div className="modal-body">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <div className="input-group-text">Name</div>
                                    </div>
                                    <input className="form-control" 
                                            type="text" 
                                            name="zoneName"
                                            value={name}
                                            onChange={e => this.setState({
                                                name: e.target.value
                                            })}
                                            data-rule-required="true"
                                            data-msg-required="Please enter zone name"
                                            maxLength="15"
                                            autoComplete="off"
                                            placeholder="Enter zone name" />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary rounded" type="button" onClick={e => {
                                    $('#add-zone-modal').modal('hide')
                                }}>Cancel</button>
                                <button className={zoneBtnClasses} type="submit">Add Zone</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddZone

