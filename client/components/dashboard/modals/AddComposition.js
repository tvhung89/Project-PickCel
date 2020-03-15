import React, {Component} from 'react'

import clientUtils from '../../../utils'
import {toast} from 'react-toastify'
import swal from 'sweetalert'

class AddComposition extends Component {
    constructor(props) {
        super(props)

        this.state = {
            compositions: null,
            filteredCompositions: null,
            compositionLoading: true,
            pagination: {
                size: 3,
                page: 0,
                total: 0,
                numPage: 0
            },
            compositionName: '',
            defaultOrder: 0,
            defaultPrior: 0,
            levels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            event: null,
            isRepeat: false,
            isRepeatForAllDays: false,
            days: [true, true, true, true, true, true, true],
            defaultDays: {
                allTrue: [true, true, true, true, true, true, true],
                allFalse: [false, false, false, false, false, false, false]
            },
            startDate: null,
            endDate: null,
            daysInWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
        }
    }

    componentDidMount() {
        const self = this
        const user_id = clientUtils.get_user_id()
        const selector = '#add-schedule-modal'

        if (window.jQuery) {
            $(selector).on('show.bs.modal', e => {
                if (user_id) {
                    self.props.getComposition(user_id)
                }
            })

            $(selector).on('hidden.bs.modal', e => {
                self.setState({
                    event: null,
                    isRepeat: false,
                    isRepeatForAllDays: false,
                    days: self.state.defaultDays.allTrue,
                    startDate: null,
                    endDate: null,
                    defaultOrder: 0,
                    defaultPrior: 0,
                    compositionName: '',
                    filteredCompositions: self.state.filteredCompositions.map((c, cIndex) => {
                        return {
                            ...c,
                            selected: cIndex == 0
                        }
                    })
                })

                self.handleSearchComposition(null)
            })
        }
    }

    initDatePickers() {
        const self = this
        const {startDate, endDate} = self.state

        if ($.fn.datepicker) {
            setTimeout(() => {
                $('#startDate').datepicker({
                    autoclose: true,
                    maxViewMode: 0,
                    container: '#add-schedule-modal'
                })
                    .datepicker("setDate", startDate)
                    .on('changeDate', e => {
                        const start = e.date

                        self.setState({
                            startDate: new Date(start)
                        })

                        $('#endDate').focus().data('datepicker').setStartDate(start).setDate(start)
                    })

                $('#endDate').datepicker({
                    autoclose: true,
                    startDate,
                    maxViewMode: 0,
                    container: '#add-schedule-modal'
                })
                    .datepicker("setDate", endDate)
                    .on('changeDate', e => {
                        const end = e.date

                        self.setState({
                            endDate: new Date(end)
                        })
                    })
            }, 100)
        }
    }

    componentWillReceiveProps(props) {
        const self = this
        const {event, fetchedComposition} = props

        if (event && event != self.props.event) {
            self.setState({
                event
            })
            self.setState({
                startDate: event.start,
                endDate: event.end
            })

            if (event.composition_id) {
                self.setState({
                    isRepeat: event.isRepeat,
                    isRepeatForAllDays: !event.days.filter(d => !d).length,
                    days: event.days,
                    defaultOrder: event.order_level,
                    defaultPrior: event.prior_level,
                    startDate: new Date(event.startDate),
                    endDate: new Date(event.endDate)
                })

                setTimeout(() => {
                    self.initDatePickers()
                }, 100)
            }
        }

        if (fetchedComposition && fetchedComposition.composition && fetchedComposition !== self.props.fetchedComposition) {
            const cFetched = fetchedComposition.composition.sort((a, b) => clientUtils.compare_date(b.modified_at, a.modified_at))
            self.setState({
                compositions: cFetched,
                filteredCompositions: cFetched.map((c, cIndex) => {
                    return {
                        ...c,
                        selected: event && event.composition_id ? event.composition_id == c.id : cIndex == 0
                    }
                }).sort((a, b) => a.selected ? -1 : 1),
                compositionLoading: fetchedComposition.loading,
                pagination: {
                    ...self.state.pagination,
                    total: cFetched.length,
                    numPage: new Array(Math.ceil(cFetched.length / self.state.pagination.size)).fill(0)
                }
            })
        } else {
            if (fetchedComposition && fetchedComposition.error && fetchedComposition !== self.props.fetchedComposition) {
                toast.error('There is something wrong when trying to fetch compositions!', {
                    onClose: () => {
                        window.location = '/dashboard/schedule/create'
                    }
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

    handleSearchComposition = e => {
        if (e) e.preventDefault()
        const self = this
        const value = e ? e.target.value : ''
        const {compositions} = self.state

        self.setState({
            compositionName: value
        })

        if (value) {
            const newCompositions = compositions.filter(c => {
                const cName = c.name.toLowerCase()
                const val = value.toLowerCase()

                return cName.indexOf(val) > -1
            })

            self.setState({
                filteredCompositions: newCompositions.map((c, cIndex) => {
                    return {
                        ...c,
                        selected: cIndex == 0
                    }
                }),
                pagination: {
                    ...self.state.pagination,
                    total: newCompositions.length,
                    numPage: new Array(Math.ceil(newCompositions.length / self.state.pagination.size)).fill(0)
                }
            })
        } else {
            self.setState({
                filteredCompositions: compositions,
                pagination: {
                    ...self.state.pagination,
                    total: compositions.length,
                    numPage: new Array(Math.ceil(compositions.length / self.state.pagination.size)).fill(0)
                }
            })
        }

        return false
    }

    handleAddComposition = e => {
        e.preventDefault()
        const self = this
        const {defaultOrder, defaultPrior, event, filteredCompositions, isRepeat, startDate, endDate, days} = self.state
        const selectedComp = filteredCompositions && filteredCompositions.length > 0 ? filteredCompositions.find(c => c.selected) : null

        const currentEvent = {...event}

        const endTime = `${clientUtils.format_date_custom(endDate, 'YYYY-MM-DD')} ${clientUtils.format_date_custom(event.end, 'HH:mm:ss')}`
        const currentTime = `${clientUtils.format_date_custom(new Date(), 'YYYY-MM-DD HH:mm:ss')}`

        if (endTime <= currentTime) {
            swal({
                text: "The end date is smaller than the current date",
                icon: "warning",
                dangerMode: true
            })
        } else {
            if (event.composition_id) {
                self.handleDeleteEvent(currentEvent)
            }

            if (selectedComp) {
                setTimeout(() => {
                    self.props.onCreateCompositionEvent({
                        ...currentEvent,
                        composition_id: selectedComp.id,
                        title: selectedComp.name,
                        defaultOrder,
                        defaultPrior,
                        isRepeat,
                        startDate,
                        endDate,
                        days,
                        color: clientUtils.get_random_color()
                    })
                }, 100)
            } else {
                swal({
                    text: "Please select composition!",
                    icon: "warning",
                    dangerMode: true
                })
            }
        }

        return false
    }

    handleSelectComposition = (e, composition) => {
        const self = this
        const {filteredCompositions} = self.state

        self.setState({
            filteredCompositions: filteredCompositions.map(c => {
                return {
                    ...c,
                    selected: c.id == composition.id
                }
            })
        })
    }

    handleDeleteEvent = e => {
        const self = this
        const {event} = self.state

        if (event.composition_id) {
            self.props.onDeleteEvent(event)
        }
    }

    render() {
        const {filteredCompositions, compositionLoading, pagination, compositionName, defaultOrder, defaultPrior, levels, event, isRepeat, isRepeatForAllDays, days, defaultDays, daysInWeek} = this.state
        let isRepeatTrans = (isRepeat && (isRepeat === 1 || isRepeat === true)) ? true : false
        const displayCompositions = filteredCompositions && filteredCompositions.length > 0 ? filteredCompositions.slice(pagination.page * pagination.size, (pagination.page + 1) * pagination.size) : []

        return (
            <div className="modal fade ads__display-add ads__add-schedule show" id="add-schedule-modal">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Select Composition</h3>
                            <a href="#" data-dismiss="modal">
                                <i className="icon-close"></i>
                            </a>
                        </div>
                        <div className="modal-body left">
                            <div className="ads__add-schedule-grid">
                                <div className="ads__add-schedule-left">
                                    <div className="ads__add-schedule-top">
                                        <div className="ads__search-box">
                                            <input type="text" value={compositionName}
                                                   onChange={this.handleSearchComposition} placeholder="Search..."/><i
                                            className="icon-search"></i>
                                        </div>
                                    </div>
                                    <div
                                        className={`ads__add-schedule-list ${compositionLoading ? 'loading-text' : ''}`}>
                                        {displayCompositions && displayCompositions.length > 0 ? displayCompositions.map((c, cIndex) => {
                                            return (
                                                <div className="ads__add-schedule-item" key={cIndex}
                                                     onClick={e => this.handleSelectComposition(e, c)}>
                                                    <input type="radio" name="compositon" id={c.id} checked={c.selected}
                                                           readOnly/>
                                                    <label htmlFor={c.id}>
                                                        <div className="thumb">
                                                            <iframe src={`/preview/${c.id}/thumbnail`}></iframe>
                                                        </div>
                                                        <div className="content">
                                                            <h3>{c.name}</h3>
                                                            <p>{c.orientation ? 'Horizontal' : 'Vertical'}</p>
                                                        </div>
                                                        <div className="info">
                                                            <p>{clientUtils.format_date(c.modified_at)}</p>
                                                            <p>{`${c.template_width}${c.template_width <= 16 || c.template_height <= 16 ? ':' : '*'}${c.template_height}`}</p>
                                                        </div>
                                                        <div className="checkbox">
                                                            <div className="selected">
                                                                <i className="icon-check"></i>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            )
                                        }) : (
                                            <div className="no-result">
                                                <img src="/dist/images/composition.svg"/>
                                                <p>No component found, please create composition first.</p>
                                                <a href="/dashboard/composition/create"
                                                   className="btn btn-primary rounded">
                                                    <i className="icon-plus"></i>
                                                    <span>Create Composition</span>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                    <div className="foot">
                                        {filteredCompositions && filteredCompositions.length > 0 ? (
                                            <p>{filteredCompositions.length} {filteredCompositions.length > 1 ? 'compositions' : 'composition'}</p>
                                        ) : (
                                            <p>0 composition</p>
                                        )}

                                        {pagination && pagination.numPage.length > 1 && (
                                            <ul className="pagination">
                                                <li className={`page-item ${pagination.page == 0 ? 'disabled' : ''}`}><a
                                                    className="page-link" href="#"
                                                    onClick={e => this.handlePaginationChange(e, 0)}><i
                                                    className="icon-angle-double-left"></i></a></li>
                                                <li className={`page-item ${pagination.page == 0 ? 'disabled' : ''}`}><a
                                                    className="page-link" href="#"
                                                    onClick={e => this.handlePaginationChange(e, pagination.page - 1)}><i
                                                    className="icon-angle-left"></i></a></li>
                                                {pagination.numPage.length > 0 && pagination.numPage.map((n, index) => {
                                                    const activePageClasses = `page-item ${pagination.page === index ? 'active' : ''}`
                                                    return (
                                                        <li className={activePageClasses} key={index}><a
                                                            className="page-link" href="#"
                                                            onClick={e => this.handlePaginationChange(e, index)}>{index + 1}</a>
                                                        </li>
                                                    )
                                                })}
                                                <li className={`page-item ${pagination.page == pagination.numPage.length - 1 ? 'disabled' : ''}`}>
                                                    <a className="page-link" href="#"
                                                       onClick={e => this.handlePaginationChange(e, pagination.page + 1)}><i
                                                        className="icon-angle-right"></i></a></li>
                                                <li className={`page-item ${pagination.page == pagination.numPage.length - 1 ? 'disabled' : ''}`}>
                                                    <a className="page-link" href="#"
                                                       onClick={e => this.handlePaginationChange(e, pagination.numPage.length - 1)}><i
                                                        className="icon-angle-double-right"></i></a></li>
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                {event && (
                                    <div className="ads__add-schedule-right">
                                        <h2>Schedule Time</h2>
                                        <div className="ads__add-schedule-time">
                                            <div className="form-group row">
                                                <div className="time-input col-6">
                                                    <label htmlFor="start">Start</label>
                                                    <input className="form-control" id="start" type="time"
                                                           value={clientUtils.format_date_custom(event.start, 'HH:mm')}
                                                           onChange={e => {
                                                               this.setState({
                                                                   event: {
                                                                       ...this.state.event,
                                                                       start: clientUtils.get_date_time(event.start, e.target.value),
                                                                   }
                                                               })
                                                           }} required/>
                                                </div>
                                                <div className="time-input col-6">
                                                    <label htmlFor="end">End</label>
                                                    <input className="form-control" id="end" type="time"
                                                           value={clientUtils.format_date_custom(event.end, 'HH:mm')}
                                                           onChange={e => {
                                                               this.setState({
                                                                   event: {
                                                                       ...event,
                                                                       end: clientUtils.get_date_time(event.end, e.target.value),
                                                                   }
                                                               })
                                                           }} required/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div className="level-input col-6">
                                                    <label htmlFor="scheduleOrder">Order level</label>
                                                    <select className="form-control" value={defaultOrder}
                                                            onChange={e => this.setState({
                                                                defaultOrder: e.target.value
                                                            })}>
                                                        {levels && levels.length > 0 && levels.map((r, index) => {
                                                            return (
                                                                <option defaultValue={r} key={index}>{r}</option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="level-input col-6">
                                                    <label htmlFor="schedulePrior">Priority level</label>
                                                    <select className="form-control" value={defaultPrior}
                                                            onChange={e =>
                                                                this.setState({
                                                                    defaultPrior: e.target.value
                                                                })}>
                                                        {levels && levels.length > 0 && levels.map((r, index) => {
                                                            return (
                                                                <option defaultValue={r} key={index}>{r}</option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="ads__add-schedule-repeater">
                                                <div className="checkbox">
                                                    <input className="form-control" id="repeat" type="checkbox"
                                                           checked={isRepeat} onChange={e => {
                                                        const val = e.target.checked
                                                        if (e.target.checked) this.initDatePickers()

                                                        this.setState({
                                                            isRepeat: val,
                                                            isRepeatForAllDays: val,
                                                            days: val ? defaultDays.allTrue : defaultDays.allFalse
                                                        })
                                                    }}/>
                                                    <label htmlFor="repeat">Repeat?</label>
                                                </div>
                                                {isRepeatTrans && (
                                                    <div className="ads__add-schedule-frame">
                                                        <div className="form-group row">
                                                            <div className="date-input col-6">
                                                                <input className="form-control date-picker"
                                                                       id="startDate" type="text" name="startDate"
                                                                       readOnly/>
                                                                <i className="icon-calendar"></i>
                                                            </div>
                                                            <div className="date-input col-6">
                                                                <input className="form-control date-picker" id="endDate"
                                                                       type="text" name="endDate" readOnly/>
                                                                <i className="icon-calendar"></i>
                                                            </div>
                                                        </div>
                                                        <div className="checkbox">
                                                            <input className="form-control" id="alldays" type="checkbox"
                                                                   checked={isRepeatForAllDays} onChange={e => {
                                                                const val = e.target.checked

                                                                this.setState({
                                                                    isRepeatForAllDays: val,
                                                                    days: val ? defaultDays.allTrue : defaultDays.allFalse
                                                                })
                                                            }}/>
                                                            <label htmlFor="alldays">Repeat for all days?</label>
                                                        </div>
                                                        <div className="days">
                                                            {daysInWeek.map((d, dIndex) => {
                                                                return (
                                                                    <React.Fragment key={dIndex}>
                                                                        <input type="checkbox" name="repeat[]" id={d}
                                                                               checked={days[dIndex]} onChange={e => {
                                                                            this.setState({
                                                                                days: this.state.days.map((d, dIdx) => {
                                                                                    return dIdx == dIndex ? e.target.checked : d
                                                                                })
                                                                            })

                                                                            setTimeout(() => {
                                                                                this.setState({
                                                                                    isRepeatForAllDays: !this.state.days.filter(d => !d).length
                                                                                })
                                                                            }, 100)
                                                                        }}/>
                                                                        <label htmlFor={d}>{d}</label>
                                                                    </React.Fragment>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="ads__add-schedule-btns">
                                <button
                                    className={`btn btn-primary rounded ${displayCompositions.length == 0 ? 'disabled' : ''}`}
                                    type="button" data-dismiss="modal"
                                    onClick={this.handleDeleteEvent}>{event && event.composition_id ? 'Delete' : 'Cancel'}</button>
                                <button
                                    className={`btn btn-success rounded ${displayCompositions.length == 0 ? 'disabled' : ''}`}
                                    type="button" data-dismiss="modal" onClick={this.handleAddComposition}>Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddComposition

