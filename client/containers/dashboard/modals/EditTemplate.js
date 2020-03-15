import { connect } from 'react-redux'
import EditTemplateComponent from '../../../components/dashboard/modals/EditTemplate'
import templateActions from '../../../actions/templateActions'

const mapStateToProps = state => ({
    deletedTemplate: state.template ? state.template.delete : null
})

const mapDispatchToProps = dispatch => ({
    deleteTemplate: (id) => {
        dispatch(templateActions.remove(id))
    }
})

export const EditTemplate = connect(mapStateToProps, mapDispatchToProps)(EditTemplateComponent)