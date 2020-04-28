import React, { useState } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import FormInput from '../form-input';
import FormSelect from '../form-select';
import CompanyIcon from '../../svg/company-icon.svg';
import PersonIcon from '../../svg/individual-icon.svg';
import Blocks from '../../layout/blocks';
import Button from '../../components/button';
import Actions from '../../layout/actions';

import IconAdd from '../../svg/icon-add.svg';
import getValue from '../../utils/functions/getValue';

import { clearSideTray } from '../../redux/actions/side-tray';
import { editField as apiEditField, addUBO as apiAddUBO, deleteUBO as apiDeleteUBO } from '../../utils/validation/request';
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
    currentUser: string;
}

const ShareholderEdit: React.FC<ShareholderEditProps> = ({
    shareholder,
    shares,
    showLoader,
    hideLoader,
    clearSideTray,
    setCompanyStructure,
    companyId,
    countryCode,
    currentUser
}) => {
    const ShareholderImage = getValue(shareholder.shareholderType) === 'P' ? Styled.ImagePerson : Styled.ImageCompany;
    const ShareholderIcon = getValue(shareholder.shareholderType) === 'P' ? PersonIcon : CompanyIcon;

    const [editPercentage, setPercentage] = useState(getValue(shareholder.percentage));
    const [editName, setName] = useState(getValue(shareholder.name) || getValue(shareholder.fullName));
    // const [hackValue, setHackValue] = useState(Math.random());

    const [addNode, setAddNode] = useState(false);
    const [addName, setAddName] = useState('');
    const [addPercentage, setAddPercentage] = useState('');
    const [addType, setAddType] = useState('persons');
    const [addRole, setAddRole] = useState('');

    const edited = editPercentage !== getValue(shareholder.percentage) || editName !== getValue(shareholder.name);
    const editedAdd = addName !== '' && addPercentage !== '';

    const saveChanges = async () => {
        showLoader('Saving');

        await apiEditField(shareholder.docId, 'fullName', { ...shareholder.fullName, value: editName }, currentUser);
        await apiEditField(shareholder.relationshipDocId, 'percentage', { ...shareholder.percentage, value: editPercentage }, currentUser);
        const UBOStructure = await requestCompanyUBOStructure(companyId, countryCode);

        setCompanyStructure(UBOStructure);
        // setHackValue(Math.random());
        clearSideTray();
        hideLoader();
    };

    const addShareholder = async () => {
        showLoader('Saving');

        await apiAddUBO(shareholder.docId, addType, addPercentage, addName, addRole);
        const UBOStructure = await requestCompanyUBOStructure(companyId, countryCode);

        setCompanyStructure(UBOStructure);
        // setHackValue(Math.random());
        clearSideTray();
        hideLoader();
    };

    const deleteShareholder = async () => {
        showLoader('Saving');

        await apiDeleteUBO(shareholder.relationshipDocId);
        const UBOStructure = await requestCompanyUBOStructure(companyId, countryCode);

        setCompanyStructure(UBOStructure);
        // setHackValue(Math.random());
        clearSideTray();
        hideLoader();
    };

    return (
        <Styled.Main>
            <Styled.Add
                className={classNames({ cta: !addNode }, { person: getValue(shareholder.shareholderType) === 'P' })}
                onClick={() => setAddNode(true)}
            >
                {!addNode
                    ? <div><img alt="Add" src={IconAdd} />Add new beneficial owner</div>
                    : <Blocks gutter={'small'}>
                        <FormSelect
                            stateKey={'addType'}
                            label={'Type of beneficial owner'}
                            onChange={(key, value) => setAddType(value)}
                            options={[
                                {
                                    value: 'persons',
                                    label: 'Individual',
                                    icon: <Styled.Image className={'small person'} style={{ backgroundImage: `url(${PersonIcon})` }} />
                                },
                                {
                                    value: 'companies',
                                    label: 'Company',
                                    icon: <Styled.Image className={'small company'} style={{ backgroundImage: `url(${CompanyIcon})` }} />
                                }
                            ]}
                            value={addType}
                        />

                        <FormInput
                            stateKey={'addPercentage'}
                            label={'Percentage held of parent'}
                            onChange={(key, value) => setAddPercentage(value)}
                            value={addPercentage}
                            isEdit
                            suffix={'%'}
                        />

                        <FormInput
                            stateKey={'addName'}
                            label={'Name'}
                            onChange={(key, value) => setAddName(value)}
                            value={addName}
                            isEdit
                        />

                        {addType !== 'companies' &&
                            <FormInput
                                stateKey={'addRole'}
                                label={'Role'}
                                onChange={(key, value) => setAddRole(value)}
                                value={addRole}
                                placeholder={'Optional'}
                                isEdit
                            />
                        }

                        <Actions fill>
                            <Button type={'secondary'} small onClick={() => setAddNode(false)} label={'Cancel'} />
                            <Button small onClick={addShareholder} label={'Confirm'} disabled={!editedAdd} />
                        </Actions>
                    </Blocks>
                }
            </Styled.Add>

            <Styled.Delete className={classNames({ disabled: addNode })} onClick={deleteShareholder}>Delete</Styled.Delete>

            <Styled.Card className={classNames({ disabled: addNode })}>
                <Styled.CardContent>
                    <Blocks gutter={'small'}>
                        <ShareholderImage style={{ backgroundImage: `url(${ShareholderIcon})` }} />

                        <FormInput
                            stateKey={'asd'}
                            label={'Percentage held of parent'}
                            onChange={(key, value) => setPercentage(value)}
                            value={editPercentage}
                            isEdit
                            suffix={'%'}
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
                </Styled.CardContent>
            </Styled.Card>
        </Styled.Main>



    )
}

const mapStateToProps = (state: any) => ({
    companyId: state.screening.company.companyId,
    countryCode: state.screening.company.countryCode,
    currentUser: state.auth.user.localId
});

const actions = {
    clearSideTray,
    showLoader,
    hideLoader,
    setCompanyStructure
};

export const RawComponent = ShareholderEdit;

export default connect(mapStateToProps, actions)(ShareholderEdit);
