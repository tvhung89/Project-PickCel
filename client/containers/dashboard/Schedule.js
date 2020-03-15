import { connect } from 'react-redux'
import ScheduleComponent from '../../components/dashboard/Schedule'
import scheduleActions from '../../actions/scheduleActions'
import displayActions from '../../actions/displayActions'

const mapStateToProps = state => ({
    fetchedSchedule: state.schedule ? state.schedule.get : null,
    deletedSchedule: state.schedule ? state.schedule.delete : null,
    updatedDisplay: state.display ? state.display.update : null
})

const mapDispatchToProps = dispatch => ({
    getSchedule: (user_id) => {
        dispatch(scheduleActions.get(user_id))
    },
    deleteSchedule: (id) => {
        dispatch(scheduleActions.remove(id))
    },
    updateDisplay: (display) => {
        dispatch(displayActions.update(display))
    }
})

export const Schedule = connect(mapStateToProps, mapDispatchToProps)(ScheduleComponent)