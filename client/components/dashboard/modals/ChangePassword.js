import React, {Component} from 'react'
import { toast } from 'react-toastify'
import * as types from '../../../actions/actionTypes'

class ChangePassword extends Component {
    constructor(props) {
        super(props)

        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            isSubmit: false
        }   
    }

    componentDidMount() {
        if (window.jQuery && $.validator) {
            $.validator.addMethod('compare', (value, element) => {
                const $this = $(element)
                const confirmPassword = $this.attr('data-compare')

                return !(value !== confirmPassword)
            }, "Passwords don't match")

            $.validator.addMethod('compareold', (value, element) => {
                const $this = $(element)
                const oldPassword = $this.attr('data-compare')

                return !(value === oldPassword)
            }, "New password can't be the same with old password")
        }
    }

    componentWillReceiveProps(props) {
        const self = this
        const {changePasswordUser} = props
        const {isSubmit} = self.state
        if (isSubmit) {
            if (changePasswordUser && changePasswordUser.user && !changePasswordUser.loading) {
                
                setTimeout(() => {
                    $('#change-password').modal('hide')
                }, 1000)

                toast.success('Your password has been changed successfully!', {
                    onClose: () => {
                        self.setState({
                            ...self.state,
                            isSubmit: false,
                            oldPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                        })
                    }
                })
            } else {
                if (changePasswordUser && changePasswordUser.error && !changePasswordUser.loading) {
                    toast.error(changePasswordUser.error, {
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

    handleChangePassword = e => {
        e.preventDefault()
        const self = this
        const form = $(e.target)
        const {oldPassword, newPassword} = self.state 
        const userLoggedIn = JSON.parse(localStorage.getItem(types.USER_LOGGED_IN))

        if (form.valid()) {
            self.setState({
                isSubmit: true
            })

            setTimeout(() => {
                self.props.changePassword({
                    email: userLoggedIn.email,
                    password: oldPassword,
                    newPassword
                })
            }, 100)
        }

        return false;
    }

    render() {
        const {oldPassword, newPassword, confirmPassword, isSubmit} = this.state
        const btnClasses = `btn btn-success rounded ${isSubmit ? 'loading disabled' : ''}`
        const modalClasses = `modal fade ads__change-password ads__display-add show ${isSubmit ? 'disabled' : ''}`
        
        return(
            <div>
                <div className={modalClasses} id="change-password" data-backdrop="static" data-keyboard="false">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">Change Password</h3><a href="#" data-dismiss="modal"><i className="icon-close"></i></a>
                            </div>
                            <div className="modal-body left">
                                <form action="#" method="post" noValidate onSubmit={this.handleChangePassword}>
                                    <div className="form-group">
                                        <label htmlFor="oldPassword">Old password:</label>
                                        <input 
                                            className="form-control" 
                                            name="oldPassword" 
                                            type="password" 
                                            value={oldPassword}
                                            onChange={e => this.setState({
                                                ...this.state,
                                                oldPassword: e.target.value
                                            })}
                                            placeholder="Please enter old password *"
                                            data-rule-required="true"
                                            data-rule-minlength="6" 
                                            data-msg-required="Please enter your old password"/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="newPassword">New password:</label>
                                        <input 
                                            className="form-control" 
                                            name="newPassword" 
                                            type="password" 
                                            value={newPassword}
                                            data-compare={oldPassword}
                                            onChange={e => this.setState({
                                                ...this.state,
                                                newPassword: e.target.value
                                            })}
                                            data-rule-compareold="true"
                                            data-rule-required="true"
                                            data-rule-minlength="6" 
                                            data-msg-required="Please enter your new password"
                                            placeholder="Please enter new password (minimum 6 characters) *"/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Confirm new password:</label>
                                        <input 
                                            className="form-control" 
                                            name="confirmPassword"  
                                            type="password" 
                                            value={confirmPassword}
                                            data-compare={newPassword}
                                            onChange={e => this.setState({
                                                ...this.state,
                                                confirmPassword: e.target.value
                                            })}
                                            data-rule-compare="true"
                                            placeholder="Please repeat the new password *"
                                            data-rule-required="true"
                                            data-rule-minlength="6" 
                                            data-msg-required="Please confirm your new password"/>
                                    </div>
                                    <button className={btnClasses} type="submit">Update</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChangePassword

