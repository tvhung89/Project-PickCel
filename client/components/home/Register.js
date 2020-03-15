import React, {Component} from 'react'
import { toast } from 'react-toastify'
import { Link, Redirect } from 'react-router-dom'

class Register extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
            email: '',
            password: '',
            isShowPassword: false,
            isSubmit: false,
            isRedirectToLogin: false
        }   
    }

    componentWillReceiveProps(props) {
        const self = this
        const {registeredUser} = props
        const {isSubmit} = self.state

        if (isSubmit) {
            if (registeredUser && registeredUser.user) {
                toast.success('Account created successfully!', {
                    onClose: () => {
                        self.setState({
                            ...self.state,
                            isSubmit: false,
                            isRedirectToLogin: true
                        })
                    }
                })
                
            } else {
                if (registeredUser && registeredUser.error && !registeredUser.loading) {
                    toast.error(registeredUser.error, {
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

    handleRegister = e => {
        e.preventDefault()
        const self = this
        const form = $(e.target)
        const {name, email, password} = self.state 

        if (form.valid()) {
            self.setState({
                ...self.state,
                isSubmit: true
            })

            setTimeout(() => {
                self.props.register({
                    name,
                    email,
                    password
                })
            }, 100)
        }

        return false;
    }

    render() {
        const {name, email, password, isShowPassword, isSubmit, isRedirectToLogin} = this.state
        const btnClasses = `btn btn-primary d-block w-100 ${isSubmit ? 'loading disabled' : ''}`

        if (isRedirectToLogin) return (<Redirect push to={"/"} />)

        return(
            <div className="ads__home-form">
                <div className="ads__home-logo"><img src="/dist/images/logo.png" alt="Logo"/></div>
                <div className="ads__home-form-auth">
                    <h2>Sign Up</h2>
                    <div className="card small-box">
                        <form action="#" method="post" noValidate onSubmit={this.handleRegister}>
                            <div className="form-group">
                                <input 
                                    className="form-control" 
                                    type="text" 
                                    name="name" 
                                    value={name}
                                    onChange={e => this.setState({
                                        ...this.state,
                                        name: e.target.value
                                    })}
                                    placeholder="Name *"
                                    data-rule-required="true"
                                    data-rule-minlength="6" 
                                    data-msg-required="Please enter name"/>
                            </div>
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
                                    placeholder="Email *"
                                    data-rule-required="true" 
                                    data-rule-email="true"
                                    data-rule-minlength="6" 
                                    data-msg-required="Email is required" />
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <input 
                                    className="form-control" 
                                    type={isShowPassword ? 'text' : 'password'} 
                                    name="password" 
                                    value={password}
                                    onChange={e => this.setState({
                                        ...this.state,
                                        password: e.target.value
                                    })}
                                    placeholder="Password *" 
                                    data-rule-required="true" 
                                    data-rule-minlength="6"
                                    data-msg-required="Password is required" />
                                    <div className="input-group-append" onClick={e => this.setState({
                                        ...this.state,
                                        isShowPassword: !this.state.isShowPassword
                                    })}>
                                        <span className="input-group-text">
                                            {isShowPassword ? (<i className="icon-eye-hide"></i>) : (<i className="icon-eye-show"></i>)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="form-check">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        name="terms" 
                                        id="terms" 
                                        data-rule-required="true" 
                                        data-msg-required="Please accept our terms and condition"/>
                                    <label className="form-check-label" htmlFor="terms">I Agree the terms and condition</label>
                                </div>
                            </div>
                            <div className="form-group">
                                <button className={btnClasses} type="submit">Sign up</button>
                            </div>
                            <div className="form-group">
                                <p className="text-center">
                                    <span>I have an account</span>
                                    <Link to="/">Sign In</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register

