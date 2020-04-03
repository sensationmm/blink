import React from "react";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';

import getValue from '../utils/functions/getValue';

import SetupStatus from '../components/setup-status';
import Icon from '../components/icon';
import ActionBar from '../components/action-bar';
import TabNav from '../components/tab-nav';
import Box from '../layout/box';
import Blocks from '../layout/blocks';

import ShareholderIcon from '../svg/individual-icon.svg';
import * as MainStyled from "../components/styles";
import * as Styled from './my-documents.styles';

const MyDocuments = (props: any) => {
    const {
        company,
        companyStructure,
        ownershipThreshold,
        history
    } = props;

    const shareholders = companyStructure.distinctShareholders.filter((shareholder: any) => shareholder.totalShareholding > ownershipThreshold && getValue(shareholder.shareholderType) === 'P');

    return (
        <MainStyled.MainSt>
            <SetupStatus />

            <MainStyled.ContentNarrow>
                <h1 className="center">Please complete all company and personal information to open the accounts</h1>
                <h2 className="center">
                    We have identified {shareholders.length} {shareholders.length === 1 ? 'UBO' : 'UBOs'} from {company.name} company structure which require ID checks
                </h2>

                <TabNav
                    items={[
                        {
                            label: 'People',
                            content: (
                                <Blocks gutter={'small'}>
                                    {shareholders.map((shareholder: any, count: 0) => {

                                        const sources = [
                                            shareholder.verification && shareholder.verification.passport,
                                            shareholder.verification && shareholder.verification.utilityBill,
                                            shareholder.countryOfTaxResidence,
                                            shareholder.taxId,
                                            shareholder.role
                                        ];

                                        let completed = 0;
                                        sources.forEach(source => {
                                            if (
                                                source
                                                && (
                                                    (source.value !== null && source.value !== undefined) ||
                                                    (
                                                        source !== null &&
                                                        source !== undefined &&
                                                        source.substring(0, 5) !== 'Notif'
                                                    )
                                                )
                                            ) {
                                                completed++;
                                            }
                                        });

                                        let notificationSent = false;
                                        if (shareholder.verification) {
                                            if (shareholder.verification.passport && shareholder.verification.passport.substring(0, 5) === 'Notif') {
                                                notificationSent = shareholder.verification.passport;
                                            } else if (shareholder.verification.utilityBill && shareholder.verification.utilityBill.substring(0, 5) === 'Notif') {
                                                notificationSent = shareholder.verification.utilityBill;
                                            }
                                        }

                                        return (
                                            <Styled.Entry
                                                key={`box-${count}`}
                                                onClick={() => history.push(`/onboarding/my-documents/${shareholder.docId}`)}
                                            >
                                                <Box paddedLarge shadowed>
                                                    <Styled.Progress>
                                                        <Styled.Header>
                                                            <Icon icon={ShareholderIcon} style={'person'} />
                                                            <div>
                                                                <Styled.HeaderName>{getValue(shareholder.name)}</Styled.HeaderName>
                                                                <Styled.HeaderRole>UBO</Styled.HeaderRole>
                                                            </div>
                                                        </Styled.Header>

                                                        <div>
                                                            {completed !== 5
                                                                ? (!notificationSent ? 'Needs completing' : notificationSent)
                                                                : 'Completed'
                                                            }
                                                        </div>

                                                        <div><Styled.Bubble className={classNames({ complete: completed === 5 })}>{completed}/5</Styled.Bubble></div>
                                                    </Styled.Progress>
                                                </Box>
                                            </Styled.Entry>
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
                            content: <Box>Coming Soon</Box>
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
