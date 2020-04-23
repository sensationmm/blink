import React, { useState } from 'react';
import { connect } from 'react-redux';
import { requestAllRules } from '../redux/actions/rules';
import { withRouter } from 'react-router-dom';
import * as Styled from "../components/styles";
import styled from "styled-components";
import Icon from "../components/icon"
import CompanyIcon from '../svg/company-icon.svg';
import PersonIcon from '../svg/individual-icon.svg';

const RulesList = styled.ul`
  
padding: 0;
background-color: #fff;
clear: both;

  li {
    list-style-type: none;
    padding: 0;
    border: 1px solid #D5D4D4;
    // border-bottom: 0;
    &::last-child {
      border: 1px solid #D5D4D4;
    }
    margin-bottom: -1px;

    &:hover {
      border-color: var(--brand-secondary);
      z-index: 1;
      position: relative;
    }
  }

  label {
    display: block; 
    width: calc(100% - 130px);
    padding: 15px 65px;
    text-align: center;
    display: flex;
    align-items: center;
  }

  b {
    background-color: var(--brand-secondary);
  }
`

const ContentNarrowInner = styled.div`
  padding: 20px;
`

const Title = styled.span`
  display: block;
  font-size: 12px;
  margin-left: 50px;
`

const CollectionFilter = styled.div`
font-size: 12px;

  label {
    padding-left: 30px;
  }
`

const Search = styled.input`
  border: none;
  background: none;
  border-bottom: 1px solid #999;
  padding: 10px 5px;
  outline: none;
  margin: 0 0 10px;
  width: 500px;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const collectionOptions = ["Person", "Company"];

const RuleEditor = (props: any) => {

  const [collections, setCollections] = useState([collectionOptions[0]]);
  const [rules, setRules] = useState();
  const [hasRequestRules, setHasRequestRules] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filterAndSort = (rules: any) => {

    const sort: (a: any, b: any) => any = (a: any, b: any) => {

      if (b.title && a.title) {
        return b.title.toLowerCase() > a.title.toLowerCase() ? -1 : 1
      }
      return b.name.toLowerCase() > a.name.toLowerCase() ? -1 : 1
    }

    const term = searchTerm.toLowerCase();
    return rules.filter((r: any) => {
      return (term === "" || (r.name.toLowerCase().indexOf(term) > -1 || r.title.toLowerCase().indexOf(term)))
    })
      .sort(sort)
  }

  const getRules = async (newCollections?: Array<string>) => {
    let allRules: Array<string> = [];

    for (let i = 0; i < (newCollections || collections).length; i++) {
      const collection = collections[i];
      await new Promise(async (next) => {
        const rules = await props.requestAllRules(collection.toLowerCase());
        allRules = allRules.concat(rules.map((rule: any) => {
          const name = Object.keys(rule).find((key: string) =>
            key !== "type" &&
            key !== "description" &&
            key !== "title" &&
            key !== "marketRuleMapping" &&
            key !== "id"
            && key !== "path")

          return { ...rule, type: collection.toLowerCase(), name }

        }));
        next();
      })
    }

    setRules(filterAndSort(allRules));
  }

  if (!hasRequestRules) {
    setHasRequestRules(true);
    getRules();
  }

  const highlightSearch = (value: string) => {
    if (searchTerm == '') {
      return value;
    }

    const regEx = new RegExp(searchTerm, "ig");
    const valueParts = value.split(regEx);
    const matches = value.match(regEx);
    // console.log(matches)
    return valueParts.map((part: string, index: number) => <span key={part}>
        {part}
        {index < (valueParts.length - 1) && <b>
          {matches && matches[index]}
        </b> }</span>)
  }

  const changeCollection = (value: string, checked: boolean) => {
    // setCollection(value);
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

  return (
    <Styled.MainSt>
      <Styled.ContentNarrow>
        {rules && <ContentNarrowInner>
          <Actions>
            <Search value={searchTerm} onChange={(e: any) => setSearchTerm(e.target.value)} placeholder="Search" />
            <CollectionFilter>
              {collectionOptions.map((option: string) => {
                return <span key={option}>
                  <label >{option} <input type="checkbox" onChange={e => changeCollection(option, e.target.checked)} checked={!!collections.find(c => c === option)} /></label>
                </span>
              })}
            </CollectionFilter>
          </Actions>

          {ruleId ? <div>Rule: {ruleId}</div> : <RulesList>{rules.filter((r: any) => {
            const term = searchTerm.toLowerCase();
            return (term === "" || (r.name ?.toLowerCase().indexOf(term) > -1 || r.title ?.toLowerCase().indexOf(term)))
          }).map((rule: any) => {
            return <li key={rule.id} onClick={() => props.history.push(`/ruleEditor/${rule.id}`)}>
              <label>
                <Icon size="small" icon={rule.type === "person" ? PersonIcon : CompanyIcon} style={rule.type} />
                <Title>{highlightSearch(rule.title || rule.name)}</Title>
              </label></li>
          })}
          </RulesList>}

        </ContentNarrowInner>
        }
      </Styled.ContentNarrow>
    </Styled.MainSt>
  );
};

const mapStateToProps = (state: any) => ({
  modal: state.modal,
});

const actions = {
  requestAllRules
}

export default withRouter(connect(mapStateToProps, actions)(RuleEditor));
