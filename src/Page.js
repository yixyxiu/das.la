import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Index from "./views/Index";
import 'antd/dist/antd.css';
import "./styles/base.css";

export default () => (
    <Router>
        <Switch>
            <Route exact path="/" render={() => <Redirect to="/index" push />} />
            <Route exact path="/index" component={Index} />
        </Switch>
    </Router>
);
