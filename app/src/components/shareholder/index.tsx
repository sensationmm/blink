import React from 'react';
import cx from 'classnames';

import CompanyIcon from '../../svg/company-icon.svg';
import PersonIcon from '../../svg/individual-icon.svg';

import * as Styled from './styles';

interface IShareholderProps {
    name: string;
    shares?: number;
    type?: string;
    showDetail?: (content: JSX.Element) => void;
    // docId: string,
    companyId?: string,
    officialStatus?: string,
    isWithinShareholderThreshold: any,
}

const Shareholder = ({ name, shares, showDetail, type, 
    // docId, 
    isWithinShareholderThreshold,
    companyId, officialStatus }: IShareholderProps) => {
    const ShareholderImage = type === 'P' ? Styled.ImagePerson : Styled.ImageCompany;
    const ShareholderLabel = type ? Styled.Label : Styled.Heading;
    const ShareholderIcon = type === 'P' ? PersonIcon : CompanyIcon;

    const details = <>
        <ShareholderImage className={'large'} style={{ backgroundImage: `url(${ShareholderIcon})` }} />
<ShareholderLabel className={type}>{name}</ShareholderLabel>
    </>;

    return (
        <Styled.Shareholder className={cx({ 'heading': !type }, { 'isWithinShareholderThreshold': isWithinShareholderThreshold && type }, { 'isCompany': type === 'C' }, { 'isPerson': type === 'P' })} onClick={() => showDetail ? showDetail(details) : null}>
            <ShareholderImage className={!type ? 'large' : ''} style={{ backgroundImage: `url(${ShareholderIcon})` }} />
            {shares && <Styled.Shares>{shares.toFixed(2)}%</Styled.Shares>}
    <ShareholderLabel className={type}>{name}
    {companyId && <span style={{ fontSize: 14, display: "block" }}>({companyId})</span>}
    {officialStatus && <span style={{ fontSize: 14, display: "block" }}>({officialStatus})</span>}
    </ShareholderLabel>
            {/* {docId && <span style={{ position: "absolute", left: 0, bottom: 20, fontSize: 12, width: "100%" }}>{docId.substring(docId.length - 15)}</span>} */}
        </Styled.Shareholder >
    )
}

export default Shareholder;
