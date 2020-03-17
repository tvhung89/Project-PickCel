import React, {Component} from 'react'

import clientUtils from '../../../utils'
import { toast } from 'react-toastify'
import Tags from '../../dashboard/Tags'
class AssignDisplay extends Component {
    constructor(props) {
        super(props)

        this.state = {
            displays: [],
            display :{
                get: []
            },
            filteredDisplays: [],
            displayLoading: true,
            displayName: '',
            isScheduling: false,
            selectedSchedule: null,
            isDirty: false,
            toggleFilter: false,
            displayTags : [],
            category: 10,
            searchDisplay: ''
        }   
    }

    componentDidMount() {
        const self = this
        const user_id = clientUtils.get_user_id()
        const selector = '#assign-display-modal'

        if (window.jQuery) {
            jQuery('.scrollbar-outer').scrollbar()

            $(selector).on('show.bs.modal', e => {
                if (user_id) {
                    self.props.getDisplay(user_id)
                }
            })

            $(selector).on('hidden.bs.modal', e => {
                self.setState({
                    selectedSchedule: null
                })
                self.props.onDismissModal()
            })
        }
    }

    componentWillReceiveProps(props) {
        const self = this
        const {fetchedDisplay, selectedSchedule, displayTags} = props

        if (fetchedDisplay && fetchedDisplay != self.props.fetchedDisplay) {
            if (fetchedDisplay.display) {
                const newDisplays = fetchedDisplay.display.map((d, dIndex) => {
                    return {
                        ...d,
                        selected: selectedSchedule && d.schedule ? d.schedule.id == selectedSchedule.id : false
                    }
                })
                const displayFetched = fetchedDisplay.display.length > 0 ? fetchedDisplay.display.sort((a, b) => clientUtils.compare_date(b.modified_at, a.modified_at)) : [fetchedDisplay.display]
                setTimeout(() => {
                    self.setState({
                        display: {
                            get: displayFetched
                          },
                        displays: newDisplays,
                        filteredDisplays: newDisplays,
                        displayLoading: fetchedDisplay.loading
                    })
                }, 100)
            } else {
                if (fetchedDisplay.error) {
                    toast.error('There is something wrong when trying to get displays!')

                    self.setState({
                        displayLoading: fetchedDisplay.loading
                    })
                }
            }
        }
   
        if (displayTags && displayTags.tags && !displayTags.loading) {
            const tags = displayTags.tags.reduce(function (r, a) {
                r[a.key] = r[a.key] || [];
                r[a.key].push(a);
                return r;
            }, Object.create(null))

            self.setState({
                displayTags: tags
            })
        } else {
            if (displayTags && displayTags.error && !displayTags.loading) {
                self.setState({
                    displayTags: null
                })
            }
        }
        if (selectedSchedule) {
            self.setState({
                selectedSchedule,
                displays: self.state.displays.map(d => {
                    return {
                        ...d,
                        selected: selectedSchedule && d.schedule ? d.schedule.id == selectedSchedule.id : false
                    }
                }),
                filteredDisplays: self.state.filteredDisplays.map(d => {
                    return {
                        ...d,
                        selected: selectedSchedule && d.schedule ? d.schedule.id == selectedSchedule.id : false
                    }
                })
            })
        }
    }

    handleSearchDisplay = e => {
        e.preventDefault()
        const self = this
        const value = e ? e.target.value : ''
        const {displays} = self.state

        self.setState({
            displayName: value
        })

        if (value) {
            const ds = displays.filter(d => {
                const name = d.name.toString().toLowerCase()
                const val = value.toString().toLowerCase()
                return name.indexOf(val) > -1
            })
            self.setState({
                filteredDisplays: ds
            })
        } else {
            self.setState({
                filteredDisplays: displays
            })
        }

        return false
    }

    handleCreateSchedule = e => {
        const self = this
        const {filteredDisplays} = self.state
        const selectedDisplays = filteredDisplays
        // const selectedDisplays = filteredDisplays.filter(d => d.selected)

        self.props.onAssignDisplay(selectedDisplays)
    }
    handleToggleFilter = e => {
        e.preventDefault();
        const self = this;
        self.setState({
            toggleFilter: !self.state.toggleFilter
        })

        return false;
    }

    handleFilter = conditions => {
        const self = this
        const {display, searchDisplay, category} = self.state
        const displays = display.get.filter(d => { //assets là nội dung
            const name = d.name.toString().toLowerCase()
            const val = searchDisplay.toString().toLowerCase()
            const isTruthy = name.indexOf(val) > -1 && (d.type == category || category == 10)
            if (conditions.length > 0) {
                return isTruthy && d.tags.find(t => conditions.find(c => c.key === t.key && c.value === t.value))
            }
            return isTruthy
        })
        self.setState({
            filteredDisplays: displays,
        })
    }
    render() {
        const {filteredDisplays, displayLoading, displayName, isScheduling, isDirty, displayTags, toggleFilter} = this.state
        return(
            <div className="modal fade ads__display-add ads__assign-display-modal show" id="assign-display-modal" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Select displays to publish this schedule.</h3><a href="#" data-dismiss="modal"><i className="icon-close"></i></a>
                        </div>
                        <div className="modal-body left">
                        <div className="ads__top-bar">
                        <div className="ads__top-bar-left">
                                    <a href="#" onClick={this.handleToggleFilter}>
                            <i className="icon-filter"></i>
                        </a>
                        <a className="ads__search-box">
                                    <input type="text" placeholder="Search..." onChange={this.handleSearchDisplay} value={displayName} /><i className="icon-search"></i>
                                </a>
                       </div>
                      
                                </div>
                                <div className="ads__display_grid">
                        {toggleFilter && (<Tags 
                                            displayTags={displayTags}
                                            onFilterClose={() => this.setState({toggleFilter: false})}
                                            onInit={e => {this.props.getDisplayTags()}}
                                            onFilter={this.handleFilter} 
                                            />)
                                            }
                            <div className="display-list">
                                <div className={`display-list-table scrollbar-outer ${displayLoading ? 'loading' : ''}`}>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <div className="checkbox no-text">
                                                        <input className="form-control" id="all-displays" type="checkbox" checked={!this.state.filteredDisplays.find(d => !d.selected)} onChange={e => {
                                                            this.setState({
                                                                filteredDisplays: this.state.filteredDisplays.map(display => {
                                                                    return {
                                                                        ...display,
                                                                        selected: e.target.checked
                                                                    }
                                                                }),
                                                                isDirty: true
                                                            })
                                                        }} />
                                                        <label htmlFor="all-displays"></label>
                                                    </div>
                                                </th>
                                                <th>Display Name</th>
                                                <th>Current Schedule</th>
                                                <th>Last Seen Online</th>
                                                <th>Content Status</th>
                                                <th>Network Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredDisplays && filteredDisplays.length > 0 && filteredDisplays.map(d => {
                                                const networkStatusClasses = `network-status ${d.network_status ? 'on' : 'off'}`
                                                return (
                                                    <tr key={d.id}>
                                                        <td>
                                                            <div className="checkbox no-text">
                                                                <input className="form-control" id={d.id} type="checkbox" checked={d.selected} onChange={e => {
                                                                    this.setState({
                                                                        filteredDisplays: this.state.filteredDisplays.map(display => {
                                                                            if (display.id == d.id) return {
                                                                                ...d,
                                                                                selected: e.target.checked
                                                                            }
                                                                            return display
                                                                        }),
                                                                        isDirty: true
                                                                    })
                                                                }} />
                                                                <label htmlFor={d.id}></label>
                                                            </div>
                                                        </td>
                                                        <td>{d.name}</td>
                                                        <td>{d.schedule_id ? d.schedule_id : 'No Schedule'}</td>
                                                        <td>{clientUtils.format_date(d.online_at)}</td>
                                                        <td className="text-center"><i className="icon-close"></i></td>
                                                        <td className="text-center">
                                                            <div className={networkStatusClasses}></div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                            {filteredDisplays && filteredDisplays.length == 0 && (
                                                <tr>
                                                    <td colSpan="5">No display found!</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        </div>
                        <div className="modal-footer">
                            <p><small>Note: Displays that have an existing schedule will be overridden.</small></p>
                            <button className={`btn btn-primary rounded ${isScheduling ? 'disabled' : ''}`} type="button" data-dismiss="modal">Cancel</button>
                            <button className={`btn btn-info rounded ${isDirty ? '' : 'disabled'} ${isScheduling ? 'loading' : ''}`} type="button" onClick={this.handleCreateSchedule} data-dismiss="modal">Schedule</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AssignDisplay

