import React, { useState } from 'react';
import { connect } from 'react-redux';
import { requestAllRules } from '../redux/actions/rules';
import { setModal } from '../redux/actions/modal';
import { withRouter, Redirect } from 'react-router-dom';
import * as Styled from "../components/styles";
import { requestEditMultipleFields, requestAddRule } from "../redux/actions/validation";

import RuleDetails from "../components/ruleEditor/details";
import List from "../components/ruleEditor/list";
import BlinkLogo from '../svg/blink-logo.svg';
import User from './User';

const collectionOptions = ["Person", "Company"];

const RuleEditor = (props: any) => {

  const [collections, setCollections] = useState([...collectionOptions]);
  const [rules, setRules] = useState();
  const [hasRequestRules, setHasRequestRules] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditingJSON, setIsEditingJSON] = useState("");
  console.log(props)
  if (!props.auth?.user?.admin) {
    return <Redirect to="/" />
  }

  const sort = (rules: any) => {

    const sort: (a: any, b: any) => any = (a: any, b: any) => {

      const aNameOrTitle = a.title || a.name;
      const bNameOrTitle = b.title || b.name;

      return bNameOrTitle.toLowerCase() > aNameOrTitle.toLowerCase() ? -1 : 1
    }

    return rules.sort(sort)
  }

  const hasJsonStructure = (str: string) => {

    if (typeof str !== 'string') return false;
    try {
      const result = JSON.parse(str);
      const type = Object.prototype.toString.call(result);
      return type === '[object Object]'
        || type === '[object Array]';
    } catch (err) {
      return false;
    }
  }

  const createNewRule = () => {
    const newRule = {
      name: "",
      type: undefined,
      title: "",
      description: "",
      path: "",
      id: "new",
      marketRuleMapping: [],
    }
    const newRules = [...rules, newRule];
    setRules(newRules)
  }

  const getRules = async (newCollections?: Array<string>) => {
    let allRules: Array<string> = [];

    for (let i = 0; i < (newCollections || collections).length; i++) {
      const collection = collections[i];
      await new Promise(async (next) => {
        const rules = await props.requestAllRules(collection.toLowerCase());
        allRules = allRules.concat(rules.map((rule: any) => {
          const name: any = Object.keys(rule).find((key: string) =>
            key !== "type" &&
            key !== "description" &&
            key !== "isEdited" &&
            key !== "title" &&
            key !== "edits" &&
            key !== "marketRuleMapping" &&
            key !== "id"
            && key !== "path")

          return {
            ...rule,
            type: collection.toLowerCase(),
            name,
            [name]: JSON.stringify(rule[name]),
            description: rule.description || "",
            title: rule.title || ""
          }

        }));
        next();
      })
    }

    setRules(sort(allRules));
  }

  if (!hasRequestRules) {
    setHasRequestRules(true);
    getRules();
  }

  const changeCollection = (value: string, checked: boolean) => {
    const newCollectons = collections;
    const index = collections.indexOf(value)
    if (checked) {
      if (collections.indexOf(value) === -1) {
        newCollectons.push(value)
      }
    } else {
      if (index > -1) {
        newCollectons.splice(index, 1)
      }
    }
    getRules(newCollectons);
    setCollections(newCollectons)
  }

  const { ruleId } = props.match.params;
  const selectedRule = ruleId && rules ?.find((r: any) => r.id === ruleId);

  return (
    <>
      <Styled.Header>
        <img alt="Blink" src={BlinkLogo} />
        <User />
      </Styled.Header>
      <Styled.MainSt>
        <Styled.ContentNarrow>
          {rules && <>

            {(ruleId && selectedRule) ?
              <RuleDetails
                // setRules={setRules}
                rules={rules}
                selectedRule={selectedRule}
                setRules={setRules}
                editMultipleFields={props.editMultipleFields}
                setModal={props.setModal}
                hasJsonStructure={hasJsonStructure}
                isEditingJSON={isEditingJSON}
                setIsEditingJSON={setIsEditingJSON}
                collectionOptions={collectionOptions}
                requestAddRule={props.requestAddRule} />
              :

              <List
                createNewRule={createNewRule}
                collections={collections}
                rules={rules}
                changeCollection={changeCollection}
                collectionOptions={collectionOptions}
                setSearchTerm={setSearchTerm}
                searchTerm={searchTerm}
                history={props.history} />
            }

          </>
          }
        </Styled.ContentNarrow>
      </Styled.MainSt >
    </>
  );
};

const mapStateToProps = (state: any) => ({
  modal: state.modal,
  auth: state.auth
});

const actions = {
  requestAllRules,
  requestAddRule,
  editMultipleFields: requestEditMultipleFields,
  setModal
}

export default withRouter(connect(mapStateToProps, actions)(RuleEditor));
