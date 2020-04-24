import React from "react";

import * as styled from "./styles";
import Icon from "../icon"
import CompanyIcon from '../../svg/company-icon.svg';
import PersonIcon from '../../svg/individual-icon.svg';

const List = (props: any) => {

    const { history, rules, setSearchTerm, searchTerm, collectionOptions, changeCollection, collections } = props;

    const highlightSearch = (value: string) => {
        if (searchTerm == '') {
            return value;
        }

        const regEx = new RegExp(searchTerm, "ig");
        const valueParts = value.split(regEx);
        const matches = value.match(regEx);

        return valueParts.map((part: string, index: number) => <span key={index}>
            {part}
            {index < (valueParts.length - 1) && <b>
                {matches && matches[index]}
            </b>}</span>)
    }


    return <styled.ContentNarrowInner>
        <styled.Actions>
            <styled.Search value={searchTerm} onChange={(e: any) => setSearchTerm(e.target.value)} placeholder="Search" />
            <styled.CollectionFilter>
                {collectionOptions.map((option: string) => <label key={option}>{option}
                    <styled.CheckBox type="checkbox" onChange={e => changeCollection(option, e.target.checked)} checked={!!collections.find((c: string) => c === option)} /></label>

                )}
            </styled.CollectionFilter>
        </styled.Actions>
        <styled.RulesList>{rules.filter((r: any) => {
            const term = searchTerm.toLowerCase();
            if (term === "") {
                return true
            }
            if (r.title) {
                return r.title.toLowerCase().indexOf(term) > -1
            }
            return r.name ?.toLowerCase().indexOf(term) > -1
        }).map((rule: any) => {
                return <li key={rule.id} onClick={() => {
                    history.push(`/ruleEditor/${rule.id}`)
                }}>
                    <label>
                        <Icon size="small" icon={rule.type === "person" ? PersonIcon : CompanyIcon} style={rule.type} />
                        <styled.Name>{highlightSearch(rule.title || rule.name)}</styled.Name>
                    </label></li>
            })}
        </styled.RulesList>
    </styled.ContentNarrowInner>
}

export default List 