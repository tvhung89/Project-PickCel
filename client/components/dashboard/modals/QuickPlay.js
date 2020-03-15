import React, {Component} from 'react'

class CopyComposition extends Component {
    constructor(props) {
        super(props)

        this.state = {
            
        }   
    }

    componentDidMount() {
        
    }

    componentWillReceiveProps(props) {
        
    }

    render() {
        return(
            <div className="modal fade ads__display-add ads__quick-play-modal show" id="quick-play-modal">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Quick Play</h3><a href="#" data-dismiss="modal"><i className="icon-close"></i></a>
                        </div>
                        <div className="modal-body left">
                            <form className="row" action="#" method="post">
                                <div className="col-6 form-group">
                                    <label htmlFor="qpName">Name</label>
                                    <input className="form-control" id="qpName" type="text" placeholder="Enter quick play name *"/>
                                </div>
                                <div className="col-6 form-group">
                                    <label htmlFor="qpTime"><span>Time </span><small>(in minutes)</small></label>
                                    <input className="form-control" id="qpTime" type="number" defaultValue="10"/>
                                </div>
                            </form>
                            <div className="display-list">
                                <div className="ads__search-box">
                                    <input type="text" placeholder="Search Display..."/><i className="icon-search"></i>
                                </div>
                                <div className="display-list-table">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <div className="checkbox">
                                                        <input className="form-control" id="all" type="checkbox" checked/>
                                                        <label htmlFor="all">&nbsp;</label>
                                                    </div>
                                                </th>
                                                <th>Display Name</th>
                                                <th>last Sync</th>
                                                <th>Network Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div className="checkbox">
                                                        <input className="form-control" type="checkbox" checked id="first1"/>
                                                        <label htmlFor="first1">&nbsp;</label>
                                                    </div>
                                                </td>
                                                <td>Linux Ubuntu</td>
                                                <td>23 Aug, 2019, 11:21 AM</td>
                                                <td>
                                                    <div className="network-status off"></div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="checkbox">
                                                        <input className="form-control" type="checkbox" checked id="first2"/>
                                                        <label htmlFor="first2">&nbsp;</label>
                                                    </div>
                                                </td>
                                                <td>Linux Ubuntu</td>
                                                <td>23 Aug, 2019, 11:21 AM</td>
                                                <td>
                                                    <div className="network-status off"></div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="checkbox">
                                                        <input className="form-control" type="checkbox" checked id="first3"/>
                                                        <label htmlFor="first3">&nbsp;</label>
                                                    </div>
                                                </td>
                                                <td>Linux Ubuntu</td>
                                                <td>23 Aug, 2019, 11:21 AM</td>
                                                <td>
                                                    <div className="network-status off"></div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="checkbox">
                                                        <input className="form-control" type="checkbox" checked id="first4"/>
                                                        <label htmlFor="first4">&nbsp;</label>
                                                    </div>
                                                </td>
                                                <td>Linux Ubuntu</td>
                                                <td>23 Aug, 2019, 11:21 AM</td>
                                                <td>
                                                    <div className="network-status off"></div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="checkbox">
                                                        <input className="form-control" type="checkbox" checked id="first5"/>
                                                        <label htmlFor="first5">&nbsp;</label>
                                                    </div>
                                                </td>
                                                <td>Linux Ubuntu</td>
                                                <td>23 Aug, 2019, 11:21 AM</td>
                                                <td>
                                                    <div className="network-status off"></div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-success rounded" type="button" data-dismiss="modal">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CopyComposition

