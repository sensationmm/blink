import React, { useState } from "react";
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';

import getValue from '../utils/functions/getValue';

import SetupStatus from '../components/setup-status';
import Icon from '../components/icon';
import ActionBar from '../components/action-bar';
import TabNav from '../components/tab-nav';
import Box from '../layout/box';
import Blocks from '../layout/blocks';

import IconDocuments from '../svg/icon-documents.svg';
import IconBusiness from '../svg/icon-business.svg';
import IconPerson from '../svg/individual-icon.svg';
import IconCompany from '../svg/company-icon.svg';
import IconEdit from '../svg/icon-edit.svg';
import IconUpload from '../svg/icon-upload.svg';

import * as MainStyled from "../components/styles";
import * as Styled from './my-documents.styles';

const Person = [
    'verification.passport',
    'verification.utilityBill',
    'countryOfTaxResidence',
    'taxId',
    'role'
];

export const CompanyDetails = [
    'name',
    'primaryWebsite',
    'contactEmail',
    'phoneNumber',
    'type',
    'primaryAddress',
    'registeredAddress',
    'countryCode',
    'incorporationDate',
    'companyId',
    'countryOfTaxResidence',
    'taxId',
    'vatId',
];

export const BusinessDetails = [
    'NAICSCode',
    'natureOfBusiness',
    'countriesOfPrimaryBusinessOperations',
    'numberofLocationsOrBranches',
    'revenueCurrency',
    'revenue',
    'fundingSources',
    'revenueSources',
    'numberOfEmployees',
    'homeBasedBusiness',
    'materialMergers',
    'materialChangeInBusinessActivity',
    'bearerShareClientAttestation',
    'isInternetOnlyBusiness',
    'isSpecialPurposeVehicle',
    'holdClientFunds',
    'paymentIntermediaryCheckPassed',
    'sanctionsCountryChecksPassed',
];

export const CompanyDocuments = [
    'financialStatement',
    'romanianFiscalCertificate',
];

const Entry = (props: any) => {
    return (
        <Styled.Entry
            onClick={props.onClick}
        >
            <Box paddedLarge shadowed>
                <Styled.Progress>
                    <Styled.Header>
                        <Icon icon={props.icon} style={props.type} subIcon={props.subIcon} />
                        <div>
                            <Styled.HeaderName>{props.title}</Styled.HeaderName>
                            {props.subTitle && <Styled.HeaderRole>{props.subTitle}</Styled.HeaderRole>}
                        </div>
                    </Styled.Header>

                    <div>{props.status}</div>

                    <div>
                        <Styled.Bubble className={classNames({ complete: props.completed === props.total })}>
                            {props.completed}/{props.total}
                        </Styled.Bubble>
                    </div>
                </Styled.Progress>
            </Box>
        </Styled.Entry>
    )
}

const MyDocuments = (props: any) => {
    const {
        company,
        companyStructure,
        ownershipThreshold,
        history
    } = props;

    const [section, setSection] = useState('People');

    if (!company || !companyStructure) {
        return <Redirect to="/onboarding" />;
    }

    const shareholders = companyStructure.distinctShareholders.filter((shareholder: any) => shareholder.totalShareholding > ownershipThreshold && getValue(shareholder.shareholderType) === 'P');

    const confirmDone = (object: any, sources: any) => {
        let completed = 0;

        sources.map((source: any) => {
            let value = object && object[source];

            const sourceString = source.split('.')
            if (sourceString.length > 1) {
                value = object[sourceString[0]] ? object[sourceString[0]][sourceString[1]] : null;
            }

            if (
                value
                && (
                    (value.value !== null && value.value !== undefined) ||
                    (
                        value !== null &&
                        value !== undefined &&
                        (typeof value === 'string' && value.substring(0, 5) !== 'Notif')
                    )
                )) {
                completed++;
            }
        });

        return completed;
    }

    return (
        <MainStyled.MainSt className={classNames('hasActionBar', { person: section === 'People' }, { company: section === 'Company' })}>
            <SetupStatus />

            <MainStyled.ContentNarrow>
                <h1 className="center">Please complete all company and personal information to open the accounts</h1>

                <TabNav
                    onChange={setSection}
                    items={[
                        {
                            label: 'People',
                            content: (
                                <Blocks gutter={'small'}>
                                    <h2 className="center">
                                        We have identified {shareholders.length} {shareholders.length === 1 ? 'UBO' : 'UBOs'} from {company.name} company structure which require ID checks
                                </h2>
                                    {shareholders.map((shareholder: any, count: 0) => {
                                        const completed = confirmDone(shareholder, Person);

                                        let notificationSent = false;
                                        if (shareholder.verification) {
                                            if (shareholder.verification.passport && shareholder.verification.passport.substring(0, 5) === 'Notif') {
                                                notificationSent = shareholder.verification.passport;
                                            } else if (shareholder.verification.utilityBill && shareholder.verification.utilityBill.substring(0, 5) === 'Notif') {
                                                notificationSent = shareholder.verification.utilityBill;
                                            }
                                        }

                                        return (
                                            <Entry
                                                icon={IconPerson}
                                                key={`box-${count}`}
                                                onClick={() => history.push(`/onboarding/my-documents/${shareholder.docId}`)}
                                                type={'person'}
                                                title={getValue(shareholder.name)}
                                                subTitle={'UBO'}
                                                status={
                                                    completed !== 5
                                                        ? (!notificationSent ? 'Needs completing' : notificationSent)
                                                        : 'Completed'
                                                }
                                                total={5}
                                                completed={completed}
                                            />
                                        )
                                    })}

                                    <Box add centered paddedLarge shadowed>
                                        Add additional people such as CEOs or CFOs of {company.name}
                                    </Box>
                                </Blocks>
                            )
                        },
                        {
                            label: 'Company',
                            content: (
                                <Blocks gutter={'small'}>
                                    <h2 className="center">We have auto filled most of the company information required to make it as easy as possible for you to complete this step</h2>
                                    <Entry
                                        icon={IconCompany}
                                        subIcon={IconEdit}
                                        onClick={() => history.push('/onboarding/my-documents/company/company-details')}
                                        type={'company'}
                                        title={'Company details'}
                                        status={
                                            confirmDone(companyStructure, CompanyDetails) !== CompanyDetails.length
                                                ? 'Needs completing'
                                                : 'Completed'
                                        }
                                        total={CompanyDetails.length}
                                        completed={confirmDone(companyStructure, CompanyDetails)}
                                    />

                                    <Entry
                                        icon={IconBusiness}
                                        subIcon={IconEdit}
                                        onClick={() => history.push('/onboarding/my-documents/company/business-details')}
                                        title={'Business details'}
                                        status={
                                            confirmDone(companyStructure, BusinessDetails) !== BusinessDetails.length
                                                ? 'Needs completing'
                                                : 'Completed'
                                        }
                                        total={BusinessDetails.length}
                                        completed={confirmDone(companyStructure, BusinessDetails)}
                                    />

                                    <Entry
                                        icon={IconDocuments}
                                        subIcon={IconUpload}
                                        onClick={() => history.push('/onboarding/my-documents/company/company-documents')}
                                        type={'company'}
                                        title={'Documents to upload'}
                                        status={
                                            confirmDone(companyStructure.verification, CompanyDocuments) !== CompanyDocuments.length
                                                ? 'Needs completing'
                                                : 'Completed'
                                        }
                                        total={CompanyDocuments.length}
                                        completed={confirmDone(companyStructure.verification, CompanyDocuments)}
                                    />
                                </Blocks>
                            )
                        }
                    ]}
                />
            </MainStyled.ContentNarrow>

            <ActionBar
                labelPrimary={'Open accounts!'}
                actionPrimary={() => history.push('/onboarding/my-accounts')}
                disabledPrimary={true}
                labelSecondary={'Complete later'}
                actionSecondary={() => { }}
                disabledSecondary={true}
            />
        </MainStyled.MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    sideTrayOpen: state.sideTray.open,
    company: state.screening.company,
    companyStructure: state.screening.companyStructure,
    ownershipThreshold: state.screening.ownershipThreshold,
});

export const RawComponent = MyDocuments;

export default connect(mapStateToProps, null)(withRouter(MyDocuments));
