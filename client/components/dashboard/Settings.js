import React, {Component} from 'react'
import Tags from './Tags'
import config from '../../../config/config'
import clientUtils from '../../utils'
import { toast } from 'react-toastify'
import {AssignComposition} from '../../containers/dashboard/modals/AssignComposition'
class Setup extends Component{
    constructor(props){
        super(props)
        this.state = {
            display: {
                get: []
              },
              get: {
                compositions: null
            },
              fetchedComposition: null,
              fetchedDisplays: null,
              filteredDisplays: [],
              fetchedDisplaysLoading: 1,
              fetchedCompositionLoading: 1,
              pagination: {
                size: config.page_size,
                page: 0,
                total: 0,
                numPage: 0
            },
            paginationComposition: {
                size: config.page_size,
                page: 0,
                total: 0,
                numPage: 0
            },
            filter:[],
            selectedDisplay: [],
            searchDisplay: '',
            toggleFilter: false,
            displayTags: [],
            category: 10,
            selected: 0
        }
    }
    componentWillReceiveProps(props){
        const self = this
        const {fetchedTag,fetchedDisplay, displayTags,fetchedComposition,setting} = props
        const {filteredDisplays} = self.state
        if(setting && setting!=self.props.setting && !setting.loading){
            toast.success('Set default successfully!')
        }else if(setting && setting!=self.props.setting && !setting.loading && setting.error){
            toast.error('Set default failed!')
        }
        if (fetchedDisplay && fetchedDisplay.display && fetchedDisplay != self.props.fetchedDisplay) {
            const displays = fetchedDisplay.display
            if(displays){
                const displayFetched = fetchedDisplay.display.length > 0 ? fetchedDisplay.display.sort((a, b) => clientUtils.compare_date(b.modified_at, a.modified_at)) : [fetchedDisplay.display]
                self.setState({
                    display: {
                        get: displayFetched
                    },
                    fetchedDisplays: displays,
                    fetchedDisplaysLoading: fetchedDisplay.loading,
                    filteredDisplays: displays,
                    pagination: {
                        ...self.state.pagination,
                        total: displays.length,
                        numPage: new Array(Math.ceil(displays.length / self.state.pagination.size)).fill(0)
                    }
                })
            }
        } else {
            if (fetchedDisplay && fetchedDisplay.error && !fetchedDisplay.loading) {
                self.setState({
                    fetchedDisplaysLoading: fetchedDisplay.loading
                })
            }
        }
        
        if (fetchedComposition && fetchedComposition.composition !== self.props.fetchedComposition.composition) {
            if (fetchedComposition.composition) {
                const cFetched = fetchedComposition.composition.sort((a, b) => clientUtils.compare_date(b.modified_at, a.modified_at))
               // const selectedComp = selectedDisplay ? cFetched.find(c => c.id == selectedDisplay.default_schedule_id) : (cFetched && cFetched.length > 0 ? cFetched[0] : null)
               
                self.setState({
                    get: {
                        compositions: cFetched
                    },
                    paginationComposition: {
                        ...self.state.paginationComposition,
                        total: cFetched.length,
                        numPage: new Array(Math.ceil(cFetched.length / self.state.pagination.size)).fill(0)
                    },
                    compositionLoading: fetchedComposition.loading
                })

                // setTimeout(() => {
                //     self.handleSelectComposition(null, selectedComp)
                // }, 100)
            }

            if (fetchedComposition.error) {
                self.setState({
                    compositionLoading: fetchedComposition.loading
                })
            }
        }


        if (fetchedTag && fetchedTag.tag && !fetchedTag.loading) {
            const tags = fetchedTag.tag
            self.setState({
                tags,
                tagsLoading: fetchedTag.loading
            })
        } else {
            if (fetchedTag && fetchedTag.error && !fetchedTag.loading) {
                self.setState({
                    tags: null,
                    tagsLoading: fetchedTag.loading
                })
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
    }
    componentDidMount(){
        const self = this
        const user_id = clientUtils.get_user_id()
        if (user_id) {
            self.props.getDisplay(user_id)
            self.props.getComposition(user_id)
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

    handleAssignComposition = (composition) => {
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

    handleSelectDisplay = (display) => {
        const self = this
        self.setState({
            selectedDisplay: self.state.selectedDisplay.includes(display)? self.state.selectedDisplay.filter(e=>e!=display):[...self.state.selectedDisplay, display]
        })
    }

    handleToggleFilter = e => {
        e.preventDefault();
        const self = this;
        self.setState({
            toggleFilter: !self.state.toggleFilter
        })

        return false;
    }

    handleSearchDisplay = e => {
        e.preventDefault()
        const self = this
        const value = e.target.value
        if(self.state.filteredDisplays.length==0){
            this.handleFilter(self.state.filter)
        }
        if (value) {
                const displays = self.state.filteredDisplays.filter(d => {
                const name = d.name.toString().toLowerCase()
                const val = value.toString().toLowerCase()
                return name.indexOf(val) > -1
            })
            self.setState({
                ...self.state,
                filteredDisplays: displays,
                searchDisplay: value,
                pagination: {
                    ...self.state.pagination,
                    total: displays.length,
                    numPage: new Array(Math.ceil(displays.length / self.state.pagination.size)).fill(0),
                    page: 0
                }
            })
        } else {
            const displays = self.state.fetchedDisplays
            self.setState({
                ...self.state,
                filteredDisplays: displays,
                searchDisplay: value,
                pagination: {
                    ...self.state.pagination,
                    total: displays.length,
                    numPage: new Array(Math.ceil(displays.length / self.state.pagination.size)).fill(0),
                    page: 0
                }
            })
        }

        return false
    }

    handleFilter = conditions => {
        const self = this
        const {display, searchDisplay, category,selectedDisplay} = self.state
        const displays = display.get.filter(d => {
            const name = d.name.toString().toLowerCase()
            const val = searchDisplay.toString().toLowerCase()
            const isTruthy = name.indexOf(val) > -1 && (d.type == category || category == 10)
            if (conditions.length > 0) {
                return isTruthy && d.tags.find(t => conditions.find(c => c.key === t.key && c.value === t.value))
            }
            return isTruthy
        })
        let arr_id = []
        displays.forEach(e=>{
         arr_id.push(e.id)
        })
        let selectedDisplays = [];
        selectedDisplay.forEach(e=>{
           if(arr_id.includes(e)){
               selectedDisplays.push(e)
           }
        })
        self.setState({
            filteredDisplays: displays,
            filter: conditions,
            selectedDisplay: selectedDisplays,
            pagination: {
                ...self.state.pagination,
                total: displays.length,
                numPage: new Array(Math.ceil(displays.length / self.state.pagination.size)).fill(0),
                page: 0
            }
        })
    }

    render(){
        const {toggleFilter, displayTags, pagination, filteredDisplays,get, selectedDisplay, searchDisplay} = this.state
        return(
            <div className={`ads__display`}>
            <div className='ads__top-bar bg-warning'>
            <div className="ads__top-bar-left">
                <a>Default Composition :</a>
               <a>{get.compositions && get.compositions.length>0 && get.compositions[0].name}</a>
               <a href="#assign-composition-modal" data-toggle="modal" onClick={()=>{this.setState({
                    selectedDisplay: filteredDisplays.map(e=>e.id)
               })}}>
                                                    change
                                                </a>
               <a>Duration: {get.compositions &&  get.compositions.length>0 && get.compositions[0].duration}</a>
                </div>
            </div>
            <div className="ads__top-bar">
                <div className="ads__top-bar-left">
                    <a href="#" onClick={this.handleToggleFilter}>
                        <i className="icon-filter"></i>
                    </a>
                    <button className="ads__search-box">
                    <input type="text" placeholder="Search..." value={searchDisplay} onChange={(e)=>{this.handleSearchDisplay(e)}}/>
                    <i className="icon-search"></i>
                    </button>
                </div>
               {selectedDisplay.length>0 && <a href="#assign-composition-modal" data-toggle="modal" className="btn btn-primary rounded">
                                <span>Change</span>
                            </a>}
            </div>
            <div className="ads__display_grid">
                {toggleFilter && (<Tags assetTags={displayTags}
                                        onFilterClose={() => this.setState({toggleFilter: false})}
                                        onInit={e => this.props.getDisplayTags()}
                                        onFilter={this.handleFilter} />)}
    
                <div className="ads__display_list">
                        <table id="display_list">
                            <thead>
                                <tr>
                                    <th className="text-danger">
                                    <div className="checkbox no-text"> 
                                                        <input className="form-control" id="all-displays" type="checkbox" checked={!this.state.filteredDisplays.find(d => !d.selected) || filteredDisplays.length == selectedDisplay.length} onChange={e => {
                                                            this.setState({
                                                                filteredDisplays: this.state.filteredDisplays.map(display => {
                                                                    return {
                                                                        ...display,
                                                                        selected: e.target.checked
                                                                    }
                                                                }),
                                                                selectedDisplay: (this.state.selectedDisplay && this.state.selectedDisplay.length!=this.state.filteredDisplays.length)? this.state.filteredDisplays.map(display => display.id): [],
                                                                isDirty: true
                                                            })
                                                        }} />
                                                        <label htmlFor="all-displays"></label>
                                                        <span className='pl-1'>Select: {(selectedDisplay && selectedDisplay.length)? selectedDisplay.length : '0'} </span>
                                                    </div> </th>
                                    <th>Display Name</th>
                                    <th>Last Seen Online</th>
                                    <th>Network Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDisplays && filteredDisplays.length > 0 && filteredDisplays.slice(pagination.page * pagination.size, (pagination.page + 1) * pagination.size).map(d => {
                                    const networkStatusClasses = `network-status ${d.network_status ? 'on' : 'off'}`
                                    return (
                                        <tr key={d.id}>
                                            <td>  <div className="checkbox no-text">
                                                                <input className="form-control" id={d.id} type="checkbox" checked={d.selected || selectedDisplay.includes(d.id)} onChange={e => {
                                                                    this.handleSelectDisplay(d.id)
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
                                                            </div></td>
                                            <td>{d.name}</td>
                                            <td>{clientUtils.format_date(d.online_at)}</td>
                                            <td>
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
                        <div className="foot">
                            {filteredDisplays && filteredDisplays.length > 0 && (
                                <p>{filteredDisplays.length} {filteredDisplays.length > 1 ? 'displays' : 'display'}</p>
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
                                    <li className={`page-item ${pagination.page == pagination.numPage.length - 1 ? 'disabled' : ''}`}><a className="page-link" href="#"><i className="icon-angle-double-right"></i></a></li>
                                    <li className={`page-item ${pagination.page == pagination.numPage.length - 1 ? 'disabled' : ''}`}><a className="page-link" href="#"><i className="icon-angle-right"></i></a></li>
                                </ul>
                            )}
                        </div>
                </div>
            
            </div>
            <AssignComposition onDismissModal={e => {}} selectedDisplay={selectedDisplay} />
        </div>
        )
    }
}
export default Setup