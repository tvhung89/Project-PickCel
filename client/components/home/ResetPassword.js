import React, {Component} from 'react'
import { toast } from 'react-toastify'
import { Redirect } from 'react-router-dom'

class ResetPassword extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: null,
            token: null,
            password: '',
            isSubmit: false,
            isRedirectToLogin: false
        }   
    }

    componentDidMount() {
        const self = this
        const {id, token} = self.props.match.params

        if (id && token) {
            self.setState({
                ...self.state,
                id,
                token
            })
        }

    }

    componentWillReceiveProps(props) {
        const self = this
        const {resetPasswordUser} = props
        const {isSubmit} = self.state

        if (isSubmit) {

            if (resetPasswordUser && resetPasswordUser.user) {
                toast.success('New password has been updated successfully!', {
                    onClose: () => {
                        self.setState({
                            ...self.state,
                            isSubmit: false,
                            isRedirectToLogin: true
                        })
                    }
                })
                
            } else {
                toast.error(resetPasswordUser.error);

                setTimeout(() => {
                    self.setState({
                        ...self.state,
                        isSubmit: false
                    })
                }, 2000)
            }
        }
    }

    handleResetPassword = e => {
        e.preventDefault()
        const self = this
        const form = $(e.target)
        const {id, password, token} = self.state

        if (form.valid()) {
            self.setState({
                ...self.state,
                isSubmit: true
            })

            self.props.resetPassword({
                id,
                password
            },
            token)
        }

        return false
    }

    render() {
        const {password, isSubmit, isRedirectToLogin} = this.state
        const btnClasses = `btn btn-primary d-block w-100 ${isSubmit ? 'loading disabled' : ''}`

        if (isRedirectToLogin) return (<Redirect to="/" />)

        return(
            <div className="ads__home-form">
                <div className="ads__home-logo"><img src="/dist/images/logo.png" alt="Logo"/></div>
                <div className="ads__home-form-auth">
                    <h2>Reset Password</h2>
                    <div className="card">
                        <form action="#" method="post" noValidate onSubmit={this.handleResetPassword}>
                            <p>Enter your new password</p>
                            <div className="form-group">
                                <input 
                                    className="form-control" 
                                    type="password" 
                                    name="password" 
                                    placeholder="New Password (Please enter minimum 6 characters)"
                                    value={password}
                                    onChange={e => this.setState({
                                        ...this.state,
                                        password: e.target.value
                                    })}
                                    data-rule-required="true" 
                                    data-rule-minlength="6"
                                    data-msg-required="Password is required"/>
                            </div>
                            <div className="form-group">
                                <button className={btnClasses} type="submit">Reset</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default ResetPassword

