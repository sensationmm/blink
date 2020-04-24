import React, { useState } from 'react';
import { connect } from 'react-redux';
import { requestAllRules } from '../redux/actions/rules';
import { withRouter, Link } from 'react-router-dom';
import * as Styled from "../components/styles";
import styled from "styled-components";
import Box from '../layout/box';
import Icon from "../components/icon"
import CompanyIcon from '../svg/company-icon.svg';
import PersonIcon from '../svg/individual-icon.svg';
import { InputSt } from '../components/styles';
import { editField } from "../utils/validation/request";
import { blinkMarkets } from "../utils/config/blink-markets";

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

const Name = styled.span`
  display: block;
  font-size: 12px;
  margin-left: 50px;
`

const CollectionFilter = styled.div`
font-size: 12px;
  display: flex;
  label {
    display: flex;
align-items: center;

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

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span {
    margin: 20px 0;
  }
`

const Markets = styled.ul`
  display: flex;
  margin: 0;

  li {
    list-style-type: none;
    padding: 0 10px;

    label {
      display: flex;
      align-items: center;

      input {
        margin: 0 5px;
      }
    }

    &.coreSelected {
      opacity: 0.3;
      &:hover {
        opacity: 1;
      }
    }

    img {
      height: 15px;
      width: 15px;
      margin: 0 5px;
    }
  }
`

const CheckBox = styled.input`
  appearance: unset;
  border: 1px solid var(--brand-secondary);
  padding: 8px;
  border-radius: 50%;
  position: relative;
  outline: none;

  &:checked::after {
    content: "";
    position: absolute;
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background-color: var(--brand-secondary);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`

const Title = styled(InputSt)`
  max-width: 500px;
  border-color: transparent;
  text-align: center;
  margin-bottom: 0px;
  &:focus {
    border-color: var(--basic-shadow);
  }
`

const Description = styled(Title)`
  color: #979797;
  font-size: 14px;
`;

const Heading = styled.span`
  font-size: 12px;
  font-weight: bold;
`


const collectionOptions = ["Person", "Company"];

const RuleEditor = (props: any) => {

  const [collections, setCollections] = useState([...collectionOptions]);
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

  const editRuleField = async (path: string, field: string, value: string) => {
    const newRules = rules.map((rule: any) => {
      if (rule.path === path) {
        return { ...rule, [field]: value, isEdited: true };
      }
      return rule
    });
    setRules(newRules);
  }

  const saveEditRuleField = async (path: string, field: string, value: string) => {
    const result = await editField(path, field, value);
    console.log(result);
  }

  const editMarkets = async (id: string, market: string, checked: boolean) => {

    const rule = rules.find((rule: any) => rule.id === id);
    let markets = rule.marketRuleMapping;
    const index = rule.marketRuleMapping.indexOf(market);

    if (market === "Core") {
      if (checked && index === -1) {
        markets = ["Core"];
      }
    } else if (checked && index === -1) {
      const coreIndex = markets.indexOf("Core");
      if (coreIndex > -1) {
        markets.splice(coreIndex, 1);
      }
      markets.push(market);
    }


    if (!checked && index > -1) {
      markets.splice(index, 1);
    }

    const newRules = rules.map((rule: any) => {
      if (rule.id === id) {
        return { ...rule, marketRuleMapping: markets }
      }
      return rule;
    });

    setRules(newRules);

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
            key !== "isEdited" &&
            key !== "title" &&
            key !== "marketRuleMapping" &&
            key !== "id"
            && key !== "path")

          return {
            ...rule,
            type: collection.toLowerCase(),
            name,
            description: rule.description || "",
            title: rule.title || ""
          }

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

    return valueParts.map((part: string, index: number) => <span key={part}>
      {part}
      {index < (valueParts.length - 1) && <b>
        {matches && matches[index]}
      </b>}</span>)
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
  const selectedRule = ruleId && rules ?.find((r: any) => r.id === ruleId);
  const coreSelected = selectedRule && selectedRule.marketRuleMapping ?.indexOf("Core") > -1;

  return (
    <Styled.MainSt>
      <Styled.ContentNarrow>
        {rules && <ContentNarrowInner>

          {(ruleId && selectedRule) ?
            <>
              <Actions><Link to="/ruleEditor">&lt; Back</Link></Actions>
              <div>
                <Info>
                  <Icon size="small" icon={selectedRule.type === "person" ? PersonIcon : CompanyIcon} style={selectedRule.type} />
                  <span>{selectedRule.name}</span>

                  <Title
                    onBlur={(e: any) => saveEditRuleField(selectedRule.path, "title", e.target.value)}
                    onChange={(e: any) => editRuleField(selectedRule.path, "title", e.target.value)}
                    placeholder="Add a title"
                    value={selectedRule.title}
                  />

                  <Description
                    onBlur={(e: any) => saveEditRuleField(selectedRule.path, "description", e.target.value)}
                    onChange={(e: any) => editRuleField(selectedRule.path, "description", e.target.value)}
                    placeholder="Add a description"
                    value={selectedRule.description}
                  />

                  <Heading>MARKETS</Heading>

                  <Box>
                    <Markets>

                      <li key="Core">
                        <label htmlFor={`${selectedRule.id}-Core`}>
                          Core
                      <CheckBox id={`${selectedRule.id}-Core`}
                            checked={selectedRule.marketRuleMapping.indexOf("Core") > -1}
                            onChange={e => editMarkets(selectedRule.id, "Core", e.target.checked)}
                            type="checkbox"></CheckBox></label>
                      </li>
                      {blinkMarkets
                        .filter((market: any) => !market.disabled)
                        .map((market: any) => <li className={coreSelected ? "coreSelected" : ""} key={market.code}>
                          <label htmlFor={`${selectedRule.id}-${market.code}`}>
                            <img src={market.flag} alt={market.name} />
                            {market.code}
                            <CheckBox id={`${selectedRule.id}-${market.code}`}
                              checked={selectedRule.marketRuleMapping.indexOf(market.code) > -1}
                              onChange={e => editMarkets(selectedRule.id, market.code, e.target.checked)}
                              type="checkbox"></CheckBox></label>
                        </li>)}
                    </Markets>
                  </Box>


                  <Heading>POLICY</Heading>

                  <Box>

                  </Box>
                </Info>
              </div>
            </>
            :

            <>
              <Actions>
                <Search value={searchTerm} onChange={(e: any) => setSearchTerm(e.target.value)} placeholder="Search" />
                <CollectionFilter>
                  {collectionOptions.map((option: string) => <label key={option}>{option} <CheckBox type="checkbox" onChange={e => changeCollection(option, e.target.checked)} checked={!!collections.find(c => c === option)} /></label>

                  )}
                </CollectionFilter>
              </Actions>
              <RulesList>{rules.filter((r: any) => {
                const term = searchTerm.toLowerCase();
                return (term === "" || (r.name ? r.name.toLowerCase().indexOf(term) > -1 : r.title ?.toLowerCase().indexOf(term) > -1))
              }).map((rule: any) => {
                return <li key={rule.id} onClick={() => props.history.push(`/ruleEditor/${rule.id}`)}>
                  <label>
                    <Icon size="small" icon={rule.type === "person" ? PersonIcon : CompanyIcon} style={rule.type} />
                    <Name>{highlightSearch(rule.title || rule.name)}</Name>
                  </label></li>
              })}
              </RulesList></>}

        </ContentNarrowInner>
        }
      </Styled.ContentNarrow>
    </Styled.MainSt >
  );
};

const mapStateToProps = (state: any) => ({
  modal: state.modal,
});

const actions = {
  requestAllRules
}

export default withRouter(connect(mapStateToProps, actions)(RuleEditor));
