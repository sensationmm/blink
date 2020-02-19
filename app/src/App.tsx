import React from 'react'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  withRouter
} from "react-router-dom";

// import CompaniesHouse from "./components/companies-house-2"
import Kyckr from "./components/kyckr"
import KyckrFilingSearch from "./components/kyckr/filing-search";
import DueDill from "./components/duedill"
import Trulioo from "./components/trulioo"
import Generic from "./components/generic"
import Graph from "./components/graph"
import SetupProgress from "./components/setup-progress";
import Import from "./components/google-import";
import { Provider } from "react-redux";
import store from "./redux/store";

import Search from './containers/Search';
import CompanyStructure from './containers/CompanyStructure';
import Loader from './components/loader';

export default () => {

  return (<Router>
    <Provider store={store}>
      <App />
      <Loader />
    </Provider>
  </Router>);
}

const App = withRouter((props: any) => <div>
  <Switch>
    <Route exact path="/"><Redirect to="/search" /></Route>

    <Route exact path="/search"><Search /></Route>
    <Route exact path="/company-structure"><CompanyStructure /></Route>

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
    <Route path="/graph/:companyId?/:countryCode?">
      <Graph />
    </Route>
    <Route path="/progress/:companyId?">
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