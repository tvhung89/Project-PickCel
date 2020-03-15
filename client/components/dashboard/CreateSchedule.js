import React, {Component} from 'react'

import clientUtils from '../../utils'
import swal from 'sweetalert'
import {toast} from 'react-toastify'

import {AddComposition} from '../../containers/dashboard/modals/AddComposition'
import {AssignDisplay} from '../../containers/dashboard/modals/AssignDisplay'

class CreateSchedule extends Component {
    constructor(props) {
        super(props)

        this.state = {
            calendar: null,
            events: [],
            tempEvent: null,
            scheduleName: '',
            isSaving: false,
            isSaveDisplay: false,
            isSavingAndAssignDisplay: false,
            isEditSchedule: false,
            scheduleLoading: false,
            scheduleId: null,
            displays: [],
            weekdays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
            selectedVersion: 1
        }
    }

    componentWillMount() {
        const self = this
        const {schedule_id} = self.props.match.params
        if (schedule_id) {
            self.setState({
                scheduleLoading: true
            })
        }
    }

    componentDidMount() {
        const self = this
        const {schedule_id} = self.props.match.params

        if (window.jQuery) {
            self.setState({
                scheduleName: `S - ${clientUtils.format_date(null, true)}`
            })

            var calendarEl = document.getElementById('calendar')
            if (calendarEl) {
                var calendar = new FullCalendar.Calendar(calendarEl, {
                    plugins: ['interaction', 'dayGrid', 'timeGrid'],
                    header: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    },
                    defaultDate: new Date(),
                    navLinks: true,
                    selectable: true,
                    selectMirror: true,
                    slotDuration: '00:30:00',
                    snapDuration: '00:15:00',
                    select: function (arg) {
                        $("#add-schedule-link").trigger('click');

                        self.setState({
                            tempEvent: {
                                allDay: arg.allDay,
                                start: arg.start,
                                end: arg.end,
                                id: +new Date()
                            }
                        })
                        calendar.unselect()
                    },
                    eventClick: function (info) {
                        self.setState({
                            tempEvent: {
                                ...self.state.events.find(e => e.id == info.event.id),
                                event_id: info.event.id
                            }
                        })

                        $("#add-schedule-link").trigger('click');
                    },
                    editable: true,
                    eventLimit: false,
                    selectOverlap: false,
                    eventOverlap: false,
                    events: [],
                    defaultView: 'timeGridDay',
                    allDaySlot: false,
                    eventDrop: self.updateEvent,
                    eventResize: self.updateEvent
                })

                calendar.render()

                setTimeout(() => {
                    jQuery('.fc-scroller').addClass('scrollbar-outer').scrollbar()
                    jQuery('.fc-scroller').css('max-height', 'calc(100vh - 180px)')
                }, 100)

                self.setState({
                    calendar
                })
            }

            if (schedule_id) {
                self.props.getSchedule({
                    id: schedule_id
                })

                self.setState({
                    isEditSchedule: true,
                    scheduleId: schedule_id
                })
            }
        }
    }

    updateEvent = info => {
        const self = this
        const {calendar, events} = self.state
        const event = events[0]
        let start = info.event.start
        let end = info.event.end
        const calendarEvents = []
        const numDays = event.isRepeat ? new Array(clientUtils.get_date_diff(event.endDate, event.startDate) + 1).fill(0) : []
        const uiEvents = calendar.getEvents()

        const endTime = `${clientUtils.format_date_custom(end, 'YYYY-MM-DD')} ${clientUtils.format_date_custom(end, 'HH:mm:ss')}`
        const currentTime = `${clientUtils.format_date_custom(new Date(), 'YYYY-MM-DD HH:mm:ss')}`

        if (endTime <= currentTime) {
            start = event.start
            end = event.end
            swal({
                text: "The end date is smaller than the current date",
                icon: "warning",
                dangerMode: true
            })
        }

        uiEvents.forEach(e => {
            if (e.id === (event.id.toString())) {
                e.remove()
            }
        })

        if (numDays.length > 1) {
            numDays.forEach((d, dIndex) => {
                let newStart, newEnd, tempEndDate, dayIndex
                const startDate = `${clientUtils.format_date_custom(start, 'YYYY-MM-DD')}`
                const endDate = `${clientUtils.format_date_custom(end, 'YYYY-MM-DD')}`

                newStart = clientUtils.add_date(event.startDate, dIndex)
                if (startDate === endDate) {
                    tempEndDate = clientUtils.add_date(new Date(`${clientUtils.format_date_custom(event.startDate, 'YYYY-MM-DD')} ${clientUtils.format_date_custom(end, 'HH:mm:ss')}`), dIndex)
                    newEnd = moment(newStart).hours(tempEndDate.hours()).minutes(tempEndDate.minutes()).seconds(tempEndDate.seconds())
                } else {
                    // newStart = clientUtils.add_date(start, dIndex)
                    if (dIndex + 1 >= numDays.length) {
                        tempEndDate = clientUtils.add_date(new Date(`${clientUtils.format_date_custom(event.startDate, 'YYYY-MM-DD')} 23:59:59`), dIndex)
                    } else {
                        tempEndDate = clientUtils.add_date(new Date(`${clientUtils.format_date_custom(event.startDate, 'YYYY-MM-DD')} ${clientUtils.format_date_custom(end, 'HH:mm:ss')}`), (dIndex + 1))
                    }
                    newEnd = moment(tempEndDate).hours(tempEndDate.hours()).minutes(tempEndDate.minutes()).seconds(tempEndDate.seconds())
                }

                dayIndex = clientUtils.get_day_of_week(newStart)
                if (event.days[dayIndex]) {
                    calendarEvents.push({
                        ...event,
                        start: new Date(newStart),
                        end: new Date(newEnd),
                    })
                }
            })
            calendar.addEventSource(calendarEvents)
        } else if (numDays.length == 1) {
            const dayIndex = clientUtils.get_day_of_week(start)
            if (event.days[dayIndex]) {
                calendar.addEvent({
                    ...event,
                    start: start,
                    end: end,
                })
            }
        } else {
            calendar.addEvent({
                ...event,
                start: start,
                end: end,
            })
        }
        self.setState({
            events: self.state.events.map(e => {
                return e.id == info.event.id ? {
                    ...e,
                    start: start,
                    end: end,
                    allDay: info.event.allDay
                } : e
            })
        })
    }

    componentWillReceiveProps(props) {
        const self = this
        const {fetchedSchedule, updatedSchedule, addedSchedule} = props
        const {calendar, weekdays} = self.state

        if (fetchedSchedule && fetchedSchedule !== self.props.fetchedSchedule) {
            if (fetchedSchedule.schedule && fetchedSchedule.schedule.length > 0) {
                const sFetched = fetchedSchedule.schedule[0]
                const {name, displays, compositions, prior_level, order_level} = sFetched
                let newEvents = []
                let eventData = []
                compositions.forEach((c, idx) => {
                    const isExist = newEvents.find(e => e.composition_id == c.id)
                    const newEvent = {
                        allDay: false,
                        eventColor: isExist ? isExist.color : clientUtils.get_random_color(),
                        composition_id: c.id,
                        days: [c.sunday, c.monday, c.tuesday, c.wednesday, c.thursday, c.friday, c.saturday, c.sunday],
                        id: `${+new Date()}${idx}`,
                        isRepeat: c.is_repeat,
                        title: c.name,
                        prior_level: c.prior_level,
                        order_level: c.order_level,
                    }

                    eventData.push({
                        ...newEvent,
                        start: new Date(c.start_date),
                        startDate: new Date(c.start_date),
                        end: new Date(c.end_date),
                        endDate: new Date(c.end_date)
                    })

                    if (c.is_repeat) {
                        const range = new Array(moment(c.end_date).diff(moment(c.start_date), 'd') + 1).fill(0)
                        const endDateMoment = moment(c.end_date)

                        range.forEach((item, itemIndex) => {
                            const start_date = moment(c.start_date).add(itemIndex, 'd')
                            const end_date = moment(c.start_date).add(itemIndex, 'd').hours(endDateMoment.hours()).minutes(endDateMoment.minutes()).seconds(endDateMoment.seconds())
                            const weekday = weekdays[start_date.day()]
                            if (weekday) {
                                newEvents.push({
                                    ...newEvent,
                                    start: start_date.toDate(),
                                    startDate: start_date.toDate(),
                                    end: end_date.toDate(),
                                    endDate: end_date.toDate()
                                })
                            }
                        })
                    } else {
                        newEvents.push({
                            ...newEvent,
                            start: new Date(c.start_date),
                            startDate: new Date(c.start_date),
                            end: new Date(c.end_date),
                            endDate: new Date(c.end_date)
                        })
                    }
                })

                setTimeout(() => {
                    self.setState({
                        scheduleName: name,
                        displays,
                        events: eventData,
                        selectedVersion: sFetched.version,
                        defaultPrior: prior_level,
                        defaultOrder: order_level
                    })
                    setTimeout(() => {
                        if (calendar) calendar.addEventSource(newEvents)

                        self.setState({
                            scheduleLoading: false
                        })
                    }, 1000)
                }, 100)
            }
        }

        if (addedSchedule && addedSchedule.schedule && addedSchedule != self.props.addedComposition) {
            self.setState({
                isSaving: false,
                isSaveDisplay: true
            })

            toast.success('Schedule created successfully!')
            window.location = '/dashboard/schedule'
        } else {
            if (addedSchedule.error && !addedSchedule.loading && addedSchedule != self.props.addedSchedule) {
                toast.error('There is an error when adding schedule, please try again later!')

                self.setState({
                    isSaving: false
                })
            }
        }

        if (updatedSchedule && updatedSchedule.schedule && updatedSchedule != self.props.updatedSchedule) {
            self.setState({
                isSaving: false,
                isSaveDisplay: true
            })

            toast.success('Schedule updated successfully!')
            window.location = '/dashboard/schedule'

        } else {
            if (updatedSchedule.error && !updatedSchedule.loading && updatedSchedule != self.props.updatedSchedule) {
                toast.error('There is an error when updating schedule, please try again later!')

                self.setState({
                    isSaving: false
                })
            }
        }
    }

    handleAddEvent = event => {
        const self = this
        const {calendar, events} = self.state
        const calendarEvents = []
        const numDays = event.isRepeat ? new Array(clientUtils.get_date_diff(event.endDate, event.startDate) + 1).fill(0) : []
        const isCompositionExist = events.find(c => c.composition_id == event.composition_id)
        const uiEvents = calendar.getEvents()
        self.setState({
            events: [
                ...events,
                isCompositionExist ? {
                    ...event,
                    eventColor: isCompositionExist.color
                } : event
            ]
        })

        uiEvents.forEach(e => {
            if (e.id == event.event_id) e.remove()
        })

        if (numDays.length > 1) {
            numDays.forEach((d, dIndex) => {
                let newStart, newEnd, tempEndDate, dayIndex

                if (event.start < event.end) {
                    newStart = clientUtils.add_date(event.start, dIndex)
                    tempEndDate = clientUtils.add_date(event.end, dIndex)
                    newEnd = moment(newStart).hours(tempEndDate.hours()).minutes(tempEndDate.minutes()).seconds(tempEndDate.seconds())
                    dayIndex = clientUtils.get_day_of_week(newStart)

                } else {
                    newStart = clientUtils.add_date(event.start, dIndex)
                    if (dIndex + 1 >= numDays.length) {
                        tempEndDate = clientUtils.add_date(new Date(`${clientUtils.format_date_custom(event.startDate, 'YYYY-MM-DD')} 23:59:59`), dIndex)
                    } else {
                        tempEndDate = clientUtils.add_date(new Date(`${clientUtils.format_date_custom(event.startDate, 'YYYY-MM-DD')} ${clientUtils.format_date_custom(event.end, 'HH:mm:ss')}`), (dIndex + 1))
                    }

                    newEnd = moment(tempEndDate).hours(tempEndDate.hours()).minutes(tempEndDate.minutes()).seconds(tempEndDate.seconds())
                    dayIndex = clientUtils.get_day_of_week(newStart)
                }
                if (event.days[dayIndex]) {
                    calendarEvents.push({
                        ...event,
                        start: new Date(newStart),
                        end: new Date(newEnd),
                        eventColor: isCompositionExist ? isCompositionExist.color : event.color
                    })
                }
            })
            calendar.addEventSource(calendarEvents)
        } else if (numDays.length == 1) {
            const dayIndex = clientUtils.get_day_of_week(event.start)
            if (event.days[dayIndex]) {
                if (event.start < event.end) {
                    calendar.addEvent({
                        ...event,
                        eventColor: isCompositionExist ? isCompositionExist.color : event.color
                    })
                } else {
                    const newStart = `${clientUtils.format_date_custom(event.start, 'YYYY-MM-DD HH:mm:ss')}`
                    const newEnd = `${clientUtils.format_date_custom(event.end, 'YYYY-MM-DD')} 23:59:59`

                    calendar.addEvent({
                        ...event,
                        start: new Date(newStart),
                        end: new Date(newEnd),
                        eventColor: isCompositionExist ? isCompositionExist.color : event.color
                    })
                }
            }
        } else {
            if (event.start < event.end) {
                calendar.addEvent({
                    ...event,
                    eventColor: isCompositionExist ? isCompositionExist.color : event.color
                })
            } else {
                const newStart = `${clientUtils.format_date_custom(event.start, 'YYYY-MM-DD HH:mm:ss')}`
                const newEnd = `${clientUtils.format_date_custom(event.end, 'YYYY-MM-DD')} 23:59:59`

                calendar.addEvent({
                    ...event,
                    start: new Date(newStart),
                    end: new Date(newEnd),
                    eventColor: isCompositionExist ? isCompositionExist.color : event.color
                })
            }
        }
    }

    handleCreateSchedule = e => {
        e.preventDefault()
        const self = this
        const form = $(e.target)
        const user_id = clientUtils.get_user_id()
        const {scheduleName, events, isSavingAndAssignDisplay, isEditSchedule, scheduleId, selectedVersion, displays} = self.state
        const event = events[0]

        const endTime = `${clientUtils.format_date_custom(event.endDate, 'YYYY-MM-DD')} ${clientUtils.format_date_custom(event.end, 'HH:mm:ss')}`
        const currentTime = `${clientUtils.format_date_custom(new Date(), 'YYYY-MM-DD HH:mm:ss')}`

        if (endTime <= currentTime) {
            swal({
                text: "The end date is smaller than the current date",
                icon: "warning",
                dangerMode: true
            })
        } else {
            if (events.length > 0) {
                if (form.valid()) {
                    if (isSavingAndAssignDisplay) {
                        $('#assign-display-modal').modal('show')
                    } else {
                        swal({
                            className: 'ads__swal',
                            text: isEditSchedule ? "Are you want to update schedule?" : "Are you sure you want to just save the schedule?",
                            icon: "warning",
                            buttons: true,
                            dangerMode: true
                        }).then(ok => {
                            if (ok) {
                                let schedule = {
                                    name: scheduleName,
                                    version: 1,
                                    user_id,
                                    compositions: events.map(event => {
                                        return {
                                            composition_id: event.composition_id,
                                            start_date: `${clientUtils.format_date_custom(event.startDate, 'YYYY-MM-DD')} ${clientUtils.format_date_custom(event.start, 'HH:mm:ss')}`,
                                            end_date: `${clientUtils.format_date_custom(event.endDate, 'YYYY-MM-DD')} ${clientUtils.format_date_custom(event.end, 'HH:mm:ss')}`,
                                            prior_level: event.defaultPrior,
                                            order_level: event.defaultOrder,
                                            is_repeat: event.isRepeat,
                                            sunday: event.days[0],
                                            monday: event.days[1],
                                            tuesday: event.days[2],
                                            wednesday: event.days[3],
                                            thursday: event.days[4],
                                            friday: event.days[5],
                                            saturday: event.days[6],
                                        }
                                    })
                                }

                                self.setState({
                                    isSaving: true
                                })

                                if (isEditSchedule && scheduleId) {
                                    schedule.id = scheduleId
                                    schedule.version = selectedVersion
                                    schedule.displays = displays

                                    setTimeout(() => {
                                        self.props.updateSchedule(schedule)
                                    }, 100)
                                } else {
                                    setTimeout(() => {
                                        self.props.addSchedule(schedule)
                                    }, 100)
                                }
                            }
                        })
                    }
                }
            } else {
                swal({
                    text: "Please schedule your playing times!",
                    icon: "warning",
                    dangerMode: true,
                })
            }
        }

        return false
    }

    handleAssignDisplay = displays => {
        const self = this
        const user_id = clientUtils.get_user_id()
        const {scheduleName, events} = self.state
        const isScheduleExistInDisplays = displays.filter(d => d.schedule_id).length

        const schedule = {
            name: scheduleName,
            version: 1,
            user_id,
            compositions: events.map(event => {
                return {
                    composition_id: event.composition_id,
                    start_date: `${clientUtils.format_date_custom(event.startDate, 'YYYY-MM-DD')} ${clientUtils.format_date_custom(event.start, 'HH:mm:ss')}`,
                    end_date: `${clientUtils.format_date_custom(event.endDate, 'YYYY-MM-DD')} ${clientUtils.format_date_custom(event.end, 'HH:mm:ss')}`,
                    is_repeat: event.isRepeat,
                    sunday: event.days[0],
                    monday: event.days[1],
                    tuesday: event.days[2],
                    wednesday: event.days[3],
                    thursday: event.days[4],
                    friday: event.days[5],
                    saturday: event.days[6],
                }
            }),
            displays
        }

        swal({
            className: 'ads__swal',
            title: `Assign schedule '${scheduleName}' to total ${displays.length} ${displays.length > 1 ? 'displays' : 'display'}?`,
            text: isScheduleExistInDisplays ? `Note: There ${isScheduleExistInDisplays > 1 ? 'are' : 'is'} ${isScheduleExistInDisplays} ${isScheduleExistInDisplays > 1 ? 'screens' : 'screen'} already have some content scheduled which will be overridden.` : '',
            buttons: true,
            icon: "warning",
            dangerMode: true
        }).then(ok => {
            if (ok) {
                self.setState({
                    isSaveDisplay: true
                })

                setTimeout(() => {
                    self.props.addSchedule(schedule)
                }, 100)
            }
        })
    }

    handleDeleteEvent = event => {
        const self = this
        const {calendar} = self.state
        const allEvents = calendar.getEvents()

        allEvents.forEach(e => {
            if (e.id == event.event_id) e.remove()
        })

        self.setState({
            events: self.state.events.filter(e => e.id != event.id)
        })
    }

    render() {
        const {tempEvent, scheduleName, isSaving, isSaveDisplay, displays, scheduleLoading, isEditSchedule} = this.state

        return (
            <div className={`ads__scheduler_list ${scheduleLoading ? 'loading-text' : ''}`}>
                <AssignDisplay onDismissModal={() => {
                    this.setState({
                        isSaving: false,
                        isSaveDisplay: false
                    })
                }} onAssignDisplay={this.handleAssignDisplay}/>
                <AddComposition event={tempEvent} onCreateCompositionEvent={this.handleAddEvent}
                                onDeleteEvent={this.handleDeleteEvent}/>
                <div className="ads__scheduler_list-calendar-wrapper">
                    <div className="ads__scheduler_list-calendar" id="calendar"></div>
                </div>
                <div className="ads__scheduler_list-detail">
                    <form action="#" method="post" noValidate onSubmit={this.handleCreateSchedule}>
                        <div className="form-group">
                            <label htmlFor="scheduleName">Schedule Name</label>
                            <input className="form-control"
                                   type="text"
                                   value={scheduleName}
                                   onChange={e => this.setState({
                                       ...this.state,
                                       scheduleName: e.target.value
                                   })}
                                   data-rule-required="true"
                                   data-rule-minlength="3"
                                   data-msg-required="Please enter schedule name"
                                   placeholder="Enter the schedule name"/>
                        </div>
                        {displays && displays.length > 0 ? (
                            <div className="ads__scheduler_list-items">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {displays.map((d, dIndex) => {
                                        return (
                                            <tr key={dIndex}>
                                                <td>{dIndex + 1}</td>
                                                <td>{d.name}</td>
                                                <td>
                                                    <div
                                                        className={`network-status ${d.network_status ? 'on' : 'off'}`}></div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                                <div className="foot">
                                    <p>{displays.length} total</p>
                                </div>
                            </div>

                        ) : (
                            <div className="ads__scheduler_list-items no-schedule">
                                <img src="/dist/images/screen.svg" alt="Display"/>
                                <h3>No displays associated with this schedule</h3>
                            </div>
                        )}

                        <div className="ads__scheduler_list-btns">
                            <a className="d-none" id="add-schedule-link" href="#add-schedule-modal" data-toggle="modal">Add
                                Schedule Component</a>
                            <button
                                className={`btn btn-primary rounded ${isSaving && !isSaveDisplay ? 'loading' : ''}  ${isSaveDisplay || isSaving ? 'disabled' : ''}`}
                                id="save-schedule" type="submit" onClick={e => {
                                this.setState({
                                    isSavingAndAssignDisplay: false
                                })
                            }}>{isEditSchedule ? 'Update' : 'Save'}</button>
                            {!isEditSchedule && (
                                <button
                                    className={`btn btn-info rounded ${isSaving && !isSaveDisplay ? 'loading' : ''}  ${isSaveDisplay || isSaving ? 'disabled' : ''}`}
                                    type="submit" onClick={e => {
                                    this.setState({
                                        isSavingAndAssignDisplay: true
                                    })
                                }}>Save &amp; Assign Displays</button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default CreateSchedule

