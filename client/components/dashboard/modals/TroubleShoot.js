import React, {Component} from 'react'

class TroubleShoot extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <React.Fragment>
                <div className="modal fade ads__display-add ads__trubleshoot" id="troubleshoot-modal">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">Troubleshoot</h3>
                                <a href="#" data-dismiss="modal">
                                    <i className="icon-close"></i>
                                </a>
                            </div>
                            <div className="modal-body">
                                <div className="content">

                                </div>
                                <p>The screen is offline, so the debugging options are disabled and will not work.</p>
                                <div className="group-btns">
                                    <button className="btn btn-sm btn-default">
                                        <i className="icon-stamp"></i>
                                        <span>Reload</span>
                                    </button>
                                    <button className="btn btn-sm btn-default">
                                        <i className="icon-stamp"></i>
                                        <span>Clear Cache</span>
                                    </button>
                                    <button className="btn btn-sm btn-default">
                                        <i className="icon-file"></i>
                                        <span>Clear Data</span>
                                    </button>
                                    <button className="btn btn-sm btn-default">
                                        <i className="icon-reload"></i>
                                        <span>Reboot Display</span>
                                    </button>
                                    <button className="btn btn-sm btn-default">
                                        <i className="icon-camera"></i>
                                        <span>Screenshot</span>
                                    </button>
                                    <button className="btn btn-sm btn-default">
                                        <i className="icon-light-bulb"></i>
                                        <span>Current Status</span>
                                    </button>
                                    <button className="btn btn-sm btn-default">
                                        <i className="icon-harddrive"></i>
                                        <span>Hardware Details</span>
                                    </button>
                                    <button className="btn btn-sm btn-default">
                                        <i className="icon-speedometer"></i>
                                        <span>Net Speed</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default TroubleShoot
