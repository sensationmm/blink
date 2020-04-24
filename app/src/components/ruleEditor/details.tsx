import React from "react";
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

    const { rules, selectedRule, editMultipleFields, setRules, setModal } = props;

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
                }

                return { ...rule, [field]: value, isEdited: true, originalData };
            }
            return rule
        });
        setRules(newRules);
    }

    const saveEdits = async () => {

        if (selectedRule.originalData) {
            const dataToSave: any = {};
            Object.keys(selectedRule.originalData).forEach((key: string) => {
                dataToSave[key] = selectedRule[key];
            });

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
                rule = { ...rule, ...rule.originalData }
                delete rule.originalData;
            }
            return rule
        });
        setRules(newRules);
    }

    return <styled.ContentNarrowInner>

        <Link style={{ textDecoration: "none" }} onClick={e => {
            if (selectedRule.originalData) {
                e.preventDefault();
                setModal("Unsaved changes", "You have unsaved changes. Please confirm or undo", null)
            }
        }} to="/ruleEditor">&lt; Back</Link>

        <styled.ContentNarrowInner>
            <styled.Info>
                <Icon size="small" icon={selectedRule.type === "person" ? PersonIcon : CompanyIcon} style={selectedRule.type} />
                <span>{selectedRule.name}</span>

                <styled.Title
                    // onBlur={(e: any) => saveEditRuleField(selectedRule.path, "title", e.target.value)}
                    onChange={(e: any) => editRuleField(selectedRule.path, "title", e.target.value)}
                    placeholder="Add a title"
                    value={selectedRule.title}
                />

                <styled.Description
                    // onBlur={(e: any) => saveEditRuleField(selectedRule.path, "description", e.target.value)}
                    onChange={(e: any) => editRuleField(selectedRule.path, "description", e.target.value)}
                    placeholder="Add a description"
                    value={selectedRule.description}
                />


                <styled.Heading>MARKETS</styled.Heading>
                <Blocks>

                    <Box centered shadowed>
                        <styled.Markets>

                            <li key="Core">
                                <label htmlFor={`${selectedRule.id}-Core`}>
                                    Core
                                    <styled.CheckBox id={`${selectedRule.id}-Core`}
                                        checked={selectedRule.marketRuleMapping.indexOf("Core") > -1}
                                        onChange={e => editMarkets(selectedRule.id, "Core", e.target.checked, selectedRule.path)}
                                        type="checkbox"></styled.CheckBox>
                                </label>
                            </li>
                            {blinkMarkets
                                .filter((market: any) => !market.disabled)
                                .map((market: any) => <li className={coreSelected ? "coreSelected" : ""} key={market.code}>
                                    <label htmlFor={`${selectedRule.id}-${market.code}`}>
                                        <img src={market.flag} alt={market.name} />
                                        {market.code}
                                        <styled.CheckBox id={`${selectedRule.id}-${market.code}`}
                                            checked={selectedRule.marketRuleMapping.indexOf(market.code) > -1}
                                            onChange={e => editMarkets(selectedRule.id, market.code, e.target.checked, selectedRule.path)}
                                            type="checkbox"></styled.CheckBox>
                                    </label>
                                </li>)}
                        </styled.Markets>
                    </Box>
                </Blocks>


                <styled.Heading>POLICY</styled.Heading>
                <Blocks>

                    <Box centered shadowed>
                        <styled.Policies>
                            {
                                selectedRule.marketRuleMapping.map((market: any) => {

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
                <styled.Heading>CODE</styled.Heading>
                <Blocks>

                    <Box centered shadowed>
                        <styled.Code>
                            <li>
                                <span>
                                    <b>Data Element</b>
                                </span>
                                <span>
                                    {selectedRule.name}
                                </span>
                            </li>
                            <li>
                                <span>
                                    <b>Rule</b>
                                </span>
                                <span>
                                    {JSON.stringify(selectedRule[selectedRule.name])}
                                </span>
                                <styled.Edit />
                            </li>
                        </styled.Code>
                    </Box>
                </Blocks>

            </styled.Info>
            {selectedRule.originalData && <Actions>
                <Button label="Submit for approval" onClick={() => saveEdits()} />
                <Button type={'tertiary'} label="Undo" onClick={() => undoEdits()} />
            </Actions>}
        </styled.ContentNarrowInner>
    </styled.ContentNarrowInner>
}

export default RuleDetails;