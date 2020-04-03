import React, { useState } from "react";
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import getValue from '../utils/functions/getValue';

import { editField as saveEditField } from '../redux/actions/screening';
import { editField as apiEditField } from '../utils/validation/request';
import { showLoader, hideLoader } from '../redux/actions/loader';

import SetupStatus from '../components/setup-status';
import Icon from '../components/icon';
import FormCheckboxGroup from '../components/form-checkbox-group';
import FormLabel from '../components/form-label';
import FormUploader from '../components/form-uploader';
import Button from '../components/button';
import Actions from '../layout/actions';
import Box from '../layout/box';
import Blocks from '../layout/blocks';

import getByValue from '../utils/functions/getByValue';
import maskString from '../utils/functions/maskString';

import ShareholderIcon from '../svg/individual-icon.svg';
import IconMobile from '../svg/icon-mobile.svg';
import * as MainStyled from "../components/styles";
import * as Styled from './my-documents.styles';
import FormInput from "../components/form-input";

const ManualApproval = (props: any) => {
    const { type, docId, onSave, value } = props;

    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [done, setDone] = useState(value?.substr(0, 5) === 'Notif');

    const onDone = () => {
        onSave(`verification.${type}`, `Notification sent ${moment().format('DD.MM.YY')}`, "distinctShareholders", docId)
        setDone(true);
    }

    return (
        <Styled.ManualApproval>
            {!done
                ? <Box paddedLarge centered>
                    <Blocks>
                        <img src={IconMobile} />
                        <p>We need to send a link to either mobile or email to take them through a <b>2-step ID verification process</b>.</p>

                        <br />

                        <FormInput
                            stateKey={'manual.mobile'}
                            label={'Mobile number'}
                            onChange={(field: any, value: any) => setMobile(value)}
                            value={mobile}
                            isEdit
                        />

                        <FormInput
                            stateKey={'manual.email'}
                            label={'Email'}
                            onChange={(field: any, value: any) => setEmail(value)}
                            value={email}
                            isEdit
                        />

                        <Actions centered>
                            <Button small onClick={onDone} label={'Send'} disabled={mobile === '' && email === ''} />
                        </Actions>
                    </Blocks>
                </Box>
                : <Box paddedLarge centered>
                    <Blocks>
                        <div><img src={IconMobile} /></div>
                        <div>Notification sent on {moment().format('DD.MM.YY')}</div>
                        <Styled.Mask>{mobile ? maskString(mobile, 3) : email}</Styled.Mask>
                        <div>We will notify you once the verification process is complete.</div>
                    </Blocks>
                </Box>
            }
        </Styled.ManualApproval>
    )
}

const MyDocumentsPerson = (props: any) => {
    const {
        docId,
        type,
        companyStructure,
        history,
        saveEditField
    } = props;

    const shareholder = getByValue(companyStructure.distinctShareholders, 'docId', `${type}/${docId}`);

    const manualPassport = shareholder.verification?.passport?.substring(0, 5) === 'Notif';
    const manualUtilityBill = shareholder.verification?.utilityBill?.substring(0, 5) === 'Notif';

    const [manualID, setManualID] = useState(manualPassport);
    const [manualAddress, setManualAddress] = useState(manualUtilityBill);

    const saveShareholder = async () => {
        showLoader('Saving');
        const countryOfTaxResidence = shareholder.countryOfTaxResidence;
        const taxId = shareholder.taxId;
        const role = shareholder.role;
        const passport = shareholder.verification?.passport;
        const utilityBill = shareholder.verification?.utilityBill;

        countryOfTaxResidence && await apiEditField(shareholder.docId, 'countryOfTaxResidence', countryOfTaxResidence);
        taxId && await apiEditField(shareholder.docId, 'taxId', taxId);
        role && await apiEditField(shareholder.docId, 'role', role);

        console.log(typeof passport)
        passport && await apiEditField(shareholder.docId, 'verification', { passport });
        utilityBill && await apiEditField(shareholder.docId, 'verification', { utilityBill });

        hideLoader();
        history.push('/onboarding/my-documents');
    }

    const handleUpload = (src: string, base64File: any) => {
        saveEditField(`verification.${src}`, base64File, "distinctShareholders", shareholder.docId)
    }

    return (
        <MainStyled.MainSt>
            <SetupStatus />

            <MainStyled.ContentNarrow>
                <Box centered paddedLarge>
                    <Styled.Intro>
                        <Icon icon={ShareholderIcon} style={'person'} />
                        <Styled.HeaderName>{getValue(shareholder.name)}</Styled.HeaderName>
                        <Styled.HeaderRole>UBO</Styled.HeaderRole>
                    </Styled.Intro>

                    <h1 className="center">Verify Identification</h1>

                    <Blocks>
                        <FormLabel label={'Do you have a copy of their passport?'} />
                        <FormCheckboxGroup
                            options={[{ label: 'Yes', value: false }, { label: 'No', value: true }]}
                            selected={manualID ? 1 : 0}
                            onChange={setManualID}
                        />

                        {!manualID
                            ? <Blocks>
                                <FormLabel label={'Upload passport'} tooltip={'We need your passport as proof of ID'} />
                                <FormUploader
                                    id={'passport'}
                                    onUpload={handleUpload}
                                    uploaded={!manualPassport && shareholder.verification?.passport}
                                    onClearUpload={() => saveEditField('verification.passport', null, 'distinctShareholders', shareholder.docId)}
                                />
                            </Blocks>
                            : <ManualApproval
                                type={'passport'}
                                docId={shareholder.docId} onSave={saveEditField}
                                value={shareholder.verification?.passport}
                            />
                        }

                        <FormLabel label={'Do you have a copy of their utility bill?'} />
                        <FormCheckboxGroup
                            options={[{ label: 'Yes', value: false }, { label: 'No', value: true }]}
                            selected={manualAddress ? 1 : 0}
                            onChange={setManualAddress}
                        />

                        {!manualAddress
                            ? <Blocks>
                                <FormLabel label={'Upload utility bill'} tooltip={'We need your utility bill as proof of address'} />
                                <FormUploader
                                    id={'utilityBill'}
                                    onUpload={handleUpload}
                                    uploaded={!manualUtilityBill && shareholder.verification?.utilityBill}
                                    onClearUpload={() => saveEditField('verification.utilityBill', null, 'distinctShareholders', shareholder.docId)}
                                />
                            </Blocks>
                            : <ManualApproval
                                type={'utilityBill'}
                                docId={shareholder.docId}
                                onSave={saveEditField}
                                value={shareholder.verification?.utilityBill}
                            />
                        }

                        <Styled.Inputs>
                            <Blocks>
                                <Styled.TaxBlock>
                                    <div>
                                        <FormInput
                                            stateKey={'countryOfTaxResidence.value'}
                                            label={'Country of residence'}
                                            onChange={(field: any, value: any) => saveEditField(field, value, "distinctShareholders", shareholder.docId)}
                                            value={getValue(shareholder.countryOfTaxResidence)}
                                            isEdit
                                        />
                                    </div>

                                    <div>
                                        <FormInput
                                            stateKey={'taxId.value'}
                                            label={'Tax ID'}
                                            onChange={(field: any, value: any) => saveEditField(field, value, "distinctShareholders", shareholder.docId)}
                                            value={getValue(shareholder.taxId)}
                                            isEdit
                                        />
                                    </div>
                                </Styled.TaxBlock>

                                <FormInput
                                    stateKey={'role.value'}
                                    label={'Role (Optional)'}
                                    onChange={(field: any, value: any) => saveEditField(field, value, "distinctShareholders", shareholder.docId)}
                                    value={getValue(shareholder.role)}
                                    isEdit
                                />
                            </Blocks>
                        </Styled.Inputs>

                        <Actions centered>
                            <Button small onClick={saveShareholder} label={'Save'} />
                            <Button small type={'secondary'} onClick={() => history.push('/onboarding/my-documents')} label={'Cancel'} />
                        </Actions>
                    </Blocks>
                </Box>
            </MainStyled.ContentNarrow>
        </MainStyled.MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    companyStructure: state.screening.companyStructure,
});

const actions = { showLoader, hideLoader, saveEditField };

export const RawComponent = MyDocumentsPerson;

export default connect(mapStateToProps, actions)(withRouter(MyDocumentsPerson));
