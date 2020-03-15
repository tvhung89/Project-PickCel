import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import * as types from '../../../actions/actionTypes'
import clientUtils from '../../../utils'
import config from '../../../../config/config'

class Header extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isLogOut: false,
            user: null
        }
    }

    componentDidMount() {
        const self = this
        const userLoggedIn = localStorage.getItem(types.USER_LOGGED_IN)

        if (userLoggedIn) {
            self.setState({
                user: JSON.parse(userLoggedIn)
            })
        } else {
            const xSiteKey = clientUtils.get_cookie(config.x_site_token_key)
            const accessToken = clientUtils.get_cookie(config.access_token_key)

            if (xSiteKey && accessToken) {
                self.props.getUser({
                    email: xSiteKey
                })
            }
        }

        // if (window.gapi) window.gapi.load('auth2')
    }

    componentWillReceiveProps(props) {
        const self = this
        const {fetchedUser} = props

        if (fetchedUser && fetchedUser.user && !fetchedUser.loading) {
            self.setState({
                ...self.state,
                user: fetchedUser.user
            })

            localStorage.setItem(types.USER_LOGGED_IN, JSON.stringify(fetchedUser.user))
        } else {
            if (fetchedUser && fetchedUser.error && !fetchedUser.loading) {
                clientUtils.remove_cookie(config.access_token_key)
                clientUtils.remove_cookie(config.x_site_token_key)

                window.location.reload()
            }
        }
    }

    handleLogOut = e => {
        e.preventDefault()
        const self = this
        // const auth2 = gapi.auth2.getAuthInstance()
        const isGoogleLoggedIn = localStorage.getItem(types.GOOGLE_LOGGED_IN)
        // localStorage.removeItem(types.USER_LOGGED_IN)
        clientUtils.remove_cookie(config.access_token_key)
        clientUtils.remove_cookie(config.x_site_token_key)

        // if (auth2 && isGoogleLoggedIn) {
        //     auth2.signOut().then(() => {
        //         localStorage.removeItem(types.GOOGLE_LOGGED_IN)
        //
        //         self.setState({
        //             isLogOut: true
        //         })
        //     })
        // } else {
        self.setState({
            isLogOut: true
        })
        // }

    }


    render() {
        const {isLogOut, user} = this.state

        if (isLogOut) return (<Redirect to="/"/>)

        return (
            <div className="ads__head">
                <div className="ads__logo">
                    <a href="/">
                        <img src="/dist/images/logo.png" alt="Pickcel Logo"/>
                    </a>
                </div>
                {user && (
                    <div className="ads__user">
                        <div className="dropdown">
                            <a className="btn btn-default dropdown-toggle" type="button"
                               data-toggle="dropdown">{user.email}</a>
                            <div className="dropdown-menu dropdown-menu-right">
                                <a className="dropdown-item" href="#" data-toggle="modal"
                                   data-target="#change-password">
                                    <i className="icon-unlock"></i>
                                    <span>Change password</span>
                                </a>
                                <a className="dropdown-item" href="#" onClick={this.handleLogOut}>
                                    <i className="icon-logout"></i>
                                    <span>Logout</span>
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default Header