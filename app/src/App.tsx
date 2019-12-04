import React from 'react'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";

import CompaniesHouse from "./components/companies-house"

export default function App() {

  return (<Router>
    <div>
      {/* <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
      </ul> */}
      <Switch>
        <Route exact path="/">
          <CompaniesHouse />
        </Route>
        <Route path="/companies-house">
          <CompaniesHouse />
        </Route>
        <Route path="*">
          <div>Not found</div>
        </Route>
      </Switch>
    </div>
  </Router>);
}