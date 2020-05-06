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

import { Person, personValidation } from './MyDocuments';

const ManualApproval = (props: any) => {
    const { type, docId, onSave, value } = props;

    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [done, setDone] = useState(value ?.substr(0, 5) === 'Notif');

    const onDone = () => {
        onSave(`${type}.value`, `Notification sent ${moment().format('DD.MM.YY')}`, "distinctShareholders", docId)
        setDone(true);
    }

    return (
        <Styled.ManualApproval>
            {!done
                ? <Box paddedLarge centered>
                    <Blocks>
                        <img alt="Mobile" src={IconMobile} />
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
                        <div><img alt="Mobile" src={IconMobile} /></div>
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
        currentUser,
        docId,
        type,
        companyStructure,
        validation,
        history,
        saveEditField,
        showLoader,
        hideLoader
    } = props;

    const people = companyStructure ?.distinctShareholders.concat(companyStructure ?.officers);
    const shareholder = companyStructure && getByValue(people, 'docId', `${type}/${docId}`);

    const manualPassport = shareholder ?.passport ?.file ?.substring(0, 5) === 'Notif';
    const manualUtilityBill = shareholder ?.utilityBill ?.file ?.substring(0, 5) === 'Notif';

    const [manualID, setManualID] = useState(manualPassport);
    const [manualAddress, setManualAddress] = useState(manualUtilityBill);

    if (!currentUser.screened || !companyStructure) {
        return <Redirect to="/onboarding" />;
    }

    const validationErrorsForField = (field: string, validationErrors: any) => {
        let errors: any = [];
        if (!validationErrors) {
            return errors
        }
        Object.keys(validationErrors).forEach(market => {
            const marketErrors = validationErrors[market];
            if (marketErrors ?.[field] ?.validation) {
                errors = errors.concat(marketErrors[field] ?.validation);
            }
        });

        return errors;
    }

    const validationErrors = validation[shareholder.docId].errors;
    const validationResults = personValidation(Person, validationErrors, currentUser.markets);

    const passportErrors = validationErrorsForField("passport", validationErrors);
    const passportMustBeCertified = passportErrors.indexOf("Passport validation must be certified") > -1;

    const utilityBillErrors = validationErrorsForField("utilityBill", validationErrors);
    const utilityBillMustBeCertified = utilityBillErrors.indexOf("Utility bill validation must be certified") > -1;


    const saveShareholder = async () => {
        showLoader('Saving');
        const passport = shareholder.passport ?.file;
        const utilityBill = shareholder.utilityBill ?.file;

        Person.filter((item: any) => item !== 'passport.file' && item !== 'utilityBill.file')
            .forEach(async (item: any) => {
                await apiEditField(shareholder.docId, item, shareholder[item] || '', currentUser.localId);
            })

        const passportValue: any = { file: passport };
        if (passportMustBeCertified) {
            passportValue.validation = "certified"
        }
        passport && await apiEditField(shareholder.docId, 'passport', passportValue, currentUser.localId);
        
        const utilityBillValue: any = { file: utilityBill };
        if (utilityBillMustBeCertified) {
            utilityBillValue.validation = "certified"
        }
        utilityBill && await apiEditField(shareholder.docId, 'utilityBill', utilityBillValue, currentUser.localId);

        hideLoader();
        history.push('/onboarding/my-documents');
    }

    const handleUpload = (src: string, base64File: any) => {
        saveEditField(`${src}.file`, base64File, "distinctShareholders", shareholder.docId)
    }

    return (
        <MainStyled.MainSt className="person">
            <SetupStatus markets={currentUser.markets} />

            <MainStyled.ContentNarrow>
                <Box centered paddedLarge>
                    <Styled.Intro>
                        <Icon icon={ShareholderIcon} style={'person'} />
                        <Styled.HeaderName>{getValue(shareholder.name)}</Styled.HeaderName>
                        <Styled.HeaderRole>UBO</Styled.HeaderRole>
                    </Styled.Intro>

                    <h1 className="center">Verify Identification</h1>

                    <Blocks>
                        {validationResults.indexOf('birthDate') > -1 &&
                            <Styled.Inputs>
                                <FormInput
                                    stateKey={'birthDate.value'}
                                    label={'Date of birth'}
                                    onChange={(field: any, value: any) => saveEditField(field, value, "distinctShareholders", shareholder.docId)}
                                    value={getValue(shareholder.birthDate)}
                                    isEdit
                                    placeholder={'DD/MM/YYYY'}
                                />
                            </Styled.Inputs>
                        }

                        {validationResults.indexOf('passport.file') > -1 && <>
                            <FormLabel label={'Do you have a copy of their passport?'} />
                            <FormCheckboxGroup
                                stateKey={''}
                                options={[{ label: 'Yes', value: false }, { label: 'No', value: true }]}
                                selected={manualID ? true : false}
                                onChange={(field: string, value: any) => setManualID(value)}
                            />

                            {!manualID
                                ? <Blocks>
                                    <FormLabel label={
                                        passportMustBeCertified
                                            ? 'Upload certified passport'
                                            : 'Upload passport'}
                                        tooltip={passportMustBeCertified
                                            ? 'We need a copy of your passport certified by a lawyer or notary public as proof of your identity'
                                            : 'We need your passport as proof of ID'} />
                                    <FormUploader
                                        id={'passport'}
                                        onUpload={handleUpload}
                                        uploaded={!manualPassport && shareholder.passport ?.file}
                                        onClearUpload={() => saveEditField('passport.value', null, 'distinctShareholders', shareholder.docId)}
                                    />
                                </Blocks>
                                : <ManualApproval
                                    type={'passport'}
                                    docId={shareholder.docId} onSave={saveEditField}

                                    value={shareholder.passport ?.file}
                                />
                            }
                        </>
                        }

                        {validationResults.indexOf('currentResidenceAddress') > -1 &&
                            <Styled.Inputs>
                                <FormInput
                                    stateKey={'currentResidenceAddress.value'}
                                    label={'Residential address'}
                                    onChange={(field: any, value: any) => saveEditField(field, value, "distinctShareholders", shareholder.docId)}
                                    value={getValue(shareholder.currentResidenceAddress)}
                                    isEdit
                                />
                            </Styled.Inputs>
                        }

                        {validationResults.indexOf('utilityBill.file') > -1 && <>
                            <FormLabel label={'Do you have a copy of their utility bill?'} />
                            <FormCheckboxGroup
                                stateKey={''}
                                options={[{ label: 'Yes', value: false }, { label: 'No', value: true }]}
                                selected={manualAddress ? true : false}
                                onChange={(field: string, value: any) => setManualAddress(value)}
                            />

                            {!manualAddress
                                ? <Blocks>
                                    <FormLabel
                                        label={utilityBillMustBeCertified
                                            ? 'Upload certified utility bill'
                                            : 'Upload utility bill'}
                                        tooltip={utilityBillMustBeCertified
                                            ? 'We need a copy of your utility bill certified by a lawyer or notary public as proof of your identity'
                                            : 'We need your utility bill as proof of address'}
                                    />
                                    <FormUploader
                                        id={'utilityBill'}
                                        onUpload={handleUpload}
                                        uploaded={!manualUtilityBill && shareholder.utilityBill ?.file}
                                        onClearUpload={() => saveEditField('utilityBill.value', null, 'distinctShareholders', shareholder.docId)}
                                    />
                                </Blocks>
                                : <ManualApproval
                                    type={'utilityBill'}
                                    docId={shareholder.docId}
                                    onSave={saveEditField}
                                    value={shareholder.utilityBill ?.file}
                                />
                            }
                        </>
                        }

                        <Styled.Inputs>
                            <Blocks>
                                <Styled.TaxBlock>
                                    {validationResults.indexOf('countryOfTaxResidence') > -1 &&
                                        <div>
                                            <FormInput
                                                stateKey={'countryOfTaxResidence.value'}
                                                label={'Country of tax residence'}
                                                onChange={(field: any, value: any) => saveEditField(field, value, "distinctShareholders", shareholder.docId)}
                                                value={getValue(shareholder.countryOfTaxResidence)}
                                                isEdit
                                            />
                                        </div>
                                    }

                                    {validationResults.indexOf('taxId') > -1 &&
                                        <div>
                                            <FormInput
                                                stateKey={'taxId.value'}
                                                label={'Tax ID'}
                                                onChange={(field: any, value: any) => saveEditField(field, value, "distinctShareholders", shareholder.docId)}
                                                value={getValue(shareholder.taxId)}
                                                isEdit
                                            />
                                        </div>
                                    }
                                </Styled.TaxBlock>

                                {validationResults.indexOf('contactEmail') > -1 &&
                                    <div>
                                        <FormInput
                                            stateKey={'contactEmail.value'}
                                            label={'Contact email'}
                                            onChange={(field: any, value: any) => saveEditField(field, value, "distinctShareholders", shareholder.docId)}
                                            value={getValue(shareholder.contactEmail)}
                                            isEdit
                                        />
                                    </div>
                                }

                                {validationResults.indexOf('phoneNumber') > -1 &&
                                    <div>
                                        <FormInput
                                            stateKey={'phoneNumber.value'}
                                            label={'Contact phone'}
                                            onChange={(field: any, value: any) => saveEditField(field, value, "distinctShareholders", shareholder.docId)}
                                            value={getValue(shareholder.phoneNumber)}
                                            isEdit
                                        />
                                    </div>
                                }

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
    currentUser: state.auth.user,
    companyStructure: state.screening.companyStructure,
    validation: state.screening.validation,
});

const actions = { showLoader, hideLoader, saveEditField };

export const RawComponent = MyDocumentsPerson;

export default connect(mapStateToProps, actions)(withRouter(MyDocumentsPerson));
