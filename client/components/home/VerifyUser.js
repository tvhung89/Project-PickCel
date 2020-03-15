import React, {Component} from 'react'
import { Redirect } from 'react-router-dom'

class VerifyUser extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isRedirectBackHomePage: false
        }   
    }

    componentDidMount() {
        const self = this
        const {id, token} = self.props.match.params

        if (id && token) {
            self.props.verify({
                user: {
                    id,
                    verify: true
                },
                token
            })
        }
    }

    componentWillReceiveProps(props) {
        const self = this
        const {verifiedUser} = props

        if (verifiedUser && verifiedUser.user) {
            self.setState({
                ...self.state,
                isRedirectBackHomePage: true
            })
        }
    }

    render() {
        const {isRedirectBackHomePage} = this.state
        if (isRedirectBackHomePage) return (<Redirect push to={"/"} />)

        return(
            <div className="ads__home-form">
                <div className="ads__home-logo">
                    <img src="/dist/images/logo.png" alt="Logo" />
                </div>
                <div className="ads__home-form-auth">
                    <h2>Verifying user...</h2>
                </div>
            </div>
        )
    }
}

export default VerifyUser

