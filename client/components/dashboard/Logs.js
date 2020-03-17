import React, {Component} from 'react'
import Select from 'react-select'
import config from '../../../config/config'
import clientUtils from '../../utils'
class Logs extends Component{
    constructor(props){
        super(props)
        this.state={
            logs: null,
            filteredLogs: [],
            pagination: {
                size: config.page_size_log,
                page: 0,
                total: 0,
                numPage: 0
            },
            logLoading: false,
            fetchedDisplaysLoading: false,
            fetchedDisplays: [],
            selectedDisplay: 0,
            selectedSatus: 0,
            selectedTime: 0
        }
    }

    componentDidMount(){
        const self = this
        const user_id = clientUtils.get_user_id()
        if(user_id){
            self.props.getDisplay(user_id)
        }
    }

   componentWillReceiveProps(props){
       const self = this
       const {logs,fetchedDisplay} = props
        if(logs && logs.logs && !logs.loading){
            self.setState({
                ...self.state,
                logs: logs,
                filteredLogs: logs.logs,
                pagination: {
                    ...self.state.pagination,
                    total: logs.logs.length,
                    numPage: new Array(Math.ceil(logs.logs.length / self.state.pagination.size)).fill(0)
                },
                logLoading: logs.loading
            })
        }
        if (fetchedDisplay && fetchedDisplay.display && fetchedDisplay != self.props.fetchedDisplay) {
            const displays = fetchedDisplay.display
            if(displays){
                const displayFetched = fetchedDisplay.display.length > 0 ? fetchedDisplay.display.sort((a, b) => clientUtils.compare_date(b.modified_at, a.modified_at)) : [fetchedDisplay.display]
                let options = [];
                displayFetched.map(e=>{options.push({value: e.id, label: e.name})})
                self.setState({
                    fetchedDisplays: options,
                    fetchedDisplaysLoading: fetchedDisplay.loading,
                })
            }
        } else {
            if (fetchedDisplay && fetchedDisplay.error && !fetchedDisplay.loading) {
                self.setState({
                    fetchedDisplaysLoading: fetchedDisplay.loading
                })
            }
        }

   }

    handlePaginationChange = (e, page) => {
        e.preventDefault()
        const self = this
        self.setState({
            ...self.state,
            pagination: {
                ...self.state.pagination,
                page
            }
        })
        return false
    }
    
    handleChangeDisplay = (selectedDisplay) =>{
      const value = selectedDisplay.value
      const self = this
      self.setState({selectedDisplay})
      if(value!='0'){
          if(self.state.selectedSatus || self.state.selectedSatus!='0')
          self.props.getLogs({playerId: value, actionName: self.state.selectedSatus?self.state.selectedSatus:null, createdDate:{$gt: self.state.selectedTime}})
          else
          self.props.getLogs({playerId: value, createdDate:{$gt: self.state.selectedTime}})
        }

    }


    handleChangeSatus = (e) =>{
        const value = e.target.value
        const self = this
        self.setState({
            selectedSatus: value!='0'?parseInt(value):0
        })
        if(value!='0'){
        if(self.state.selectedDisplay)
            self.props.getLogs({playerId: self.state.selectedDisplay.value?self.state.selectedDisplay.value: null, actionName: parseInt(value), createdDate: {$gt: self.state.selectedTime}})
        }else{
            self.props.getLogs({playerId: self.state.selectedDisplay.value?self.state.selectedDisplay.value: null, createdDate: {$gt: self.state.selectedTime}})
        }
  
      }

      handleChangeTime = (e) =>{
        const value = e.target.value
        const self = this
        let time = 0;
        
         
        if(value=='0'){
            time = 0
        }
        if(value=='1'){
            time =(new Date().getTime()/1000).toFixed(0) - 3600
        }
        if(value=='2'){
            time = (new Date().getTime()/1000).toFixed(0) - 24*3600
        }
        if(value=='3'){
            time = (new Date().getTime()/1000).toFixed(0) - 24*7*3600
        }
        if(value=='4'){
            time = (new Date().getTime()/1000).toFixed(0) - 24*30*3600
        }
        self.setState({
            selectedTime: time
        })
        if(value){
            if(self.state.selectedDisplay){
                if(self.state.selectedSatus || self.state.selectedSatus!='0')
                self.props.getLogs({playerId: self.state.selectedDisplay.value?self.state.selectedDisplay.value: null, actionName: self.state.selectedSatus?self.state.selectedSatus:null, createdDate:{$gt: time}})
                else
                self.props.getLogs({playerId: self.state.selectedDisplay.value?self.state.selectedDisplay.value: null,  createdDate:{$gt: time}})
            }
        }
  
      }
    render(){
        const {filteredLogs,pagination,selectedDisplay,fetchedDisplays} = this.state
      //  const loaderClasses = `${fetchedDisplaysLoading || tagsLoading ? 'loading' : ''}`
        const loaderClasses = ''
        return(
            <div className={`ads__display ${loaderClasses}`}>
            <div className="ads__top-bar">
             <div className="row" style={{width:"100%"}}>
                    <div className="col-3 form-group">
                    <label>Select display:</label>
                    <Select
                        value={selectedDisplay}
                        onChange={this.handleChangeDisplay}
                        options={fetchedDisplays}
                    />
                        {/* <select className="form-control" onChange={this.handleChangeDisplay}>
                        <option value="0">--Select display--</option>
                        {fetchedDisplays.length?fetchedDisplays.map(e=>
                        <option value={e.id}>{e.name}</option>
                        ):''}
                        </select> */}
                    </div>
                    <div className="col-3 form-group">
                    <label>Select status:</label>
                    <select className="form-control" onChange={this.handleChangeSatus}>
                        <option value="0">--Select status--</option>
                        <option value="1">Playing composition</option>
                        <option value="2">Download composition</option>
                        <option value="3">Remove composition</option>
                        <option value="4">Update composition</option>
                        <option value="5">Pause composition</option>
                        <option value="6">Download the advertising pack</option>
                        <option value="7">Remove the advertising pack</option>
                        <option value="8">Startup application</option>
                        <option value="9">Refresh display</option>
                        <option value="10">Close the app to install</option>
                        <option value="11">Download the default ad package</option>
                        <option value="12">Change the default ad package</option>
                        <option value="13">Save password</option>
                        <option value="14">Check the version</option>
                        <option value="15">Download apk file</option>
                    </select> 
                    </div>
                    <div className="col-3 form-group">
                       <label>Data filtering time:</label>
                       <select className="form-control" onChange={this.handleChangeTime}>
                        <option value="0">--Select time--</option>
                        <option value="1">1 hour  ago</option>
                        <option value="2">1 day ago</option>
                        <option value="3">1 week ago</option>
                        <option value="4">1 month ago</option>
                    </select> 
                    </div>
                    </div>
            </div>
                <div className="ads__display_grid">
                    <div className="ads__display_list">
                        <table id="display_list">
                            <thead>
                                <tr>
                                    <th>Action Name</th>
                                    <th>Detail</th>
                                    <th>Time</th>

                                </tr>
                            </thead>
                            <tbody>
                                {selectedDisplay!=0 && filteredLogs && filteredLogs.length > 0 && filteredLogs.slice(pagination.page * pagination.size, (pagination.page + 1) * pagination.size).map(d => {
                                    //const networkStatusClasses = `network-status ${d.network_status ? 'on' : 'off'}`
                                    return (
                                        <tr key={d._id}>
                                            <td><div className={`badge ${d.actionStatus==1?"badge-success":'badge-warning'}`}>
                                                {d.actionName==1?"Playing composition":''}
                                                {d.actionName==2?"Download composition":''}
                                                {d.actionName==3?"Remove composition":''}
                                                {d.actionName==4?"Update composition":''}
                                                {d.actionName==5?"Pause composition":''}
                                                {d.actionName==6?"Download the advertising pack":''}
                                                {d.actionName==7?"Remove the advertising pack":''}
                                                {d.actionName==8?"Startup application":''}
                                                {d.actionName==9?"Refresh display":''}
                                                {d.actionName==10?"Close the app to install":''}
                                                {d.actionName==11?"Download the default ad package":''}
                                                {d.actionName==12?"Change the default ad package":''}
                                                {d.actionName==13?"Save password":''}
                                                {d.actionName==14?"Check the version":''}
                                                {d.actionName==15?"Download apk file":''}
                                                </div></td>
                                            <td>{d.actionDetail}</td>
                                            <td>{clientUtils.format_date(d.createdDate*1000)}</td>
                                        </tr>
                                    )
                                })}
                                {selectedDisplay!=0 && filteredLogs && filteredLogs.length == 0 && (
                                    <tr>
                                        <td colSpan="5">No log found!</td>
                                    </tr>
                                )}

                                {!selectedDisplay?<tr><td colSpan="3"><div className="alert alert-warning"> Select a device to view activity history</div></td></tr>:<tr></tr>}
                            </tbody>
                        </table>
                        <div className="foot">
                            {selectedDisplay!=0 && filteredLogs && filteredLogs.length > 0 && (
                                <p>{filteredLogs.length} {filteredLogs.length > 1 ? 'logs' : 'log'}</p>
                            )}

                            { selectedDisplay!=0 && pagination && pagination.numPage.length > 1 && (
                                <ul className="pagination">
                                    <li className={`page-item ${pagination.page == 0 ? 'disabled' : ''}`}><a className="page-link" href="#" onClick={e => this.handlePaginationChange(e, 0)}><i className="icon-angle-double-left"></i></a></li>
                                    <li className={`page-item ${pagination.page == 0 ? 'disabled' : ''}`}><a className="page-link" href="#" onClick={e => this.handlePaginationChange(e, pagination.page - 1)}><i className="icon-angle-left"></i></a></li>
                                    {pagination.numPage.length > 0 && pagination.numPage.map((n, index) => {
                                        const activePageClasses = `page-item ${pagination.page === index ? 'active' : ''}`
                                        if(pagination.page === index-1 ||pagination.page === index|| pagination.page === index+1 )
                                       { 
                                           return (
                                            <li className={activePageClasses} key={index}><a className="page-link" href="#" onClick={e => this.handlePaginationChange(e, index)}>{index + 1}</a></li>
                                        )
                                       }
                                    })}
                                    <li className={`page-item ${pagination.page == pagination.numPage.length - 1 ? 'disabled' : ''}`}><a className="page-link" href="#"><i className="icon-angle-double-right"></i></a></li>
                                    <li className={`page-item ${pagination.page == pagination.numPage.length - 1 ? 'disabled' : ''}`}><a className="page-link" href="#"><i className="icon-angle-right"></i></a></li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Logs