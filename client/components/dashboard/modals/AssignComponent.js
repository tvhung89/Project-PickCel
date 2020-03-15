import React, {Component} from 'react'

import {Composition} from '../../../containers/dashboard/Composition'

class AssignComposition extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedDisplay: null
        }
    }

    componentWillReceiveProps(props) {
        const self = this
        const {selectedDisplay} = props

        if (selectedDisplay) {
            self.setState({
                selectedDisplay
            })
        }
    }

    handleAssignComposition = composition => {
        const self = this
        self.props.onAssignComposition(composition)
    }

    render() {
        const {selectedDisplay} = this.state

        return(
            <div className="modal fade ads__display-add ads__assign-composition-modal show" id="assign-composition-modal" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog modal-lg">
                    <div className={`modal-content ${selectedDisplay ? '' : 'loading-text'}`}>
                        <div className="modal-header">
                            {selectedDisplay && (
                                <h3 className="modal-title">Assign Default Composition to {selectedDisplay.name}</h3>
                            )}
                            <a href="#" data-dismiss="modal"><i className="icon-close"></i></a>
                        </div>
                        <div className="modal-body left">
                            <Composition isAssignable={true} selectedDisplay={selectedDisplay} onAssignComposition={c => this.handleAssignComposition(c)} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AssignComposition

