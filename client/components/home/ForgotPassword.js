import React, {Component} from 'react'
import { toast } from 'react-toastify'
import {Link, Redirect} from 'react-router-dom'

class ForgotPassword extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            isSubmit: false,
            isRedirectToLogin: false
        }   
    }

    componentWillReceiveProps(props) {
        const self = this
        const {forgotPasswordUser} = props
        const {isSubmit} = self.state

        if (isSubmit) {

            if (forgotPasswordUser && forgotPasswordUser.user) {
                toast.success('Email with reset password link sent successfully!', {
                    onClose: () => {
                        self.setState({
                            ...self.state,
                            isSubmit: false,
                            isRedirectToLogin: true
                        })
                    }
                })
                
            } else {
                toast.error(forgotPasswordUser.error);

                setTimeout(() => {
                    self.setState({
                        ...self.state,
                        isSubmit: false
                    })
                }, 2000)
            }
        }
    }

    handleSendMail = e => {
        e.preventDefault()
        const self = this
        const form = $(e.target)
        const {email} = self.state

        if (form.valid()) {
            self.setState({
                ...self.state,
                isSubmit: true
            })

            self.props.sendResetPasswordEmail({
                email
            })
        }

        return false
    }

    render() {
        const {email, isSubmit, isRedirectToLogin} = this.state
        const btnClasses = `btn btn-primary d-block w-100 ${isSubmit ? 'loading disabled' : ''}`

        if (isRedirectToLogin) return (<Redirect to="/" />)

        return(
            <div className="ads__home-form">
                <div className="ads__home-logo"><img src="/dist/images/logo.png" alt="Logo"/></div>
                <div className="ads__home-form-auth">
                    <h2>Forget Password</h2>
                    <div className="card">
                        <form action="#" method="post" noValidate onSubmit={this.handleSendMail}>
                            <p>Enter your email and we will send you a password reset link.</p>
                            <div className="form-group">
                                <input 
                                    className="form-control" 
                                    type="text" 
                                    name="email" 
                                    value={email}
                                    onChange={e => this.setState({
                                        ...this.state,
                                        email: e.target.value
                                    })}
                                    placeholder="Email" 
                                    data-rule-required="true" 
                                    data-rule-email="true"
                                    data-rule-minlength="6" 
                                    data-msg-required="Email is required" />
                            </div>
                            <div className="form-group">
                                <button className={btnClasses} type="submit">Send Request</button>
                            </div>
                            <div className="form-group">
                                <p className="text-center">
                                    <Link to="/">Go back to login page</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default ForgotPassword

