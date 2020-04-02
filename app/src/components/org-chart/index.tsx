import cx from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import Shareholder from '../shareholder/index';
import FullScreen from '../../svg/fullscreen.svg';
import FullScreenExit from '../../svg/fullscreen-exit.svg';
import Reset from '../../svg/reset.svg';
import ZoomIn from '../../svg/zoom-in.svg';
import ZoomOut from '../../svg/zoom-out.svg';
import getValue from '../../utils/functions/getValue';

import * as Styled from './styles';

interface IOrgChartProps {
    companyName: string;
    shareholders: object[];
    filter: (list: object[]) => object[];
    docId?: string;
    companyId?: string;
    officialStatus?: string;
    shareholderThreshold: number;
    onClick?: (shareholder: any, shares: any) => void;
    animate: boolean;
}

interface ITransformWrapperProps {
    zoomIn: () => void;
    zoomOut: () => void;
    setTransform: (posX: number, posY: number, scale: number) => void;
}

interface IOptions {
    defaultScale?: number;
}

const OrgChart = ({ companyName, filter, shareholders, docId, companyId, officialStatus, onClick, animate }: IOrgChartProps) => {
    let chartContainer = useRef(null);
    let chartCanvas = useRef(null);
    let resizeTimeout: ReturnType<typeof setTimeout>;
    let modalTimeout: ReturnType<typeof setTimeout>;
    let rerenderTimeout: ReturnType<typeof setTimeout>;

    const [detail, showDetail] = useState(false);
    const [detailContent, setDetailContent] = useState(<></>);
    const [isFullScreen, setFullScreen] = useState(false);
    const [defaultScale, setDefaultScale] = useState(1);
    const [adjustScale, setAdjustScale] = useState(true);
    const [defaultPos, setDefaultPos] = useState({ top: 0, left: 0 });

    const renderShareholder = (shareholder: any, shareholderCount: string) => {
        const name = getValue(shareholder.name) || getValue(shareholder.fullName);

        return (
            <TreeNode
                key={`shareholder-${shareholderCount}`}
                label={
                    <Shareholder
                        name={name}
                        shareholder={shareholder}
                        // docId={shareholder.docId}
                        // isWithinShareholderThreshold={shareholder.isWithinShareholderThreshold}
                        shares={shareholder.totalShareholding * 100}
                        // type={getValue(shareholder.shareholderType)}
                        showDetail={showDetailModal}
                        onClick={onClick}
                        animate={animate}
                    />
                }>
                {shareholder.shareholders && filter(shareholder.shareholders).reverse().map((shareholder2: any, count2: number) => {
                    return renderShareholder(shareholder2, `${shareholderCount}-${count2}`);
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
        modalTimeout = setTimeout(() => setDetailContent(<></>), 300);
    }

    const onFullScreen = (set: boolean) => {
        setAdjustScale(true)
        setFullScreen(set);
    }

    const onResize = () => {
        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(() => {
            setAdjustScale(true);
            calculateSize();
        }, 50);
    }

    const calculateSize = () => {
        const canvas = (chartCanvas?.current || { offsetWidth: 0, offsetHeight: 0 });
        const canvasSize = { width: canvas.offsetWidth, height: canvas.offsetHeight };
        const container = (chartContainer?.current || { offsetWidth: 0, offsetHeight: 0 });
        const containerSize = { width: container.offsetWidth - 100, height: container.offsetHeight - 100 };

        let ratio = 1;
        if (canvasSize.width > canvasSize.height) {
            if (canvasSize.width > containerSize.width) {
                ratio = (containerSize.width) / canvasSize.width;
            }
        } else {
            if (canvasSize.height > containerSize.height) {
                ratio = (containerSize.height) / canvasSize.height;
            }
        }

        if (ratio < 0.2) {
            ratio = 0.2;
        }
        let newRatio = Math.round((ratio + Number.EPSILON) * 10) / 10;

        const defaultLeft = ((containerSize.width - (canvasSize.width * newRatio)) / 2) + (ratio !== 1 ? 0 : 50);
        const defaultTop = ((containerSize.height - (canvasSize.height * newRatio)) / 2) + (ratio !== 1 ? 0 : 50);

        setDefaultScale(ratio);
        setDefaultPos({ top: defaultTop, left: defaultLeft });
    }

    useEffect(() => {
        calculateSize();

        window.addEventListener('resize', onResize);
    }, [isFullScreen]);

    useEffect(() => {
        return () => {
            clearTimeout(resizeTimeout);
            clearTimeout(modalTimeout);
            clearTimeout(rerenderTimeout);
        }
    }, []);

    return (
        <Styled.OrgChart className={cx({ fullscreen: isFullScreen })} ref={chartContainer}>
            <TransformWrapper
                defaultScale={defaultScale}
                options={{ maxScale: 3, minScale: 0.2, centerContent: true }}
            // pan={{ disableOnTarget: ['div'] }} @TODO: pending TS change from package
            >
                {({ zoomIn, zoomOut, setTransform }: ITransformWrapperProps) => {
                    if (defaultScale && adjustScale === true) {
                        setTransform(defaultPos.left, defaultPos.top, defaultScale);
                        rerenderTimeout = setTimeout(() => setAdjustScale(false), 500);
                    }

                    return (
                        <div>
                            <TransformComponent>
                                <Styled.OrgChartInner ref={chartCanvas}>
                                    <Tree
                                        label={
                                            <Shareholder
                                                name={companyName}
                                                officialStatus={officialStatus}
                                                companyId={companyId}
                                                animate={animate}
                                            />
                                        }
                                        lineWidth={'2px'} lineBorderRadius={'5px'}
                                        lineHeight={'20px'}
                                        lineColor={'black'}
                                        nodePadding={'5px'}
                                    >
                                        {filter(shareholders)?.reverse().map((shareholder: any, count: number) => {
                                            return renderShareholder(shareholder, `${count}`);
                                        })}
                                    </Tree>
                                </Styled.OrgChartInner>
                            </TransformComponent>

                            <Styled.Controls>
                                {!isFullScreen && <img src={FullScreen} onClick={() => onFullScreen(true)} alt="Fullscreen" />}
                                {isFullScreen && <img src={FullScreenExit} onClick={() => onFullScreen(false)} alt="Exit fullscreen" />}
                                <img src={ZoomIn} onClick={zoomIn} alt="Zoom In" />
                                <img src={ZoomOut} onClick={zoomOut} alt="Zoom Out" />
                                <img src={Reset} onClick={() => setTransform(defaultPos.left, defaultPos.top, defaultScale)} alt="Reset" />
                            </Styled.Controls>
                        </div>
                    )
                }
                }
            </TransformWrapper>

            <Styled.Detail className={detail ? 'open' : ''}>{detailContent}</Styled.Detail>
            <Styled.DetailMask className={detail ? 'open' : ''} onClick={clearDetailModal} />
        </Styled.OrgChart>
    )
};

export default OrgChart;
