import React, { useState } from 'react'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  withRouter
} from "react-router-dom";

import KyckrFilingSearch from "./components/kyckr/filing-search";
import Generic from "./components/generic"
import Graph from "./components/graph"
import Import from "./components/google-import";
import { Provider } from "react-redux";
import store from "./redux/store";

import Search from './containers/Search';
import Auth from './containers/Auth';
import SignUp from './containers/SignUp'
import CompanyStructure from './containers/CompanyStructure';
import CompanyReadiness from './containers/CompanyReadiness';
import MissingData from './containers/MissingData';
import CompanyCompletion from './containers/CompanyCompletion';
import ContactClient from './containers/ContactClient';
import ScreeningComplete from './containers/ScreeningComplete';
import Integrations from './containers/Integrations';
import Loader from './components/loader';
import Modal from './containers/Modal';
import Doc from './containers/Doc';

import Onboarding from './containers/Onboarding';
import SelectMarkets from './containers/SelectMarkets';
import MyCompany from './containers/MyCompany';
import MyDocuments from './containers/MyDocuments';
import MyDocumentsPerson from './containers/MyDocumentsPerson';
import MyDocumentsCompany from './containers/MyDocumentsCompany';

export default () => {

  return (<Router>
    <Provider store={store}>
      <App />
      <Loader />
      <Modal />
    </Provider>
  </Router>);
}

const App = withRouter((props: any) => {

  store.subscribe(() => {
    const auth = store.getState().auth;
    // console.log("auth", auth)
    setAuthedUser(auth.user);
  })

  const [authedUser, setAuthedUser] = useState() // useState(window.location.href.indexOf("localhost:") > -1);

  return !authedUser ?

    <Auth />
    : (!authedUser.verified ? <SignUp /> : <div>
      <Switch>
        <Route exact path="/"><Redirect to="/search" /></Route>

        <Route exact path="/onboarding"><Onboarding /></Route>
        <Route exact path="/onboarding/select-markets"><SelectMarkets /></Route>
        <Route exact path="/onboarding/my-company"><MyCompany /></Route>
        <Route exact path="/onboarding/my-documents"><MyDocuments /></Route>
        <Route exact path="/onboarding/my-documents/company-details"><MyDocumentsCompany /></Route>
        <Route exact path="/onboarding/my-documents/company/:section" component={
          (props: any) => (<MyDocumentsCompany section={props.match.params.section} />
          )} />
        <Route exact path="/onboarding/my-documents/:type/:docId" component={
          (props: any) => (<MyDocumentsPerson docId={props.match.params.docId} type={props.match.params.type} />
          )} />

        <Route exact path="/search"><Search /></Route>
        <Route exact path="/company-structure"><CompanyStructure /></Route>
        <Route exact path="/company-readiness"><CompanyReadiness /></Route>
        <Route exact path="/missing-data"><MissingData /></Route>
        <Route exact path="/company-completion"><CompanyCompletion /></Route>
        <Route exact path="/contact-client"><ContactClient /></Route>
        <Route exact path="/screening-complete"><ScreeningComplete /></Route>

        <Route exact path="/doc"><Doc /></Route>

        <Route path="/kyckr-filing-search">
          <KyckrFilingSearch />
        </Route>
        <Route path="/combined">
          <Generic />
        </Route>
        <Route path="/graph/:companyId?/:countryCode?">
          <Graph />
        </Route>
        <Route path="/import">
          <Import />
        </Route>
        <Route path="/integrations/:provider?">
          <Integrations />
        </Route>
        <Route path="*">
          <div>Not found</div>
        </Route>
      </Switch>
    </div>
    )
});