import React from "react";
import { withRouter } from 'react-router-dom';

import Button from '../components/button';
import Actions from '../layout/actions';

import * as MainStyled from "../components/styles";

import TemplateUser from '../templates/user';
import HeaderComplete from '../svg/header-complete.svg';

const IDCheckComplete = (props: any) => {
    const {
        history,
    } = props;

    return (
        <TemplateUser headerIcon={HeaderComplete}>

            <MainStyled.ContentNarrow>
                <h1 className={'center'}>ID Check complete!<br />Let's get you up and running as soon as possible</h1>

                <Actions centered>
                    <Button onClick={() => history.push('/onboarding/select-markets')} label={'Continue'} />
                </Actions>

            </MainStyled.ContentNarrow>
        </TemplateUser>
    )
}

export default withRouter(IDCheckComplete);
