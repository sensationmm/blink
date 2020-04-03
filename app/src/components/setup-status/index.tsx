import React from "react";
import classNames from 'classnames';
import { Link, withRouter } from 'react-router-dom';
import { RouteComponentProps } from "react-router";

import getByValue from '../../utils/functions/getByValue';
import ArrowBack from '../../svg/arrow-back.svg';
import BlinkLogo from '../../svg/blink-logo.svg';

import User from '../../containers/User';

import * as Styled from './styles';

interface SetupStatusProps extends RouteComponentProps {
    company?: string;
    country?: string;
}

export const steps = [
    { label: 'Select country to open account in', url: '/onboarding/select-markets' },
    { label: 'Confirm company structure', url: '/onboarding/my-company' },
    { label: 'Data & documents completed', url: '/onboarding/my-documents' },
    { label: 'Accounts opened', url: '/onboarding/my-accounts' },
];

const SetupStatus: React.FC<SetupStatusProps> = ({ company, country, location }) => {
    const path = location.pathname;
    const currentStep = steps.indexOf(getByValue(steps, 'url', path));
    const prevStep = steps[currentStep - 1] || null;

    return (
        <Styled.Main>
            <Styled.Header>
                <img src={BlinkLogo} />
                <User />
            </Styled.Header>
            <Styled.Nav>
                {steps.map((step, count) => {
                    return (
                        <Styled.NavItem
                            to={step.url}
                            key={`nav-item-${count}`}
                            className={classNames({ active: currentStep >= count })}
                            onClick={(e) => { if (count > currentStep) { e.preventDefault(); return false; } }}
                        >
                            {step.label}
                        </Styled.NavItem>
                    )
                })
                }
            </Styled.Nav>

            {prevStep && <Styled.Back><Link to={prevStep.url}><img src={ArrowBack} /></Link></Styled.Back>}
        </Styled.Main >
    );
};

export default withRouter(SetupStatus);

