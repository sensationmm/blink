import React, { useState } from "react";
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';

import * as MainStyled from "../components/styles";
import ScreeningStatus from '../components/screening-status';
import getValue from '../utils/functions/getValue';
import IconEmail from '../svg/icon-email.svg';
import Button from '../components/button';
import Actions from '../layout/actions';
import Box from '../layout/box';
import Blocks from '../layout/blocks';
import capitalize from '../utils/functions/capitalize';
import Icon from '../components/icon';
import FormInput from '../components/form-input';

import { editField as saveEditField, setCompanyContact } from '../redux/actions/screening';
import { editField as apiEditField } from '../utils/validation/request';
import { showLoader, hideLoader } from '../redux/actions/loader';
import { userSignUp } from '../utils/auth/request';

import IconPerson from '../svg/individual-icon.svg';
import * as Styled from './my-documents.styles';
import * as ClientStyled from './contact-client.styles';

interface SelectedOfficer {
    id: string;
    email: string;
    name: string;
}

const ContactClient = (props: any) => {
    const {
        company,
        companyStructure,
        validation,
        history,
        markets,
        saveEditField,
        showLoader,
        hideLoader,
        setCompanyContact,
        currentUser
    } = props;

    const [selectedOfficer, setSelectedOfficer] = useState(null);

    const contact: SelectedOfficer | null = selectedOfficer;

    if (!company || !companyStructure || markets.length === 0) {
        return <Redirect to="/search" />;
    } else if (!validation) {
        return <Redirect to="/company-structure" />;
    }

    const sendEmail = async () => {
        showLoader();

        setCompanyContact(contact!.name);

        const user = {
            personDocId: contact!.id,
            companyDocId: companyStructure.docId,
            email: contact!.email
        }

        await userSignUp([user], currentUser);

        hideLoader();
        history.push('/screening-complete');
    }

    return (
        <MainStyled.MainSt>
            <ScreeningStatus
                company={getValue(companyStructure.name)}
                country={getValue(companyStructure.incorporationCountry)}
            />

            <MainStyled.ContentNarrow>
                <Blocks>
                    {companyStructure.officers.map((officer: any, count: number) => {
                        return (
                            <Officer
                                key={`officer-${count}`}
                                officer={officer}
                                onChange={saveEditField}
                                showLoader={showLoader}
                                hideLoader={hideLoader}
                                onClick={setSelectedOfficer}
                                selected={contact && contact!.id === officer.docId}
                            />
                        );
                    })}
                </Blocks>

                <Actions>
                    <Button onClick={sendEmail} label={'Send email to client'} icon={IconEmail} disabled={selectedOfficer === null} />
                    <Button type={'tertiary'} onClick={() => history.push('/company-readiness')} label={'Back to edit'} />
                </Actions>
            </MainStyled.ContentNarrow>
        </MainStyled.MainSt>
    )
}

const Officer = (props: any) => {
    const { officer, onChange, showLoader, hideLoader, onClick, selected } = props;
    const email = officer.emailAddress?.value || '';
    const [hasEmail, setEmail] = useState(email !== '');

    const onSave = async () => {
        showLoader();
        await apiEditField(officer.docId, 'emailAddress', { value: email });
        setEmail(true);
        hideLoader();
    }

    const chooseOfficer = () => {
        if (hasEmail) {
            onClick({
                id: officer.docId,
                email: email,
                name: officer.fullName.value
            });
        }
    }

    return (
        <ClientStyled.Item className={classNames({ disabled: !hasEmail }, { selected: selected })} onClick={chooseOfficer}>
            <Box shadowed paddedLarge>
                <Styled.Progress>
                    <Styled.Header>
                        <Icon icon={IconPerson} style={'person'} />
                        <div>
                            <Styled.HeaderName>{capitalize(officer.fullName?.value)}</Styled.HeaderName>
                            <Styled.HeaderRole>{officer.title ? officer.title : 'officer'}</Styled.HeaderRole>
                        </div>
                    </Styled.Header>

                    <div>
                        {hasEmail
                            ? <Styled.Status>{email}</Styled.Status>
                            : <FormInput
                                label={''}
                                placeholder={'Email address required'}
                                stateKey={'emailAddress.value'}
                                onChange={(field: any, value: any) => onChange(field, value, "officers", officer.docId)}
                                value={email}
                                isEdit
                                onBlur={onSave}
                            />
                        }
                    </div>

                </Styled.Progress>
            </Box>
        </ClientStyled.Item>

    )
}

const mapStateToProps = (state: any) => ({
    currentUser: state.auth.user.localId,
    markets: state.screening.markets,
    company: state.screening.company,
    companyStructure: state.screening.companyStructure,
    validation: state.screening.validation,
});

const actions = { showLoader, hideLoader, setCompanyContact, saveEditField };

export const RawComponent = ContactClient;

export default connect(mapStateToProps, actions)(withRouter(ContactClient));
