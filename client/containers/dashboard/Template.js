import { connect } from 'react-redux'
import TemplateComponent from '../../components/dashboard/Template'
import templateActions from '../../actions/templateActions'

const mapStateToProps = state => ({
    addedTemplate: state.template ? state.template.add : null
})

const mapDispatchToProps = dispatch => ({
    addTemplate: (template) => {
        dispatch(templateActions.add(template))
    }
})

export const Template = connect(mapStateToProps, mapDispatchToProps)(TemplateComponent)