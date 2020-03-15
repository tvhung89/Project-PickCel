import { connect } from 'react-redux'
import CreateScheduleComponent from '../../components/dashboard/CreateSchedule'
import scheduleActions from '../../actions/scheduleActions'
import displayActions from '../../actions/displayActions'

const mapStateToProps = state => ({
    fetchedSchedule: state.schedule ? state.schedule.get : null,
    addedSchedule: state.schedule ? state.schedule.add : null,
    updatedSchedule: state.schedule ? state.schedule.update : null,
    fetchedDisplay: state.display ? state.display.get : null
})

const mapDispatchToProps = dispatch => ({
    getSchedule: (user_id) => {
        dispatch(scheduleActions.get(user_id))
    },
    addSchedule: (schedule) => {
        dispatch(scheduleActions.add(schedule))
    },
    updateSchedule: (schedule) => {
        dispatch(scheduleActions.update(schedule))
    },
    getDisplay: (user_id) => {
        dispatch(displayActions.get(user_id))
    }
})

export const CreateSchedule = connect(mapStateToProps, mapDispatchToProps)(CreateScheduleComponent)