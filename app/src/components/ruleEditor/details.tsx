import React, { useState } from "react";
import * as styled from "./styles";
import { Link } from 'react-router-dom';
import Box from '../../layout/box';
import Blocks from '../../layout/blocks';
import Actions from '../../layout/actions';
import Icon from "../icon"
import CompanyIcon from '../../svg/company-icon.svg';
import PersonIcon from '../../svg/individual-icon.svg';
import { blinkMarkets } from "../../utils/config/blink-markets";
import Button from '../button';

const RuleDetails = (props: any) => {

    const [JSONIsValid, setJSONIsValid] = useState(true);

    const { collectionOptions, rules, selectedRule, editMultipleFields, setRules, setModal, hasJsonStructure, isEditingJSON, setIsEditingJSON, requestAddRule } = props;

    const coreSelected = selectedRule && selectedRule.marketRuleMapping ?.indexOf("Core") > -1;

    const editMarkets = async (id: string, market: string, checked: boolean, path: string) => {

        const rule = rules.find((rule: any) => rule.id === id);
        let markets: any = [].concat(rule.marketRuleMapping);
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

        editRuleField(rule.path, "marketRuleMapping", markets);
    }

    const editRuleField = async (path: string, field: string, value: string) => {
        const newRules = rules.map((rule: any) => {
            if (rule.path === path) {
                const originalData = rule.originalData || {};
                if (!originalData[field] && originalData[field] !== "") {
                    originalData[field] = rule[field];
                } else if (originalData[field].toString() === value.toString()) {
                    delete originalData[field]
                }
                const newRule = { ...rule, [field]: value, isEdited: true, originalData };
                if (Object.keys(newRule.originalData).length === 0) {
                    delete newRule.originalData;
                } return newRule;
            }
            return rule
        });
        setRules(newRules);
    }

    const saveEdits = async () => {

        if (selectedRule.id === "new") {

            // do some validation of new rule first

            if (!selectedRule.type) {
                const typeLabel = document.getElementById("type-label") as HTMLElement;
                typeLabel.focus();
                return setModal("Invalid rule type", "Please select from the icons at the top", typeLabel.scrollIntoView());
            }
            if (!selectedRule.name) {
                const nameInput = document.getElementById("rule-name") as HTMLInputElement;
                nameInput.focus();
                return setModal("Missing name", "Please enter a rule name", () => nameInput.focus());
            }
            if (!selectedRule.marketRuleMapping || selectedRule.marketRuleMapping.length === 0) {
                const marketsLabel = document.getElementById("markets-label") as HTMLElement;
                marketsLabel.focus();
                return setModal("Missing markets", "Please select one or more markets to apply the rule to", marketsLabel.scrollIntoView());
            }
            if (!selectedRule[selectedRule.name]) {
                setIsEditingJSON(true);
                const codeLabel = document.getElementById("code-label") as HTMLElement;
                codeLabel.scrollIntoView();
                return setModal("Missing rule code", "Please enter some valid JSON rule code", () => {
                    const ruleCodeInput = document.getElementById("rule-code-input") as HTMLInputElement;
                    ruleCodeInput.focus()
                });
            }


            delete selectedRule.id;
            delete selectedRule.originalData;
            selectedRule[selectedRule.name] = JSON.parse(selectedRule[selectedRule.name])
            delete selectedRule.name;
            delete selectedRule.isEdited;
            delete selectedRule.path;
            const collection = selectedRule.type;
            delete selectedRule.type;

            const result = await requestAddRule(selectedRule, `${collection.toLowerCase()}Rules`);
            const newRules = rules.filter((rule: any) => rule.id !== "new");
            newRules.push(result);
            setRules(newRules);

        }
        else if (selectedRule.originalData) {
            const dataToSave: any = {};
            Object.keys(selectedRule.originalData).forEach((key: string) => {
                dataToSave[key] = {
                    value: selectedRule[key]
                }
            });

            if (dataToSave[selectedRule.name]) {
                dataToSave[selectedRule.name] = {
                    value: JSON.parse(dataToSave[selectedRule.name].value),
                    merge: false
                };
            }


            await editMultipleFields(selectedRule.path, dataToSave)

            const newRules = rules.map((rule: any) => {
                if (rule.path === selectedRule.path) {
                    delete rule.originalData;
                }
                return rule
            });
            setRules(newRules);
        }
    }

    const undoEdits = () => {
        const newRules = rules.map((rule: any) => {
            if (rule.path === selectedRule.path) {
                const editedRuleName = rule.name;
                rule = { ...rule, ...rule.originalData }
                if (rule.id === "new") {
                    delete rule[editedRuleName];
                }
                delete rule.originalData;
            }
            return rule
        });
        setRules(newRules);
    }

    const saveJSON = () => {
        const rule = selectedRule[selectedRule.name];
        const isValid = hasJsonStructure(rule);
        setJSONIsValid(isValid);
        if (!isValid) {
            return setModal("Invalid JSON", "Rule format is currently invalid", null);
        }
        setIsEditingJSON(false);
    }

    return <styled.ContentNarrowInner>

        <Link style={{ textDecoration: "none" }} onClick={e => {
            if (selectedRule ?.originalData) {
                e.preventDefault();
                setModal("Unsaved changes", "You have unsaved changes. Please confirm or undo", null)
            } else {
                if (selectedRule.id === "new") {
                    setRules(rules.filter((rule: any) => rule.id !== "new"));
                }
            }
        }} to="/ruleEditor">&lt; Back</Link>

        <styled.ContentNarrowInner>
            <styled.Info>
                {selectedRule.id === "new" ? <>
                    <styled.Heading id="type-label">TYPE</styled.Heading><styled.CollectionFilter>

                        {collectionOptions.map((option: string) => <label key={option}>
                            <Icon size="small" icon={option === "Person" ? PersonIcon : CompanyIcon} style={option === "Person" ? "person" : "company"} />
                            <span>{option}</span>
                            <styled.CheckBox type="checkbox" onChange={(e: any) => editRuleField(selectedRule.path, "type", option)}
                                checked={option === selectedRule.type} /></label>

                        )}
                    </styled.CollectionFilter></> :
                    <Icon size="small" icon={selectedRule.type === "person" ? PersonIcon : CompanyIcon} style={selectedRule.type} />
                }

               
                {selectedRule.id === "new" ? <>
                <styled.Heading id="info-label">INFO</styled.Heading>
                <styled.NameInput
                    id="rule-name"
                    autoFocus
                    onChange={(e: any) => editRuleField(selectedRule ?.path, "name", e.target.value)}
                    placeholder="Create rule name - e.g property.value"
                    value={selectedRule ?.name}
                /></> : <span>{selectedRule ?.name}</span>}

                <styled.Title
                    // onBlur={(e: any) => saveEditRuleField(selectedRule.path, "title", e.target.value)}
                    onChange={(e: any) => editRuleField(selectedRule ?.path, "title", e.target.value)}
                    placeholder="Add a title"
                    value={selectedRule ?.title}
                />

                <styled.Description
                    // onBlur={(e: any) => saveEditRuleField(selectedRule.path, "description", e.target.value)}
                    onChange={(e: any) => editRuleField(selectedRule ?.path, "description", e.target.value)}
                    placeholder="Add a description"
                    value={selectedRule ?.description}
                />


                <styled.Heading id="markets-label">MARKETS</styled.Heading>
                <Blocks>

                    <Box centered shadowed>
                        <styled.Markets>
                            {/* {selectedRule.id} */}
                            <li key="Core">
                                <label htmlFor={`${selectedRule ?.id}-Core`}>
                                    Core
                                    <styled.CheckBox id={`${selectedRule ?.id}-Core`}
                                        checked={selectedRule ?.marketRuleMapping.indexOf("Core") > -1}
                                        onChange={e => editMarkets(selectedRule ?.id, "Core", e.target.checked, selectedRule.path)}
                                        type="checkbox"></styled.CheckBox>
                                </label>
                            </li>
                            {blinkMarkets
                                .filter((market: any) => !market.disabled)
                                .map((market: any) => <li className={coreSelected ? "coreSelected" : ""} key={market.code}>
                                    <label htmlFor={`${selectedRule ?.id}-${market.code}`}>
                                        <img src={market.flag} alt={market.name} />
                                        {market.code}
                                        <styled.CheckBox id={`${selectedRule ?.id}-${market.code}`}
                                            checked={selectedRule ?.marketRuleMapping ?.indexOf(market.code) > -1}
                                            onChange={e => editMarkets(selectedRule ?.id, market.code, e.target.checked, selectedRule.path)}
                                            type="checkbox"></styled.CheckBox>
                                    </label>
                                </li>)}
                        </styled.Markets>
                    </Box>
                </Blocks>

                {selectedRule.marketRuleMapping && selectedRule.marketRuleMapping.length > 0 && <>
                    <styled.Heading>POLICY</styled.Heading>
                    <Blocks>

                        <Box centered shadowed>
                            <styled.Policies>
                                {
                                    selectedRule ?.marketRuleMapping ?.map((market: any) => {

                                        let blinkMarket
                                        if (market === "Core") {
                                            return <li key={market}>
                                                <span>
                                                    Core
                                            </span>
                                                <span>
                                                    XYZ Policy Section 1.2 /a
                                            </span>
                                                <styled.Edit />
                                            </li>
                                        }
                                        blinkMarket = blinkMarkets.find(m => m.code === market);

                                        return <li key={market}>
                                            <span>
                                                <img src={blinkMarket ?.flag} alt={blinkMarket ?.name} />{blinkMarket ?.name}
                                            </span>
                                            <span>
                                                XYZ Policy Section 1.2 /a
                                        </span>
                                            <styled.Edit />
                                        </li>
                                    })
                            }
                            </styled.Policies>
                        </Box>
                    </Blocks>
                </>}
                <styled.Heading id="code-label">CODE</styled.Heading>
                <Blocks>

                    <Box centered shadowed>
                        <styled.Code>
                            <li>
                                <span>
                                    <b>Data Element</b>
                                </span>
                                <span>
                                    {selectedRule ?.name}
                                </span>
                            </li>
                            <li>
                                <span>
                                    <b>Rule</b>
                                </span>
                                <span>
                                    {isEditingJSON && <><styled.RuleCode id="rule-code-input" className={`isValid-${JSONIsValid}`} onChange={e => editRuleField(selectedRule.path, [selectedRule ?.name] ?.toString(), e.target.value)} value={selectedRule[selectedRule.name]}></styled.RuleCode>
                                        <styled.SaveRuleCode onClick={saveJSON}>Save</styled.SaveRuleCode></>}
                                    {!isEditingJSON && selectedRule && selectedRule[selectedRule ?.name]}
                                </span>
                                {!isEditingJSON && <styled.Edit onClick={() => {
                                    if (selectedRule.name === "") {
                                        return setModal("Rule must have a name", "Please give the rule a name before editing code", null);
                                    }
                                    setIsEditingJSON(selectedRule.id === "new" ? !isEditingJSON : isEditingJSON)
                                }}
                                // to enabled code edit functionalty change above line to: setIsEditingJSON(!isEditingJSON)} 
                                />}
                            </li>
                        </styled.Code>
                    </Box>
                </Blocks>

            </styled.Info>
            {selectedRule ?.originalData && !isEditingJSON && <Actions>
                <Button label="Submit for approval" onClick={() => saveEdits()} />
                <Button type={'tertiary'} label="Undo" onClick={() => undoEdits()} />
            </Actions>}
        </styled.ContentNarrowInner>
    </styled.ContentNarrowInner >
}

export default RuleDetails;