import React, {Component} from 'react'
import { toast } from 'react-toastify'
import { Link, Redirect } from 'react-router-dom'

import * as types from '../../actions/actionTypes'
import clientUtils from '../../utils'
import config from '../../../config/config'

class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            isSubmit: false,
            isGoogleAccount: false,
            isRedirectToDashboard: false,
            isAccountRegistered: false,
            isRedirectBackHomePage: false,
            google: {
                name: null,
                email: null,
                password: config.googleUserPassword
            }
        }   
    }

    componentDidMount() {
        // if (window.gapi) window.gapi.load('client:auth2', () => {
        //     const auth2 = gapi.auth2.init({
        //       client_id: config.oauth.client_id,
        //       cookiepolicy: 'single_host_origin'
        //     })
        //
        //     auth2.attachClickHandler(document.getElementById('google-signin'), {}, this.onGoogleSignInSuccess, error => console.log(error))
        // })
    }

    componentWillReceiveProps(props) {
        const self = this
        const {loggedInUser, registeredUser} = props
        const {isSubmit, isGoogleAccount, google} = self.state

        if (isSubmit) {
            if (!localStorage.getItem(types.USER_LOGGED_IN) && loggedInUser && loggedInUser.user) {
                localStorage.setItem(types.USER_LOGGED_IN, JSON.stringify(loggedInUser.user))
                
                toast.success('Logged in successfully!', {
                    onClose: () => {
                        self.setState({
                            isSubmit: false,
                            isRedirectToDashboard: true
                        })
                    }
                })
                
            } else {
                if (loggedInUser && loggedInUser.error && !loggedInUser.loading) {
                    toast.error(loggedInUser.error, {
                        autoClose: 2000,
                        onClose: () => {
                            self.setState({
                                ...self.state,
                                isSubmit: false
                            })
                        }
                    });

                    // const auth2 = gapi.auth2.getAuthInstance()
                    // auth2.signOut()
                }
            }
        }

        if (isGoogleAccount) {
            if (registeredUser && registeredUser.user && !loggedInUser.user && !loggedInUser.loading) {
                toast.success('Account created successfully!', {
                    onClose: () => {
                        self.setState({
                            isSubmit: true,
                            isGoogleAccount: false
                        })

                        localStorage.setItem(types.GOOGLE_LOGGED_IN, true)

                        self.props.login({
                            email: google.email,
                            password: google.password
                        })
                    }
                })
            } else {
                // if (registeredUser && registeredUser.error) {
                //     toast.error(`${registeredUser.error} Can't create user!`, {
                //         autoClose: 3000
                //     })
                // }

                // setTimeout(() => {
                //     self.setState({
                //         ...self.state,
                //         isGoogleAccount: false,
                //         isSubmit: false
                //     })
                // }, 3000)

                if (registeredUser && registeredUser.error && !loggedInUser.user && !loggedInUser.loading) {
                    self.setState({
                        isSubmit: true,
                        isGoogleAccount: false
                    })

                    localStorage.setItem(types.GOOGLE_LOGGED_IN, true)

                    self.props.login({
                        email: google.email,
                        password: google.password
                    })
                }
            }
        }
    }

    validateLogin = e => {
        e.preventDefault()
        const self = this
        const form = $(e.target)
        const {email, password} = self.state
        
        if (form.valid()) {
            self.setState({
                ...self.state,
                isSubmit: true
            })
            self.props.login({
                email,
                password
            })
        }

        return false
    }

    onGoogleSignInSuccess = googleUser => {
        const self = this
        const profile = googleUser.getBasicProfile()
        const name = profile.getName()
        const email = profile.getEmail()
        const {google, isGoogleAccount} = self.state

        if (!isGoogleAccount && name && email) {
            self.setState({
                ...self.state,
                isGoogleAccount: true,
                google: {
                    ...google,
                    name,
                    email
                }
            })

            self.props.register({
                name,
                email,
                password: google.password
            })
        }
    }

    render() {
        const {email, password, isSubmit, isGoogleAccount, isRedirectToDashboard} = this.state
        const btnClasses = `btn btn-primary d-block w-100 ${isSubmit || isGoogleAccount ? 'loading disabled' : ''}`

        if (isRedirectToDashboard) return (<Redirect push to={"/dashboard"} />)

        return(
            <div className="ads__home-form">
                <div className="ads__home-logo">
                    <img src="/dist/images/logo.png" alt="Logo" />
                </div>
                <div className="ads__home-form-auth">
                    <h2>Sign In</h2>
                    <div className="card">
                        <form action="#" method="get" onSubmit={this.validateLogin}>
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
                                <input 
                                    className="form-control" 
                                    type="password" 
                                    name="password" 
                                    value={password}
                                    onChange={e => this.setState({
                                        ...this.state,
                                        password: e.target.value
                                    })}
                                    placeholder="Password" 
                                    data-rule-required="true" 
                                    data-rule-minlength="6"
                                    data-msg-required="Password is required" />
                            </div>
                            <div className="form-group forgot-password">
                                <Link to={"/forgot-password"}>Forgot Password</Link>
                            </div>
                            <div className="form-group">
                                <button 
                                    className={btnClasses} 
                                    type="submit">Login</button>
                                <a id="google-signin" className=" btn btn-secondary d-block btn-social-login" href="#">
                                    <img className="d-inline-block" src="/dist/images/icons/icon-google.svg" alt="Google" />
                                    <span>Continue with Google</span>
                                </a>
                            </div>
                            <div className="form-group">
                                <p className="text-center">
                                    <span>Not a member?</span>
                                    <Link to={"/register"}>Create new account</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home

