import React from 'react'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";

import CompaniesHouse from "./components/companies-house-2"
import Kyckr from "./components/kyckr"
import DueDill from "./components/duedill"
import Trulioo from "./components/trulioo"
import { Tabs } from "./components/styles";
import { Link, withRouter } from "react-router-dom";

export default () => {

  return (<Router>
    <App />
  </Router>);
}

const App = withRouter((props: any) => <div>
  <Tabs>
    <li className={props.location.pathname === "/companies-house" || props.location.pathname === "/" ? "active" : ""}>
      <Link to="/companies-house">Companies House</Link>
    </li>
    <li className={props.location.pathname === "/kyckr" ? "active" : ""}>
      <Link title="Problems" to="/kyckr">Kyckr <span>⚠️</span></Link>
    </li>
    <li className={props.location.pathname === "/duedill" ? "active" : ""}>
      <Link to="/duedill">Duedill</Link>
    </li>
    {/* <li className={props.location.pathname === "/trulioo" ? "active" : ""}>
      <Link to="/trulioo">Trulioo</Link>
    </li> */}
  </Tabs>
  <Switch>
    <Route exact path="/">
      <CompaniesHouse />
    </Route>
    <Route path="/companies-house">
      <CompaniesHouse />
    </Route>
    <Route path="/kyckr">
      <Kyckr />
    </Route>
    <Route path="/duedill">
      <DueDill />
    </Route>
    <Route path="/trulioo">
      <Trulioo />
    </Route>
    <Route path="*">
      <div>Not found</div>
    </Route>
  </Switch>
</div>)