import React from 'react'
import { Route, Switch, Redirect } from "react-router-dom"
import {toast, ToastContainer} from 'react-toastify'

import {Home} from '../../containers/home/Home'
import {Register} from '../../containers/home/Register'
import {ForgotPassword} from '../../containers/home/ForgotPassword'
import {ResetPassword} from '../../containers/home/ResetPassword'
import {VerifyUser} from '../../containers/home/VerifyUser'

import Footer from './home/Footer'

const HomeLayout = () => (
    <div>
        <ToastContainer position={toast.POSITION.TOP_CENTER} pauseOnHover={false} hideProgressBar={true} autoClose={2000} />
        <div className="ads__home">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-md-6 d-none d-md-block">
                        <div className="ads__home-ads">
                            <h1>Cloud Digital Signage Solution</h1>
                            <p>Manage and publish contents on single or multiple displays with ease. You can upload your own creatives or get it from our Appstore.</p>
                            <div className="ads__home-carousel carousel slide" id="ads-carousel" data-ride="carousel" data-interval="2000">
                                <ol className="carousel-indicators">
                                    <li className="active" data-target="#ads-carousel" data-slide-to="0"></li>
                                    <li data-target="#ads-carousel" data-slide-to="1"></li>
                                    <li data-target="#ads-carousel" data-slide-to="2"></li>
                                </ol>
                                <div className="carousel-inner">
                                    <div className="carousel-item active"><img className="d-block w-100" src="/dist/images/home-slider/slider1.svg" alt="Slider 1" /></div>
                                    <div className="carousel-item"><img className="d-block w-100" src="/dist/images/home-slider/slider2.svg" alt="Slider 2" /></div>
                                    <div className="carousel-item"><img className="d-block w-100" src="/dist/images/home-slider/slider3.svg" alt="Slider 3" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route path="/register" component={Register} />
                            <Route path="/forgot-password" component={ForgotPassword} />
                            <Route path="/verify/:id/:token" component={VerifyUser} />
                            <Route path="/reset-password/:id/:token" component={ResetPassword} />
                            <Route path="*" render={() => (<Redirect to="/" />)} />
                        </Switch>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
)

export default HomeLayout