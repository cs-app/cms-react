import React, {Component} from "react";
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import Login from "../modules/login/Login";
import AppHome from "./AppHome";

class AppRouting extends Component {

    render() {
        return (
            <div className="container-scroller">
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" render={() => <Redirect to="/login"/>}/>
                        <Route path="/login" component={Login}/>
                        <AppHome/>
                        <Route component={Error}/>
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}

export default AppRouting;