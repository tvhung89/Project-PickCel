import React from 'react'

const Guide = props => (
    <div className="modal fade ads__guide-modal show" id="guide-modal" data-backdrop="static" data-keyboard="false">
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="modal-body">
                    <h1>Getting Started with Pickcel</h1>
                    <div className="ads__guide-modal__content"><img src="/dist/images/group.svg" alt="Group Icons"/>
                        <div className="ads__guide-modal__steps">
                            <div className="step">
                                <p>Step 1</p>
                                <p>Pair your display</p>
                            </div>
                            <div className="step">
                                <p>Step 2</p>
                                <p>Add assets</p>
                            </div>
                            <div className="step">
                                <p>Step 3</p>
                                <p>Create Composition</p>
                            </div>
                            <div className="step">
                                <p>Step 4</p>
                                <p>Create schedules</p>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-primary rounded" type="button" data-dismiss="modal">Ok</button>
                </div>
            </div>
        </div>
    </div>
)

export default Guide

