
import React, { useState } from "react";
import { addRule, deleteAllRules } from '../../utils/validation/request';
import { MainSt } from "../styles";
import { fetchGoogleSheet } from '../../utils/google/request';

import { blinkMarketList } from '../../utils/config/blink-markets';

import * as Styled from './styles';

const GoogleImport = () => {
    const [added, setAdded] = useState(0);
    const [type, setType] = useState('');
    const [action, setAction] = useState('');

    const importFile = async (type: string, sheetID: string, tabID: string, collection: string) => {
        setType(type);
        setAction('Deleting existing');

        await deleteAllRules(collection);

        const sheet = await fetchGoogleSheet(sheetID, tabID);
        const rulesList = [] as any;
        let count = 0;

        setAction('Adding');

        sheet.map((row: any) => {
            const marketRules = [] as Array<string>;

            if (row['Core'] !== '' && row['Core'] !== 'undefined' && row['Core'] !== undefined) {
                marketRules.push('Core');
            }

            blinkMarketList.forEach((market: string) => {
                if (row[market] !== '' && row[market] !== 'undefined' && row[market] !== undefined) {
                    marketRules.push(market);
                }
            });

            if (row['Validation Rule'] !== '{}' && marketRules.length !== 0) {
                const rule = {
                    [row['Field Name']]: JSON.parse(row['Validation Rule']),
                    marketRuleMapping: marketRules
                } as { [key: string]: any };

                rulesList.push(rule);
            }
        });

        await rulesList.map(async (rule: any) => {
            const ruleAddFunc = await addRule(rule, collection);

            count++;
            setAdded(count);
            return ruleAddFunc;
        });

    }

    return (
        <MainSt>
            <Styled.Import>
                {type !== '' && <Styled.Actions>
                    {((added === 0) ? <div>{action} {type}...</div> : <div>Added {added} {type}</div>)}
                </Styled.Actions>}

                <Styled.Buttons>
                    <button
                        onClick={() => importFile('Company Rules', '1Y3XdWL4TbiaY75HRc8xaTGdTsOVun2klbMsQ576mvy4', '901635867', 'companyRules')}
                    >Import Company Rules</button>

                    <button
                        onClick={() => importFile('Person Rules', '1Y3XdWL4TbiaY75HRc8xaTGdTsOVun2klbMsQ576mvy4', '901635867', 'personRules')}
                    >Import Person Rules</button>
                </Styled.Buttons>
            </Styled.Import>
        </MainSt>
    );
}

export default GoogleImport;
