import React, {Component} from 'react'
import clientUtils from '../../utils'
import * as types from '../../actions/actionTypes'
import UpdateLicense from '../dashboard/modals/UpdateLicense'
class License extends Component{

constructor(props){
    super(props)
    this.state = {
        user: null
    }
}

componentDidMount(){
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
            console.log(xSiteKey)
            self.props.getUser({
                email: xSiteKey
            })
        }
    }
}

componentWillReceiveProps(props){
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

render(){

    return(
        <div className="ads__template px-5">
            <div className="ads__template-left one">
           <UpdateLicense/>
           <div className="ads__template-header">
            <div className="font-weight-bold form-group"> Plan Status:  Default </div>
            <div className="font-weight-bold form-group"> License information: </div>
            </div>
            <div className="ads__template-body ads__display_list">

            <table className="table table-striped border">
                    <thead>
                        <tr className="text-center">
                        <th>Plan Name</th>
                        <th>Total number of devices activated</th>
                        </tr>
                    </thead>
                    <tbody>
                         <tr className="text-center">
                             <td>
                                 License Default
                             </td>
                             <td>
                                 2
                             </td>
                         </tr>
                    </tbody>
            </table>

            <table className="table table-striped border">
              <thead>
                  <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Invoice Date</th>
                      <th>Due Date</th>
                      <th>Devices activated</th>
                      <th>Status</th>
                      <th></th>
                  </tr>
              </thead>
              <tbody>
                  {this.state.user&&
                  <tr>
                     <td className="align-middle">{this.state.user.name}</td>
                     <td className="align-middle">{this.state.user.email}</td>
                     <td className="align-middle">{new Date().toLocaleDateString()}</td>
                     <td className="align-middle">{new Date().toLocaleDateString()}</td>
                     <td className="align-middle">2</td>
                     <td className="align-middle">Overdue</td>
                     <td className="align-middle"><button className="btn btn-primary rounded" data-toggle="modal" data-target="#updateLicense-modal">Update License</button></td>
                  </tr>}
              </tbody>
            </table>
            </div>
            <div className="ads__template-info">
             <div className="mt-5"><h4 className="font-weight-bold">Note:</h4></div> 
             <ul className="mt-4 ml-4 font-weight-bold">
             <li className="p-1">Total monthly charges will depend on number of displays on the billing date.</li>     
             <li className="p-1">Billing cycle will be as per the activation date (the day on which you have upgraded) and should be paid within 15 days of invoice generation</li>
             <li className="p-1">Non Payment of invoice will lead to de-activation of the account.</li>
             <li className="p-1">To re-activate the account and for any issues please contact us at <b className="font-weight-bold text-primary">contact@pickcel.com</b></li>
            </ul> 
            </div>
            </div>
        </div>
    )


}
}
export default License;