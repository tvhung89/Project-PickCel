import React, {Component} from 'react'
import appData from '../../../config/apps' 

import {Youtube} from '../../containers/dashboard/modals/apps/Youtube'

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            apps: appData,
            filteredApps: appData,
            appName: ''
        }   
    }

    componentDidMount() {
       
    }

    componentWillReceiveProps(props) {
        
    }

    handleSearchApp = e => {
        e.preventDefault()
        const self = this
        const value = e ? e.target.value : ''
        const {apps} = self.state

        self.setState({
            appName: value
        })

        if (value) {
            self.setState({
                filteredApps: apps.filter(a => {
                    const cName = a.name.toLowerCase()
                    const val = value.toLowerCase()
    
                    return cName.indexOf(val) > -1
                })
            })
        } else {
            self.setState({
                filteredApps: apps
            })
        }

        return false
    }

    render() {
        const {filteredApps, appName} = this.state
        
        return(
            <div className="ads__app">
                <Youtube />
                <div className="ads__app-header">
                    <div className="ads__search-box ads__app-search-box">
                        <input type="text" placeholder="Search..." value={appName} onChange={this.handleSearchApp}/>
                        <i className="icon-search"></i>
                    </div>
                </div>
                <div className="ads__app-content">
                    <div className="ads__app-list">
                        {filteredApps && filteredApps.length > 0 ? (
                            <div className="row">
                                {filteredApps.map((a, aIndex) => {
                                    return (
                                        <div className="ads__app-list_item col-6 col-sm-4 col-md-3 col-lg-2 col-xl-2" key={aIndex}>
                                            <div className="ads__app-list_item_thumb">
                                                <img src={a.image}/>
                                            </div>
                                            <div className="ads__app-list_item_title">
                                                <p>{a.name}</p>
                                                <button className="btn btn-default btn-sm" data-toggle="modal" data-target={`#${a.name.toLowerCase()}-modal`}>
                                                    <i className="icon-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p>No apps found!</p>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default App