import React, { useState } from 'react';
import { connect } from 'react-redux';
import { requestAllRules } from '../redux/actions/rules';
import { setModal } from '../redux/actions/modal';
import { withRouter } from 'react-router-dom';
import * as Styled from "../components/styles";
import { editMultipleFields } from "../redux/actions/validation";

import RuleDetails from "../components/ruleEditor/details";
import List from "../components/ruleEditor/list";
import BlinkLogo from '../svg/blink-logo.svg';

const collectionOptions = ["Person", "Company"];

const RuleEditor = (props: any) => {

  const [collections, setCollections] = useState([...collectionOptions]);
  const [rules, setRules] = useState();
  const [hasRequestRules, setHasRequestRules] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditingJSON, setIsEditingJSON] = useState("");

  const sort = (rules: any) => {

    const sort: (a: any, b: any) => any = (a: any, b: any) => {

      if (b.title && a.title) {
        return b.title.toLowerCase() > a.title.toLowerCase() ? -1 : 1
      }
      return b.name.toLowerCase() > a.name.toLowerCase() ? -1 : 1
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
      </Styled.Header>
      <Styled.MainSt>
        <Styled.ContentNarrow>
          {rules && <>

            {(ruleId && selectedRule) ?
              <RuleDetails s
                etRules={setRules}
                rules={rules}
                selectedRule={selectedRule}
                setRules={setRules}
                editMultipleFields={props.editMultipleFields}
                setModal={props.setModal}
                hasJsonStructure={hasJsonStructure}
                isEditingJSON={isEditingJSON} 
                setIsEditingJSON={setIsEditingJSON} />
        :

              <List
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
});

const actions = {
  requestAllRules,
  editMultipleFields,
  setModal
}

export default withRouter(connect(mapStateToProps, actions)(RuleEditor));
