import React from "react";
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import getByValue from '../../utils/functions/getByValue';
import ArrowBack from '../../svg/arrow-back.svg';
import BlinkLogo from '../../svg/blink-logo.svg';

import * as Styled from './styles';

interface ScreeningStatusProps {
    activeStep: string;
    company?: string;
    country?: string;
}

export const steps = [
    { label: 'Search', url: '/search' },
    { label: 'Company structure', url: '/company-structure' },
    { label: 'Company readiness', url: '/company-readiness' },
    { label: 'Missing data', url: '/missing-data' },
    { label: 'Contact client', url: '/contact-client' },
];

const ScreeningStatus: React.FC<ScreeningStatusProps> = ({ activeStep, company, country }) => {
    const currentStep = steps.indexOf(getByValue(steps, 'url', activeStep));
    const prevStep = steps[currentStep - 1] || null;

    return (
        <Styled.Main>
            <Styled.Header><img src={BlinkLogo} /></Styled.Header>
            <Styled.Nav>
                {steps.map((step, count) => {
                    return (
                        <Styled.NavItem key={`nav-item-${count}`} className={classNames({ active: currentStep >= count })}>
                            {step.label}
                        </Styled.NavItem>
                    )
                })
                }
            </Styled.Nav>

            <Styled.Info>
                {prevStep ? <Styled.Title>
                    <Link to={prevStep.url}><img src={ArrowBack} /></Link>
                    <h1>{steps[currentStep].label}</h1>
                </Styled.Title> : <div />}

                {company &&
                    <Styled.CompanyInfo>
                        <div>Company <span>{company}</span></div>
                        <div>Country <span>{country}</span></div>
                    </Styled.CompanyInfo>
                }
            </Styled.Info>
        </Styled.Main >
    );
};

export default ScreeningStatus;

