import React, { useEffect, useState } from 'react';
import cx from 'classnames';

import CompanyIcon from '../../svg/company-icon.svg';
import PersonIcon from '../../svg/individual-icon.svg';
import getValue from '../../utils/functions/getValue';

import * as Styled from './styles';

interface IShareholderProps {
    shareholder?: any;
    name: string;
    shares?: number;
    showDetail?: (content: JSX.Element) => void;
    companyId?: string;
    officialStatus?: string;
    onClick?: (shareholder: any, shares: any) => void;
    animate?: boolean;
}

export const shareholderAnimLevel = 1000;
export const shareholderAnimVariant = 3500;

const Shareholder = ({
    shareholder,
    name,
    shares,
    showDetail,
    companyId,
    officialStatus,
    onClick,
    animate = false
}: IShareholderProps) => {
    const type = shareholder ? getValue(shareholder.shareholderType) : '';
    const docId = shareholder ? shareholder.docId : '';
    const isWithinShareholderThreshold = shareholder ? shareholder.isWithinShareholderThreshold : '';
    const shareholderDepth = shareholder && shareholder.depth ? shareholder.depth : 0;

    const ShareholderImage = type === 'P' ? Styled.ImagePerson : Styled.ImageCompany;
    const ShareholderLabel = type ? Styled.Label : Styled.Heading;
    const ShareholderIcon = type === 'P' ? PersonIcon : CompanyIcon;

    useEffect(() => {
        return () => {
            clearTimeout(animateTimeout);
        };
    });

    const [animateReady, setAnimateReady] = useState(false);

    const animateTimeout = setTimeout(
        () => setAnimateReady(true),
        (shareholderDepth * shareholderAnimLevel) + (Math.random() * shareholderDepth * shareholderAnimVariant)
    );

    return (
        <Styled.Shareholder
            className={cx(
                { 'heading': !type },
                { 'isWithinShareholderThreshold': isWithinShareholderThreshold && type },
                { 'isCompany': type === 'C' }, { 'isPerson': type === 'P' },
                { animate: animate, },
                { animateReady: animateReady }
            )}
            onClick={() => onClick ? onClick(shareholder, shares) : null}
        >
            <ShareholderImage className={!type ? 'large' : ''} style={{ backgroundImage: `url(${ShareholderIcon})` }} />

            {shares && <Styled.Shares>{shares.toFixed(2)}%</Styled.Shares>}

            <ShareholderLabel className={type}>{name}
                {companyId && <span style={{ fontSize: 14, display: "block" }}>({companyId})</span>}
                {officialStatus && <span style={{ fontSize: 14, display: "block" }}>({officialStatus})</span>}
            </ShareholderLabel>
        </Styled.Shareholder >
    )
}

export default Shareholder;
