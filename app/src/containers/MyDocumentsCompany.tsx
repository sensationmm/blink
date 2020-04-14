import React  from "react";
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

import { CompanyDetails, BusinessDetails, CompanyDocuments } from './MyDocuments';

const MyDocumentsPerson = (props: any) => {
    const {
        companyStructure,
        history,
        saveEditField,
        section
    } = props;

    if (!section) {
        return <Redirect to="/onboarding/my-documents" />;
    } else if (!companyStructure) {
        return <Redirect to="/onboarding" />;
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
        heading = "All you need to do is make sure the auto-filled information is correct,<br />and fill in anything that is missing and confirm. That's it!";
        icon = IconCompany;
        subIcon = IconEdit;

        fields = CompanyDetails.slice(0);

        //add in non-required fields
        fields.splice(1, 0, 'doingBusinessAsName');
        fields.splice(8, 0, 'incorporationAddress');

        structure = [
            { type: FormInput, label: 'Company Name' },
            { type: FormInput, label: 'Doing business as name (if different)' },
            { type: FormInput, label: 'Company primary website' },
            { type: FormInput, label: 'Company contact email' },
            { type: FormInput, label: 'Company contact number' },
            { type: FormInput, label: 'Company type' },
            { type: FormInput, label: 'Primary address' },
            { type: FormInput, label: 'Registered address' },
            { type: FormInput, label: 'Incorporation address (if different)' },
            { type: FormInput, label: 'Incorporation country' },
            { type: FormInput, label: 'Incorporation date' },
            { type: FormInput, label: 'Company Registration number' },
            { type: FormInput, label: 'Country of tax residence' },
            { type: FormInput, label: 'Company tax number' },
            { type: FormInput, label: 'Company VAT number' },
        ];
    } else if (section === 'business-details') {
        title = 'Business details';
        subTitle = 'Please confirm or edit information';
        heading = "All you need to do is make sure the auto-filled information is correct,<br />and fill in anything that is missing and confirm. That's it!";
        icon = IconBusiness;
        subIcon = IconEdit;

        fields = BusinessDetails.slice(0);

        structure = [
            { type: FormInput, label: 'Company NAICS Code' },
            { type: FormInput, label: 'NAICS Description' },
            { type: FormInput, label: 'Countries of Primary business operations' },
            { type: FormInput, label: 'Number of business locations' },
            { type: FormInput, label: 'Currency' },
            { type: FormInput, label: 'Revenue' },
            { type: FormInput, label: 'Funding Sources' },
            { type: FormInput, label: 'Revenue Sources' },
            { type: FormInput, label: 'Number of employees' },
            { type: FormCheckboxGroup, label: 'I confirm the Company is not based at home?' },
            { type: FormCheckboxGroup, label: 'I confirm the Company has had no material mergers' },
            { type: FormCheckboxGroup, label: 'I confirm the Company has had no material change in business activity' },
            { type: FormCheckboxGroup, label: 'I confirm the company does not allow the issuance of Bearer Shares' },
            { type: FormCheckboxGroup, label: 'I confirm the Company is not an internet only business' },
            { type: FormCheckboxGroup, label: 'I confirm the Company is not a Special Purpose Vehicle' },
            { type: FormCheckboxGroup, label: 'I confirm the Company does not hold Client Funds' },
            { type: FormCheckboxGroup, label: 'I confirm the Company is not a payment Intermediary' },
            { type: FormCheckboxGroup, label: 'I confirm the company has no business dealings with North Korea, Sudan, Iran, Syria, the Crimea Region' },
        ];
    } else if (section === 'company-documents') {
        title = 'Documents to upload';
        subTitle = 'Please upload documents';
        icon = IconDocuments;
        subIcon = IconUpload;

        fields = CompanyDocuments.slice(0);

        structure = [
            { type: FormUploader, label: 'Attach audited financial statements', tooltip: 'Why do we need this??' },
            { type: FormUploader, label: 'Attach Romanian Fiscal Certificate', tooltip: 'Why do we need this??' },
        ];
    }

    const saveCompanyDetails = async () => {
        showLoader('Saving');

        fields.map(async (source: any) => {
            let value = companyStructure[source];
            let fieldToUpdate = source;

            if (structure[fields.indexOf(source)].type === FormUploader) {
                value = { [source]: companyStructure.verification && companyStructure.verification[source] };
                console.log('FormUplaoder', value, source, companyStructure.verification[source])
                fieldToUpdate = 'verification';
            }

            const sourceString = source.split('.')
            if (sourceString.length > 1) {
                value = companyStructure[sourceString[0]] ? companyStructure[sourceString[0]][sourceString[1]] : null;
            }

            await apiEditField(companyStructure.docId, fieldToUpdate, value || '');
        })

        hideLoader();
        history.push('/onboarding/my-documents');
    }

    const handleUpload = (src: string, base64File: any) => {
        saveEditField(`verification.${src}`, base64File)
    }

    return (
        <MainStyled.MainSt className="company">
            <SetupStatus />

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
                                .map((item: any, count: number) => {

                                    const config: { [key: string]: any } = {
                                        key: `input-${count}`,
                                        stateKey: `${item.field}.value`,
                                        id: item.field,
                                        onChange: saveEditField,
                                    };

                                    if (item.type === FormInput) {
                                        config.label = item.label;
                                        config.value = getValue(companyStructure[item.field]);
                                        config.isEdit = true;
                                        config.validated = hasValue(companyStructure, item.field);
                                    } else if (item.type === FormCheckboxGroup) {
                                        config.options = [{ label: 'Yes', value: false }, { label: 'No', value: true }];
                                        config.selected = getValue(companyStructure[item.field]);
                                    } else if (item.type === FormUploader) {
                                        config.onUpload = handleUpload;
                                        config.uploaded = companyStructure.verification && companyStructure.verification[item.field];
                                        config.onClearUpload = () => saveEditField(`verification.${item.field}`, null);
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
                                <Button small type={'secondary'} onClick={() => history.push('/onboarding/my-documents')} label={'Cancel'} />
                            </Actions>
                        </Blocks>
                    </Styled.Inputs>
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