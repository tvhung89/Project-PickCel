import React, {Component} from 'react'

import config from '../../../config/config'
import clientUtils from '../../utils'
import {toast} from 'react-toastify'
import swal from 'sweetalert'

import {AssignDisplay} from '../../containers/dashboard/modals/AssignDisplay'

class Schedule extends Component {
    constructor(props) {
        super(props)

        this.state = {
            schedules: [],
            scheduleLoading: true,
            filteredSchedules: [],
            pagination: {
                size: config.page_size,
                page: 0,
                total: 0,
                numPage: 0
            },
            scheduleName: '',
            selectedSchedule: null
        }   
    }

    componentDidMount() {
        const self = this
        const user_id = clientUtils.get_user_id()

        if (user_id) {
            self.props.getSchedule(user_id)
        }
    }

    componentWillReceiveProps(props) {
        const self = this
        const {fetchedSchedule, deletedSchedule, updatedDisplay} = props

        if (fetchedSchedule && fetchedSchedule != self.props.fetchedSchedule) {
            if (fetchedSchedule.schedule) {
                const schedules = fetchedSchedule.schedule.sort((a, b) => clientUtils.compare_date(b.modified_at, a.modified_at))
                self.setState({
                    schedules: schedules,
                    filteredSchedules: schedules,
                    pagination: {
                        ...self.state.pagination,
                        total: schedules.length,
                        numPage: new Array(Math.ceil(schedules.length / self.state.pagination.size)).fill(0)
                    },
                    scheduleLoading: fetchedSchedule.loading
                })
            }

            if (fetchedSchedule.error) {
                self.setState({
                    scheduleLoading: fetchedSchedule.loading
                })
            }
        }

        if (deletedSchedule && deletedSchedule.schedule && deletedSchedule.schedule != self.props.deletedSchedule.schedule) {
            if (deletedSchedule.schedule) {
                const schedule = deletedSchedule.schedule
                const newSchedules = self.state.schedules.filter(d => d.id != schedule.id)
                self.setState({
                    schedules: newSchedules,
                    filteredSchedules: newSchedules,
                    pagination: {
                        ...self.state.pagination,
                        total: newSchedules.length,
                        numPage: new Array(Math.ceil(newSchedules.length / self.state.pagination.size)).fill(0)
                    },
                    scheduleName: ''
                })

                toast.success('Schedule deleted successfully!')
            }

            if (deletedSchedule.error) {
                toast.error('Something wrong when trying to delete schudules!')
            }
        }

        if (updatedDisplay && updatedDisplay.display && updatedDisplay.display != self.props.updatedDisplay.display) {
            if (updatedDisplay.display) {
                const displays = updatedDisplay.display
                const newSchedules = self.state.schedules.map(s => {
                    return {
                        ...s,
                        displays: displays.filter(d => d.schedule_id == s.id)
                    }
                })
                self.setState({
                    schedules: newSchedules,
                    filteredSchedules: newSchedules,
                    pagination: {
                        ...self.state.pagination,
                        total: newSchedules.length,
                        numPage: new Array(Math.ceil(newSchedules.length / self.state.pagination.size)).fill(0)
                    },
                    scheduleName: ''
                })
                window.location.reload()
                toast.success('Display re-assigned successfully!')
            }

            if (deletedSchedule.error) {
                toast.error('Something wrong when trying to assign displays!')
            }
        }
    }

    handlePaginationChange = (e, page) => {
        e.preventDefault();
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

    handleSearchSchedule = (e) => {
        e.preventDefault()
        const self = this
        const value = e ? e.target.value : ''
        const {schedules} = self.state

        self.setState({
            scheduleName: value
        })

        if (value) {
            const scds = schedules.filter(s => {
                const name = s.name.toString().toLowerCase()
                const val = value.toString().toLowerCase()
                return name.indexOf(val) > -1
            })
            self.setState({
                filteredSchedules: scds,
                pagination: {
                    ...self.state.pagination,
                    total: scds.length,
                    numPage: new Array(Math.ceil(scds.length / self.state.pagination.size)).fill(0),
                    page: 0
                }
            })
        } else {
            self.setState({
                filteredAssets: schedules,
                pagination: {
                    ...self.state.pagination,
                    total: schedules.length,
                    numPage: new Array(Math.ceil(schedules.length / self.state.pagination.size)).fill(0),
                    page: 0
                }
            })
        }

        return false
    }

    handleDeleteSchedule = (e, schedule) => {
        const self = this

        if (schedule && schedule.id) {
            swal({
                text: "Are you sure you want to delete schedule?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then(ok => {
                if (ok) {
                    self.props.deleteSchedule(schedule.id)
                }
            })
        }
    }

    handleOpenAssignDisplayModal = (e, schedule) => {
        const self = this

        self.setState({
            selectedSchedule: schedule
        })
    }

    handleAssignDisplay = (displays) => {
        const self = this
        const {selectedSchedule} = self.state
        const isScheduleExistInDisplays = displays.filter(d => d.schedule_id).length
        const selectedD = displays.filter(d => d.selected)

        swal({
            className: 'ads__swal',
            title: selectedD.length > 0 ? `Assign schedule '${selectedSchedule.name}' to total ${selectedD.length} ${selectedD.length > 1 ? 'displays' : 'display'}?` : `You're trying to reset all displays! Default component will be used. Are you sure?`,
            text: selectedD.length > 0 ? (isScheduleExistInDisplays ? `Note: There ${isScheduleExistInDisplays > 1 ? 'are' : 'is'} ${isScheduleExistInDisplays} ${isScheduleExistInDisplays > 1 ? 'screens' : 'screen'} already have some content scheduled which will be overridden.` : '') : '',
            buttons: true,
            icon: "warning",
            dangerMode: true
        }).then(ok => {
            if (ok) {
                let selectedDisplays = displays.map(d => {
                    return {
                        id: d.id,
                        schedule_id: selectedSchedule.id,
                        selected: d.selected
                    }
                })
                setTimeout(() => {
                    self.props.updateDisplay({
                        displays: selectedDisplays
                    })
                }, 100)
            }
        })
    }

    render() {
        const {filteredSchedules, scheduleLoading, pagination, scheduleName, selectedSchedule} = this.state
        const displaySchedules = filteredSchedules && filteredSchedules.length > 0 ? filteredSchedules.slice(pagination.page * pagination.size, (pagination.page + 1) * pagination.size) : []
        const scheduleMarkup = displaySchedules.length > 0 ? (
            <React.Fragment>
                <div className="ads__top-bar">
                    <a href={"/dashboard/schedule/create"} className="btn btn-primary rounded">
                        <i className="icon-plus"></i><span>Create Schedule</span>
                    </a>
                    <div className="ads__search-box">
                        <input type="text" onChange={this.handleSearchSchedule} value={scheduleName} placeholder="Search..."/>
                        <i className="icon-search"></i>
                    </div>
                </div>
                <div className="ads__display_grid">
                    <div className="ads__display_list">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Schedule Version</th>
                                    <th>No. of Compositions</th>
                                    <th>Displays Assigned</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displaySchedules.map((s, sIndex) => {
                                    const date = clientUtils.get_min_max_date(s)
                                    return (
                                        <tr key={sIndex}>
                                            <td>{(sIndex + 1) + (pagination.page * pagination.size)}</td>
                                            <td>{s.name}</td>
                                            <td>{s.version}</td>
                                            <td>{s.compositions.length}</td>
                                            <td>{s.displays.length}</td>
                                            <td>{date.min}</td>
                                            <td>{date.max}</td>
                                            <td>
                                                <a href={`/dashboard/schedule/edit/${s.id}`}>
                                                    <i className="icon-pencil"></i>
                                                </a>
                                                <a href="#assign-display-modal" data-toggle="modal" onClick={e => this.handleOpenAssignDisplayModal(e, s)}>
                                                    <i className="icon-monitor"></i>
                                                </a>
                                                <a href="#" onClick={e => this.handleDeleteSchedule(e, s)}>
                                                    <i className="icon-trash"></i>
                                                </a>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        <div className="foot">
                            {filteredSchedules && filteredSchedules.length > 0 && (
                                <p>{filteredSchedules.length} {filteredSchedules.length > 1 ? 'schedules' : 'schedule'}</p>
                            )}
                            
                            {pagination && pagination.numPage.length > 1 && (
                                <ul className="pagination">
                                    <li className={`page-item ${pagination.page == 0 ? 'disabled' : ''}`}><a className="page-link" href="#" onClick={e => this.handlePaginationChange(e, 0)}><i className="icon-angle-double-left"></i></a></li>
                                    <li className={`page-item ${pagination.page == 0 ? 'disabled' : ''}`}><a className="page-link" href="#" onClick={e => this.handlePaginationChange(e, pagination.page - 1)}><i className="icon-angle-left"></i></a></li>
                                    {pagination.numPage.length > 0 && pagination.numPage.map((n, index) => {
                                        const activePageClasses = `page-item ${pagination.page === index ? 'active' : ''}`
                                        return (
                                            <li className={activePageClasses} key={index}><a className="page-link" href="#" onClick={e => this.handlePaginationChange(e, index)}>{index + 1}</a></li>
                                        )
                                    })}
                                    <li className={`page-item ${pagination.page == pagination.numPage.length - 1 ? 'disabled' : ''}`}><a className="page-link" href="#" onClick={e => this.handlePaginationChange(e, pagination.page + 1)}><i className="icon-angle-right"></i></a></li>
                                    <li className={`page-item ${pagination.page == pagination.numPage.length - 1 ? 'disabled' : ''}`}><a className="page-link" href="#" onClick={e => this.handlePaginationChange(e, pagination.numPage.length - 1)}><i className="icon-angle-double-right"></i></a></li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        ) : (
            <div className="no-result">
                <img src="/dist/images/schedule.svg" alt="Composition" />
                <p>You can create schedule by selecting the date &amp; time and connect it with the composition that you have created.</p>
                <a href={"/dashboard/schedule/create"} className="btn btn-primary rounded">
                    <i className="icon-plus"></i>
                    <span>Create Schedule</span>
                </a>
            </div>
        )

        return(
            <div className={`ads__display ${scheduleLoading ? 'loading-text' : ''}`}>
                <AssignDisplay onDismissModal={e => {}} selectedSchedule={selectedSchedule} onAssignDisplay={this.handleAssignDisplay} />
                {scheduleMarkup}
            </div>
        )
    }
}

export default Schedule

