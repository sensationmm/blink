import React, { useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import Shareholder from '../shareholder/index';
import ZoomIn from '../../svg/zoom-in.svg';
import ZoomOut from '../../svg/zoom-out.svg';

import * as Styled from './styles';

interface IOrgChartProps {
    companyName: string;
    shareholders: object[];
    filter: (list: object[]) => object[];
}

interface ITransformWrapperProps {
    zoomIn: () => void;
    zoomOut: () => void;
}

const OrgChart = ({ companyName, filter, shareholders }: IOrgChartProps) => {
    const [detail, showDetail] = useState(false);
    const [detailContent, setDetailContent] = useState(<></>);

    const renderShareholder = (shareholder: any, shareholderCount: string, parentShares: number = 100) => {

        const childPercentage = parseFloat(shareholder.percentage) * (parentShares / 100);

        return (
            <TreeNode key={`shareholder-${shareholderCount}`} label={<Shareholder name={shareholder.name} shares={childPercentage} type={shareholder.shareholderType} showDetail={showDetailModal} />}>
                {shareholder.shareholders && filter(shareholder.shareholders).reverse().map((shareholder2: any, count2: number) => {
                    return renderShareholder(shareholder2, `${shareholderCount}-${count2}`, childPercentage);
                })}
            </TreeNode>
        )
    }

    const showDetailModal = (content: JSX.Element) => {
        setDetailContent(content);
        showDetail(true);
    }

    const clearDetailModal = () => {
        showDetail(false);
        setDetailContent(<></>);
    }

    return (
        <Styled.OrgChart>
            <TransformWrapper options={{ maxScale: 2, minScale: 0.5 }}>
                {({ zoomIn, zoomOut, ...rest }: ITransformWrapperProps) => (
                    <div>
                        <TransformComponent>
                            <Styled.OrgChartInner>
                                <Tree label={<Shareholder name={companyName} />} lineWidth={'2px'} lineBorderRadius={'5px'} lineHeight={'20px'} lineColor={'black'} nodePadding={'5px'}>
                                    {filter(shareholders).reverse().map((shareholder: any, count: number) => {
                                        return renderShareholder(shareholder, `${count}`);
                                    })}
                                </Tree>
                            </Styled.OrgChartInner>
                        </TransformComponent>

                        <Styled.Controls>
                            <img src={ZoomIn} onClick={zoomIn} alt="Zoom In" />
                            <img src={ZoomOut} onClick={zoomOut} alt="Zoom Out" />
                        </Styled.Controls>
                    </div>
                )}
            </TransformWrapper>

            <Styled.Detail className={detail ? 'open' : ''} onClick={clearDetailModal}>{detailContent}</Styled.Detail>
        </Styled.OrgChart>
    )
};

export default OrgChart;
