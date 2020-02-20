
import React, { useState } from "react";
import { addRule, deleteAllRules } from '../../utils/validation/request';
import { MainSt } from "../styles";
import { fetchGoogleSheet } from '../../utils/google/request';

import { blinkMarketList } from '../../utils/config/blink-markets';

import * as Styled from './styles';

interface newFile extends Element {
    files: Array<Blob>;
}

const GoogleImport = () => {
    const [added, setAdded] = useState(0);
    const [type, setType] = useState('');
    const [action, setAction] = useState('');

    const importFile = async (type: string, sheetID: string, tabID: string) => {
        setType(type);
        setAction('Deleting existing');

        await deleteAllRules();

        const sheet = await fetchGoogleSheet(sheetID, tabID);
        const rulesList = [] as any;
        let count = 0;

        setAction('Adding');

        sheet.map((row: any) => {
            const marketRules = [] as Array<string>;

            if (row['Core'] !== '' && row['Core'] !== 'undefined' && row['Core'] !== undefined) {
                marketRules.push('GB');
                marketRules.push('DE');
                marketRules.push('FR');
                marketRules.push('RO');
                marketRules.push('SE');
                marketRules.push('IT');
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
            const ruleAddFunc = await addRule(rule);

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

                <button
                    onClick={() => importFile('Company Rules', '1Y3XdWL4TbiaY75HRc8xaTGdTsOVun2klbMsQ576mvy4', '901635867')}
                >Import Company Rules</button>
            </Styled.Import>
        </MainSt>
    );
}

export default GoogleImport;
