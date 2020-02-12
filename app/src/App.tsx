import React from 'react'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";

// import CompaniesHouse from "./components/companies-house-2"
import Kyckr from "./components/kyckr"
import KyckrFilingSearch from "./components/kyckr/filing-search";
import DueDill from "./components/duedill"
import Trulioo from "./components/trulioo"
import Generic from "./components/generic"
import SetupProgress from "./components/setup-progress";
import Import from "./components/google-import";
import { Tabs } from "./components/styles";
import { Link, withRouter } from "react-router-dom";

export default () => {

  return (<Router>
    <App />
  </Router>);
}

const App = withRouter((props: any) => <div>
  <Tabs>
    {/* <li className={props.location.pathname === "/companies-house" || props.location.pathname === "/" ? "active" : ""}>
      <Link to="/companies-house">Companies House</Link>
    </li> */}
    <li className={props.location.pathname === "/kyckr" ? "active" : ""}>
      <Link to="/kyckr">Kyckr</Link>
    </li>
    <li className={props.location.pathname === "/kyckr-filing-search" ? "active" : ""}>
      <Link to="/kyckr-filing-search">Kyckr Filing Search</Link>
    </li>
    <li className={props.location.pathname === "/duedill" ? "active" : ""}>
      <Link to="/duedill">Duedill</Link>
    </li>
    <li className={props.location.pathname === "/combined" || props.location.pathname === "/" ? "active" : ""}>
      <Link to="/combined">Combined</Link>
    </li>
    {/* <li className={props.location.pathname === "/trulioo" ? "active" : ""}>
      <Link to="/trulioo">Trulioo</Link>
    </li> */}
  </Tabs>
  <Switch>
    <Route exact path="/">
      <Generic />
    </Route>
    {/* <Route path="/companies-house">
      <CompaniesHouse />
    </Route> */}
    <Route path="/kyckr">
      <Kyckr />
    </Route>
    <Route path="/kyckr-filing-search">
      <KyckrFilingSearch />
    </Route>
    <Route path="/duedill">
      <DueDill />
    </Route>
    <Route path="/trulioo">
      <Trulioo />
    </Route>
    <Route path="/combined">
      <Generic />
    </Route>
    <Route path="/progress">
      <SetupProgress />
    </Route>
    <Route path="/import">
      <Import />
    </Route>
    <Route path="*">
      <div>Not found</div>
    </Route>
  </Switch>
</div>)