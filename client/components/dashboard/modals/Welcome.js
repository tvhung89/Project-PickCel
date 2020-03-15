import React, {Component} from 'react'
import { toast } from 'react-toastify'
import * as types from '../../../actions/actionTypes'
import countries from '../../../../config/countryData'

class Welcome extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: null,
            isSubmit: false,
            companyName: '',
            countryCode: '',
            phoneNumber: ''
        }   
    }

    componentDidMount() {
        const self = this
        const userLoggedIn = localStorage.getItem(types.USER_LOGGED_IN)

        if (userLoggedIn) {
            const jsonUser = JSON.parse(userLoggedIn)
            self.setState({
                user: jsonUser
            })

            setTimeout(() => {
                if (!jsonUser.company_name) {
                    $('#welcome-modal').modal('show').on('hidden.bs.modal', () => {
                        $('#guide-modal').modal('show')
                    })
                }
            }, 200)
        }
    }

    componentWillReceiveProps(props) {
        const self = this
        const {updatedUser} = props
        const {isSubmit} = self.state

        if (isSubmit) {
            if (updatedUser && updatedUser.user) {
                self.setState({
                    ...self.state,
                    isSubmit: false
                })
                $('#welcome-modal').modal('hide')
                localStorage.setItem(types.USER_LOGGED_IN, JSON.stringify(updatedUser.user))
            } else {
                if (updatedUser && updatedUser.error && !updatedUser.loading) {
                    toast.error(updatedUser.error, {
                        onClose: () => {
                            self.setState({
                                ...self.state,
                                isSubmit: false
                            })
                        }
                    })
                }
            }
        }
    }

    handleUpdateUserInfo = e => {
        e.preventDefault()
        const self = this
        const form = $(e.target)
        const {user, companyName, countryCode, phoneNumber} = self.state

        if (form.valid()) {
            self.setState({
                ...self.state,
                isSubmit: true
            })

            setTimeout(() => {
                self.props.update({
                    id: user.id,
                    email: user.email,
                    company_name: companyName,
                    country_code: countryCode,
                    phone_number: phoneNumber
                })
            }, 100)
        }

        return false
    }

    render() {
        const {user, isSubmit, companyName, countryCode, phoneNumber} = this.state
        const btnClasses = `btn btn-primary rounded ${isSubmit ? 'loading disabled' : ''}`
        const modalClasses = `modal fade ads__welcome-modal show ${isSubmit ? 'disabled' : ''}`

        return(
            <div>
                {user && (
                    <div className={modalClasses} id="welcome-modal" data-backdrop="static" data-keyboard="false">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <h1>
                                        <span>Hi, </span>
                                        {user.name && (
                                            <span>{user.name}</span>
                                        )}
                                    </h1>
                                    <h4>You are just one more step away!</h4>
                                    <div className="ads__welcome-modal__form">
                                        <div className="ads__welcome-modal__left"><img src="/dist/images/rocket.svg"/></div>
                                        <div className="ads__welcome-modal__right">
                                        <form action="#" method="post" noValidate onSubmit={this.handleUpdateUserInfo}>
                                                <div className="form-group">
                                                    <input 
                                                        className="form-control" 
                                                        type="text"
                                                        name="companyName" 
                                                        value={companyName}
                                                        onChange={e => this.setState({
                                                            ...this.state,
                                                            companyName: e.target.value
                                                        })}
                                                        data-rule-required="true"
                                                        data-rule-minlength="2"
                                                        data-msg-required="Please enter your company name"
                                                        placeholder="Company Name *"/>
                                                </div>
                                                <div className="form-group">
                                                    <select 
                                                        className="form-control" 
                                                        value={countryCode}
                                                        onChange={e => this.setState({
                                                            ...this.state,
                                                            countryCode: e.target.value
                                                        })}
                                                        data-rule-required="true"
                                                        data-msg-required="Please select your country"
                                                        name="countryCode">
                                                        <option value="">Select country *</option>
                                                        {countries && countries.length > 0 && countries.map((c, index) => (
                                                            <option value={typeof c.phoneCode !== 'string' ? c.phoneCode.join(',') : c.phoneCode} key={index}>{c.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <input 
                                                        className="form-control" 
                                                        type="text" 
                                                        name="phoneNumber" 
                                                        value={phoneNumber}
                                                        onChange={e => this.setState({
                                                            ...this.state,
                                                            phoneNumber: e.target.value
                                                        })}
                                                        data-rule-required="true"
                                                        data-rule-minlength="8"
                                                        data-rule-maxlength="12"
                                                        data-rule-number="true"
                                                        data-msg-required="Please enter your phone number"
                                                        data-msg-number="Phone number can't contains letter or symbol"
                                                        placeholder="Phone"/>
                                                </div>
                                                <div className="form-group d-flex">
                                                    <button className={btnClasses} type="submit">Proceed</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default Welcome

