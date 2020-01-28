import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';

import Shareholder from '../shareholder/index';

import * as Styled from './styles';

interface IOrgChartProps {
    companyName: string;
    shareholders: object[];
    filter: (list: object[]) => object[];
}

const OrgChart = ({ companyName, filter, shareholders }: IOrgChartProps) => {
    const renderShareholder = (shareholder: any) => {
        return (
            <TreeNode label={<Shareholder name={shareholder.name} shareType={shareholder.shareType} shares={shareholder.percentage} type={shareholder.shareholderType} />}>
                {shareholder.shareholders && filter(shareholder.shareholders).reverse().map((shareholder2: any) => {
                    return renderShareholder(shareholder2);
                })}
            </TreeNode>
        )
    }

    return (
        <Styled.OrgChart>
            <Styled.OrgChartInner>
                <Tree label={<Shareholder name={companyName} />} lineWidth={'2px'} lineBorderRadius={'5px'} lineHeight="20px" lineColor="#000" nodePadding="5px">
                    {filter(shareholders).reverse().map((shareholder: any) => {
                        return renderShareholder(shareholder);
                    })}
                </Tree>
            </Styled.OrgChartInner>
        </Styled.OrgChart>
    )
};

export default OrgChart;
