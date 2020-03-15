import React from 'react'
import { Route, Switch, Link, Redirect } from "react-router-dom"

import {Asset} from '../../containers/dashboard/Asset'
import {App} from '../../containers/dashboard/App'
import {Composition} from '../../containers/dashboard/Composition'
import {CreateComposition} from '../../containers/dashboard/CreateComposition'
import {Template} from '../../containers/dashboard/Template'
import {Schedule} from '../../containers/dashboard/Schedule'
import {CreateSchedule} from '../../containers/dashboard/CreateSchedule'
import {EditCompositionTemplate} from '../../containers/dashboard/EditCompositionTemplate'

import {Header} from '../../containers/dashboard/Header'
import {ChangePassword} from '../../containers/dashboard/modals/ChangePassword'
import {Display} from '../../containers/dashboard/Display'
import {License} from '../../containers/dashboard/License'
import {Settings} from '../../containers/dashboard/Settings'
import {Logs} from '../../containers/dashboard/Logs'

import {toast, ToastContainer} from 'react-toastify'

const HomeLayout = () => (
    <div>
        <ToastContainer position={toast.POSITION.TOP_CENTER} pauseOnHover={false} hideProgressBar={true} autoClose={2000} />
        <Header />
        <ChangePassword />
        <div className="ads__body">
            <div className="ads__left-bar">
                <ul>
                    <li>
                        <Link to={"/dashboard/display"}>
                            <i className="icon-monitor"></i>
                            <span>Display</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/dashboard/assets"}>
                            <i className="icon-image"></i>
                            <span>Assets</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/dashboard/composition"}>
                            <i className="icon-layout"></i>
                            <span>Composition</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/dashboard/template"}>
                            <i className="icon-layout"></i>
                            <span>Template</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/dashboard/schedule"}>
                            <i className="icon-calendar"></i>
                            <span>Schedule</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/dashboard/apps"}>
                            <i className="icon-grid"></i>
                            <span>Apps</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/dashboard/license"}>
                            <i className="icon-play"></i>
                            <span>My Plan</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/dashboard/logs"}>
                            <i className="icon-pause"></i>
                            <span>Logs</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/dashboard/settings"}>
                            <i className="icon-settings"></i>
                            <span>Settings</span>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="ads__right-content">
                <Switch>
                    <Route exact path="/dashboard" component={Display} />
                    <Route exact path="/dashboard/display" component={Display} />
                    <Route exact path="/dashboard/assets" component={Asset} />
                    <Route exact path="/dashboard/apps" component={App} />
                    <Route exact path="/dashboard/composition" component={Composition} />
                    <Route exact path="/dashboard/composition/create" component={CreateComposition} />
                    <Route exact path="/dashboard/composition/edit/:composition_id" component={CreateComposition} />
                    <Route exact path="/dashboard/composition/template/:composition_id" component={EditCompositionTemplate} />
                    <Route exact path="/dashboard/template" component={Template} />
                    <Route exact path="/dashboard/schedule" component={Schedule} />
                    <Route exact path="/dashboard/schedule/create" component={CreateSchedule} />
                    <Route exact path="/dashboard/schedule/edit/:schedule_id" component={CreateSchedule} />
                    <Route exact path="/dashboard/license" component={License} />
                    <Route exact path="/dashboard/settings" component={Settings} />
                    <Route exact path="/dashboard/logs" component={Logs} />
                    <Route path="*" render={() => (<Redirect to="/dashboard" />)} />
                </Switch>
            </div>
        </div>
        
    </div>
)

export default HomeLayout