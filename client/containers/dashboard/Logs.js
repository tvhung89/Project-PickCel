import { connect } from 'react-redux'
import LogsComponent from '../../components/dashboard/Logs'
import logsActions from '../../actions/logsActions'
import displayActions from '../../actions/displayActions'
const mapStateToProps = state => ({
      logs: state.logs? state.logs: null,
      fetchedDisplay: state.display ? state.display.get : null,
})

const mapDispatchToProps = dispatch => ({ 

    getLogs : (condition)=>{
       dispatch(logsActions.getLogs(condition))
    },
    getDisplay: (user_id) => {
        dispatch(displayActions.get(user_id))
    },
})

export const Logs = connect(mapStateToProps, mapDispatchToProps)(LogsComponent)