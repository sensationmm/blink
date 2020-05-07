import React, { useEffect, useState } from "react";
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { editField as saveEditField } from '../redux/actions/screening';
import { editField as apiEditField } from '../utils/validation/request';
import { showLoader, hideLoader } from '../redux/actions/loader';

import SetupStatus from '../components/setup-status';
import Icon from '../components/icon';
import FormInput from "../components/form-input";
import FormCheckboxGroup from '../components/form-checkbox-group';
import FormLabel from '../components/form-label';
import FormUploader from '../components/form-uploader';
import Button from '../components/button';
import Actions from '../layout/actions';
import Box from '../layout/box';
import Blocks from '../layout/blocks';

import getValue from '../utils/functions/getValue';
import hasValue from '../utils/functions/hasValue';

import IconDocuments from '../svg/icon-documents.svg';
import IconBusiness from '../svg/icon-business.svg';
import IconCompany from '../svg/company-icon.svg';
import IconEdit from '../svg/icon-edit.svg';
import IconUpload from '../svg/icon-upload.svg';

import * as MainStyled from "../components/styles";
import * as Styled from './my-documents.styles';

import { CompanyDetails, BusinessDetails, CompanyDocuments, companyDocsValidation } from './MyDocuments';

const MyDocumentsCompany = (props: any) => {
    const {
        currentUser,
        companyStructure,
        history,
        saveEditField,
        section
    } = props;

    const [loadedCompanyStructure, setLoadedCompanyStructure] = useState();
    useEffect(() => {
        setLoadedCompanyStructure(companyStructure);
    }, []);

    if (!currentUser.screened || !companyStructure) {
        return <Redirect to="/onboarding" />;
    } else if (!section) {
        return <Redirect to="/onboarding/my-documents" />;
    }

    if (!loadedCompanyStructure) {
        return null;
    }

    let title;
    let subTitle;
    let heading;
    let fields: any;
    let icon: any;
    let subIcon: any;
    let structure: any;

    if (section === 'company-details') {
        title = 'Company details';
        subTitle = 'Please confirm or edit information';
        heading = "All you need to do is make sure the auto-filled information is correct, and fill in anything that is missing and confirm. That's it!";
        icon = IconCompany;
        subIcon = IconEdit;

        fields = CompanyDetails.slice(0);

        //add in non-required fields
        fields.splice(1, 0, 'doingBusinessAsName');
        fields.splice(8, 0, 'incorporationAddress.fullAddress');

        structure = [
            { type: FormInput, label: 'Company Name' },
            { type: FormInput, label: 'Doing business as name (if different)' },
            { type: FormInput, label: 'Company primary website', noConfirm: true },
            { type: FormInput, label: 'Company contact email', noConfirm: true },
            { type: FormInput, label: 'Company contact number', noConfirm: true },
            { type: FormInput, label: 'Company type', noConfirm: true },
            { type: FormInput, label: 'Primary address', noConfirm: true },
            { type: FormInput, label: 'Registered address', noConfirm: true },
            { type: FormInput, label: 'Incorporation address (if different)', noConfirm: true },
            { type: FormInput, label: 'Incorporation country', noConfirm: true },
            { type: FormInput, label: 'Incorporation date', noConfirm: true },
            { type: FormInput, label: 'Company Registration number', noConfirm: true },
            { type: FormInput, label: 'Tax Residence Country', noConfirm: true },
            { type: FormInput, label: 'Company tax number', noConfirm: true },
            { type: FormInput, label: 'Company VAT number', noConfirm: true },
        ];
    } else if (section === 'business-details') {
        title = 'Business details';
        subTitle = 'Please confirm or edit information';
        heading = "All you need to do is make sure the auto-filled information is correct, and fill in anything that is missing and confirm. That's it!";
        icon = IconBusiness;
        subIcon = IconEdit;

        fields = BusinessDetails.slice(0);

        structure = [
            { type: FormInput, label: 'Company NAICS Code', noConfirm: true },
            { type: FormInput, label: 'NAICS Description', noConfirm: true },
            { type: FormInput, label: 'Countries of Primary business operations', noConfirm: true },
            { type: FormInput, label: 'Number of business locations', noConfirm: true },
            { type: FormInput, label: 'Revenue Currency', noConfirm: true },
            { type: FormInput, label: 'Revenue Amount', noConfirm: true },
            { type: FormInput, label: 'Funding Sources', noConfirm: true },
            { type: FormInput, label: 'Revenue Sources', noConfirm: true },
            { type: FormInput, label: 'Number of employees', noConfirm: true },
            { type: FormCheckboxGroup, label: 'I confirm the Company is not based at home?', noConfirm: true },
            { type: FormCheckboxGroup, label: 'I confirm the Company has had no material mergers', noConfirm: true },
            { type: FormCheckboxGroup, label: 'I confirm the Company has had no material change in business activity', noConfirm: true },
            { type: FormCheckboxGroup, label: 'I confirm the company does not allow the issuance of Bearer Shares', noConfirm: true },
            { type: FormCheckboxGroup, label: 'I confirm the Company is not an internet only business', noConfirm: true },
            { type: FormCheckboxGroup, label: 'I confirm the Company is not a Special Purpose Vehicle', noConfirm: true },
            { type: FormCheckboxGroup, label: 'I confirm the Company does not hold Client Funds', noConfirm: true },
            { type: FormCheckboxGroup, label: 'I confirm the Company is not a payment Intermediary', noConfirm: true },
            { type: FormCheckboxGroup, label: 'I confirm the company has no business dealings with North Korea, Sudan, Iran, Syria, the Crimea Region' },
        ];
    } else if (section === 'company-documents') {
        title = 'Documents to upload';
        subTitle = 'Please upload documents';
        icon = IconDocuments;
        subIcon = IconUpload;

        fields = CompanyDocuments.slice(0);

        const docsRequired = companyDocsValidation(currentUser, companyStructure);

        structure = [
            { type: FormUploader, label: 'Attach audited financial statements', tooltip: 'Why do we need this??', show: docsRequired.indexOf(fields[0]) > -1 },
            { type: FormUploader, label: 'Attach Romanian Fiscal Certificate', tooltip: 'Why do we need this??', show: docsRequired.indexOf(fields[1]) > -1 },
            { type: FormUploader, label: 'Attach evidence of edited company structure', tooltip: 'Why do we need this??', show: docsRequired.indexOf(fields[2]) > -1 },
        ];
    }

    const saveCompanyDetails = async () => {
        showLoader('Saving');

        fields.map(async (source: any) => {
            let value = companyStructure[source];
            let fieldToUpdate = source;

            // if (structure[fields.indexOf(source)].type === FormUploader) {
            //     value = { [source]: companyStructure.verification && companyStructure.verification[source] };
            //     console.log('FormUplaoder', value, source, companyStructure.verification[source])
            //     fieldToUpdate = 'verification';
            // }

            const sourceString = source.split('.')
            if (sourceString.length > 1) {
                value = companyStructure[sourceString[0]] ? companyStructure[sourceString[0]][sourceString[1]] : null;
            }

            await apiEditField(companyStructure.docId, fieldToUpdate, value, currentUser.localId);
        })

        hideLoader();
        history.push('/onboarding/my-documents', { prevPath: 'Company' });
    }

    const handleUpload = (src: string, base64File: any) => {
        saveEditField(`${src}.value`, base64File)
    }

    const explodeValue = (field: string) => {
        let value: string;
        const fieldParts = field.split('.');
        if (fieldParts.length === 2) {
            value = getValue(loadedCompanyStructure[fieldParts[0]]?.[fieldParts[1]]);
        } else {
            value = getValue(loadedCompanyStructure[field]);
        }

        return value;
    }

    return (
        <MainStyled.MainSt className="company">
            <SetupStatus markets={currentUser.markets} />

            <MainStyled.ContentNarrow>
                <Box centered paddedLarge>
                    <Styled.Intro>
                        <Icon icon={icon} subIcon={subIcon} style={'company'} />
                        <Styled.HeaderName>{title}</Styled.HeaderName>
                    </Styled.Intro>

                    <h1 className="center">{subTitle}</h1>
                    {heading && <Styled.SubHeading className="center">{heading}</Styled.SubHeading>}

                    <Styled.Inputs>
                        <Blocks>
                            {fields
                                .map((item: any, count: number) => {
                                    return {
                                        field: item,
                                        ...structure[count]
                                    }
                                })
                                .filter((item: any) => {
                                    const value = explodeValue(item.field);

                                    return (
                                        (
                                            !item.noConfirm ||
                                            (item.noConfirm === true && (value === '' || value === undefined || value === null))
                                        ) && item.show !== false
                                    )
                                })
                                .map((item: any, count: number) => {

                                    const config: { [key: string]: any } = {
                                        key: `input-${count}`,
                                        stateKey: `${item.field}.value`,
                                        id: item.field,
                                        onChange: saveEditField,
                                    };

                                    if (item.type === FormInput) {
                                        config.label = item.label;
                                        config.value = explodeValue(item.field);
                                        config.isEdit = true;
                                        config.validated = hasValue(companyStructure, item.field);
                                    } else if (item.type === FormCheckboxGroup) {
                                        config.options = [{ label: 'Yes', value: false }, { label: 'No', value: true }];
                                        config.selected = getValue(companyStructure[item.field]);
                                    } else if (item.type === FormUploader) {
                                        config.onUpload = handleUpload;
                                        config.uploaded = companyStructure[item.field] && companyStructure[item.field].value;
                                        config.onClearUpload = () => saveEditField(`${item.field}.value`, null);
                                    }

                                    return (
                                        <div key={`field-${count}`}>
                                            {item.type !== FormInput &&
                                                <FormLabel
                                                    label={item.label}
                                                    alignment={'left'}
                                                    tooltip={item.tooltip}
                                                    style={item.type !== FormUploader ? 'normal' : 'bold'}
                                                />
                                            }
                                            <item.type {...config} />
                                        </div>
                                    );
                                })
                            }

                            <Actions centered>
                                <Button small onClick={saveCompanyDetails} label={'Confirm'} />
                                <Button small type={'secondary'} onClick={() => history.push('/onboarding/my-documents', { prevPath: 'Company' })} label={'Cancel'} />
                            </Actions>
                        </Blocks>
                    </Styled.Inputs>
                </Box>
            </MainStyled.ContentNarrow>
        </MainStyled.MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    currentUser: state.auth.user,
    companyStructure: state.screening.companyStructure,
});

const actions = { showLoader, hideLoader, saveEditField };

export const RawComponent = MyDocumentsCompany;

export default connect(mapStateToProps, actions)(withRouter(MyDocumentsCompany));
