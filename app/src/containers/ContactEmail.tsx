import React, { useState } from "react";
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import * as MainStyled from "../components/styles";
import ScreeningStatus from '../components/screening-status';
import getValue from '../utils/functions/getValue';
import IconEmail from '../svg/icon-email.svg';
import Button from '../components/button';
import Actions from '../layout/actions';
import capitalize from '../utils/functions/capitalize';

import { showLoader, hideLoader } from '../redux/actions/loader';
import { userSignUp } from '../utils/auth/request';

const Email = styled.div`
    width: 910px;
    box-shadow: 0px 0px 10px var(--basic-shadow);

    .ql-editor p {
        margin-bottom: 20px;
        font-size: 16px;
    }
`;

const ContactEmail = (props: any) => {
    const {
        company,
        companyStructure,
        validation,
        history,
        markets,
        showLoader,
        hideLoader,
        contact,
        currentUser
    } = props;

    const name = contact?.name || '';
    const firstName = capitalize(name.substr(0, name.indexOf(' ')));

    const [emailText, setEmailText] = useState(`<p>Hi ${firstName}!</p><p><p>At Blink we support companies with global ambition, helping scale their business without the headache of traditional financial services.</p><p>So when we heard about ${getValue(companyStructure.name)}'s plans we knew we had to be a part of the story. We have already done the groundwork and you are ready to open a new business bank account in minutes.</p><p>Let's do this!</p>`);

    if (!company || !companyStructure || markets.length === 0) {
        return <Redirect to="/search" />;
    } else if (!validation) {
        return <Redirect to="/company-structure" />;
    } else if (!contact) {
        return <Redirect to="/contact-client" />;
    }

    const sendEmail = async () => {
        showLoader();

        const user = {
            personDocId: contact!.id,
            companyDocId: companyStructure.docId,
            email: contact!.email,
            name: capitalize(contact!.name)
        }

        const result = await userSignUp([user], emailText, currentUser);

        // leave this console - we need it to get the signin link
        if (window.location.href.startsWith("http://localhost" || window.location.href.startsWith("https://blink-staging-20006.firebaseapp.com/"))) {
            console.log(result)
        }

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
                <Email>
                    <table style={{ width: "910px", borderSpacing: 0 }} cellPadding="0" cellSpacing="0"><tr><td><table style={{ width: "100%", borderSpacing: 0 }} cellPadding="0" cellSpacing="0"><tr><td><img style={{ display: 'block' }} src="https://firebasestorage.googleapis.com/v0/b/blink-staging-20006.appspot.com/o/email-1a.gif?alt=media&token=bf099aef-7231-405d-ae60-acfaf6037192" /></td><td><img style={{ display: 'block' }} src="https://firebasestorage.googleapis.com/v0/b/blink-staging-20006.appspot.com/o/email-1b.gif?alt=media&token=645b11b0-1a12-472b-9215-ee56b11426aa" /></td></tr><tr><td><img style={{ display: 'block' }} src="https://firebasestorage.googleapis.com/v0/b/blink-staging-20006.appspot.com/o/email-2a.gif?alt=media&token=b862caa5-445a-49b1-ba2f-e86e572ab6d9" /></td><td><img style={{ display: 'block' }} src="https://firebasestorage.googleapis.com/v0/b/blink-staging-20006.appspot.com/o/email-2b.gif?alt=media&token=a8943e60-f6b9-454e-9340-cf5ce70f6d2b" /></td></tr></table></td></tr><tr><td style={{ padding: '20px 30px', background: '#f6feff', fontFamily: 'Avenir, Times' }}>

                        <ReactQuill theme="snow" value={emailText} onChange={setEmailText} modules={{ toolbar: null }} />

                    </td></tr><tr><td><img style={{ display: 'block' }} src="https://firebasestorage.googleapis.com/v0/b/blink-staging-20006.appspot.com/o/email-3.gif?alt=media&token=a0e1a76d-6b5f-44b9-ab80-3f0abdba241a" /></td></tr><tr><td><img style={{ display: 'block' }} src="https://firebasestorage.googleapis.com/v0/b/blink-staging-20006.appspot.com/o/email-4.gif?alt=media&token=91c4ac10-8009-4978-ba24-613d5f096718" /></td></tr><tr><td><img style={{ display: 'block' }} src="https://firebasestorage.googleapis.com/v0/b/blink-staging-20006.appspot.com/o/email-5.gif?alt=media&token=f9091400-949c-49e0-89fb-f96fa4a0184b" /></td></tr><tr><td style={{ background: '#fff', textAlign: 'center', paddingBottom: '30px' }}><img style={{ display: 'block' }} src="https://firebasestorage.googleapis.com/v0/b/blink-staging-20006.appspot.com/o/email-2a.gif?alt=media&token=b862caa5-445a-49b1-ba2f-e86e572ab6d9" /></td></tr></table>
                </Email>

                <Actions>
                    <Button onClick={sendEmail} label={'Send'} icon={IconEmail} />
                    <Button type={'tertiary'} onClick={() => history.push('/contact-client')} label={'Back to contact client'} />
                </Actions>
            </MainStyled.ContentNarrow>
        </MainStyled.MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    currentUser: state.auth.user.localId,
    markets: state.screening.markets,
    company: state.screening.company,
    companyStructure: state.screening.companyStructure,
    validation: state.screening.validation,
    contact: state.screening.contact
});

const actions = { showLoader, hideLoader };

export const RawComponent = ContactEmail;

export default connect(mapStateToProps, actions)(withRouter(ContactEmail));
