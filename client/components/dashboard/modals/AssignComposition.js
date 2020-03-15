import React, {Component} from 'react'

import clientUtils from '../../../utils'
import config from '../../../../config/config'
import { toast } from 'react-toastify'
import Preview from './Preview'
import swal from 'sweetalert'
class AssignComposition extends Component {
    constructor(props) {
        super(props)
        this.state = {
            get: {
                compositions: null
            },
            compositionLoading: true,
            filteredCompositions: [],
            pagination: {
                size: config.page_size,
                page: 0,
                total: 0,
                numPage: 0
            },
            selectedComposition: null,
            searchComposition: ''
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
                    self.props.getComposition(user_id)
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
        const {fetchedComposition,selectedDisplay} = props

        if (fetchedComposition && fetchedComposition.composition !== self.props.fetchedComposition.composition) {
            if (fetchedComposition.composition) {
                const cFetched = fetchedComposition.composition.sort((a, b) => clientUtils.compare_date(b.modified_at, a.modified_at))
                const selectedComp = selectedDisplay ? cFetched.find(c => c.id == selectedDisplay.default_schedule_id) : (cFetched && cFetched.length > 0 ? cFetched[0] : null)
                self.setState({
                    get: {
                        compositions: cFetched
                    },
                    filteredCompositions: cFetched,
                    pagination: {
                        ...self.state.pagination,
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
    }

    handleSearchComposition = e => {
        e.preventDefault()
        const self = this
        const value = e ? e.target.value : ''
        const {filteredCompositions,get} = self.state
        // self.setState({
        //     displayName: value
        // })

        if (value) {
            const ds = filteredCompositions.filter(d => {
                const name = d.name.toString().toLowerCase()
                const val = value.toString().toLowerCase()
                return name.indexOf(val) > -1
            })
            self.setState({
                filteredCompositions: ds,
                searchComposition: value
            })
        } else {
            self.setState({
                filteredCompositions: get.compositions,
                searchComposition:''
            })
        }
        return false
    }

    handleAssignComposition = e =>{
        swal({
            text: "This composition will be applied to all new devices registering in your organization",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then(ok => {
            if (ok) {
              this.props.updateDisplayDefaultComposition(this.props.selectedDisplay,e)
            }
        })
    }

    handleTempPreview = e => {
        const self = this
        self.setState({
            selectedComposition: e
        })
    }


    render() {
        const {compositionLoading,filteredCompositions,selectedComposition, searchComposition} = this.state
        return(
            <div className="modal fade ads__display-add ads__assign-display-modal show" id="assign-composition-modal" data-backdrop="static" data-keyboard="false">
                <Preview selectedAsset={selectedComposition} isIframe={true} />
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Select composition to default this display.</h3><a href="#" data-dismiss="modal"><i className="icon-close"></i></a>
                        </div>
                        <div className="modal-body left">
                        <div className="ads__top-bar">
                        <div className="ads__top-bar-left">
                        <div className="ads__search-box">
                                    <input type="text" placeholder="Search..." onChange={this.handleSearchComposition} value={searchComposition} /><i className="icon-search"></i>
                                </div>
                       </div>
                
                                </div>
                                <div className="ads__display_grid">
                            <div className="display-list" style={{width: "100%"}}>
                                <div className={`display-list-table scrollbar-outer ${compositionLoading ? 'loading' : ''}`}>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Content Name</th>
                                                <th>Aspect Ratio</th>
                                                <th>Creation Date</th>
                                                <th>Options</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCompositions && filteredCompositions.length > 0 && filteredCompositions.map(d => {
                                                return (
                                                    <tr key={d.id}>
                                                        <td>{d.name}</td>
                                                        <td>Horizontal</td>
                                                        <td>{clientUtils.format_date(d.created_at)}</td>
                                                        <td><a href="#"  data-target="#preview-modal" data-toggle="modal" onClick={()=>{this.handleTempPreview(d)}} className="icon-eye mr-1"></a><a href="#" onClick={()=>this.handleAssignComposition(d.id)}>Assign</a></td>
                                                    </tr>
                                                )
                                            })}
                                            {filteredCompositions && filteredCompositions.length == 0 && (
                                                <tr>
                                                    <td colSpan="5">No composition found!</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        </div>
                        <div className="modal-footer">
                            <p><small>Note: Compositions that have an existing display will be overridden.</small></p>
                            <button className={`btn btn-primary rounded `} type="button" data-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AssignComposition

