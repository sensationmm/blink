import React, { useState } from 'react';
import { connect } from 'react-redux';

import FormInput from '../form-input';
import CompanyIcon from '../../svg/company-icon.svg';
import PersonIcon from '../../svg/individual-icon.svg';
import Blocks from '../../layout/blocks';
import Button from '../../components/button';
import Actions from '../../layout/actions';

import IconAdd from '../../svg/icon-add.svg';
import getValue from '../../utils/functions/getValue';

import { clearSideTray } from '../../redux/actions/side-tray';
import { editField as apiEditField } from '../../utils/validation/request';
import { showLoader, hideLoader } from '../../redux/actions/loader';
import { setCompanyStructure } from '../../redux/actions/screening';
import { requestCompanyUBOStructure } from '../../utils/generic/request';

import * as Styled from './styles';

interface ShareholderEditProps {
    shareholder: any;
    shares: number;
    showLoader: (msg: string) => void;
    hideLoader: () => void;
    clearSideTray: () => void;
    setCompanyStructure: (company: any) => void;
    companyId: string;
    countryCode: string;
}

const ShareholderEdit: React.FC<ShareholderEditProps> = ({
    shareholder,
    shares,
    showLoader,
    hideLoader,
    clearSideTray,
    setCompanyStructure,
    companyId,
    countryCode
}) => {
    const ShareholderImage = getValue(shareholder.shareholderType) === 'P' ? Styled.ImagePerson : Styled.ImageCompany;
    const ShareholderIcon = getValue(shareholder.shareholderType) === 'P' ? PersonIcon : CompanyIcon;

    const formattedShares = String(shares.toFixed(2));

    const [editPercentage, setPercentage] = useState(formattedShares);
    const [editName, setName] = useState(shareholder.name.value);
    const [hackValue, setHackValue] = useState(Math.random());

    const edited = editPercentage !== formattedShares || editName !== shareholder.name.value;

    const saveChanges = async () => {
        clearSideTray();
        showLoader('Saving');

        const apiEditName = await apiEditField(shareholder.docId, 'name', { ...shareholder.name, value: editName });
        const apiEditShares = await apiEditField(shareholder.relationshipDocId, 'percentage', { ...shareholder.percentage, value: editPercentage });

        await Promise.all([apiEditName, apiEditShares]);

        const UBOStructure = await requestCompanyUBOStructure(companyId, countryCode);

        setCompanyStructure(UBOStructure);
        setHackValue(Math.random());
        hideLoader();
    }

    return (
        <Styled.Main>
            <Styled.Add><img src={IconAdd} />Add new beneficial owner</Styled.Add>

            <Styled.Delete>Delete</Styled.Delete>

            <Styled.Card>
                <Blocks>
                    <ShareholderImage style={{ backgroundImage: `url(${ShareholderIcon})` }} />

                    <FormInput
                        stateKey={'asd'}
                        label={'Percentage held'}
                        onChange={(key, value) => setPercentage(value)}
                        value={editPercentage}
                        isEdit
                    />

                    <FormInput
                        stateKey={'asd'}
                        label={'Name'}
                        onChange={(key, value) => setName(value)}
                        value={editName}
                        isEdit
                    />

                    <Actions fill>
                        <Button type={'secondary'} small onClick={clearSideTray} label={'Cancel'} disabled={!edited} />
                        <Button small onClick={saveChanges} label={'Confirm'} disabled={!edited} />
                    </Actions>
                </Blocks>
            </Styled.Card>
        </Styled.Main>



    )
}

const mapStateToProps = (state: any) => ({
    companyId: state.screening.company.companyId,
    countryCode: state.screening.company.countryCode,
});

const actions = {
    clearSideTray,
    showLoader,
    hideLoader,
    setCompanyStructure
};

export const RawComponent = ShareholderEdit;

export default connect(mapStateToProps, actions)(ShareholderEdit);
