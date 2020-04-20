import React from "react";
import classNames from 'classnames';
import { Link, withRouter } from 'react-router-dom';
import { RouteComponentProps } from "react-router";

import getByValue from '../../utils/functions/getByValue';
import ArrowBack from '../../svg/arrow-back.svg';
import BlinkLogo from '../../svg/blink-logo.svg';

import Box from '../../layout/box';

import User from '../../containers/User';


import * as Styled from './styles';

interface ScreeningStatusProps extends RouteComponentProps {
    company?: string;
    country?: string;
}

export const steps = [
    { label: 'Search', url: '/search' },
    { label: 'Company structure', url: '/company-structure' },
    { label: 'Company readiness', url: '/company-readiness' },
    { label: 'Missing data', url: '/missing-data' },
    { label: 'Company readiness', url: '/company-completion' },
    { label: 'Contact client', url: '/contact-client' },
];

const ScreeningStatus: React.FC<ScreeningStatusProps> = ({ company, country, location }) => {
    const path = location.pathname;
    const currentStep = steps.indexOf(getByValue(steps, 'url', path));
    const prevStep = steps[currentStep - 1] || null;

    return (
        <Styled.Main>
            <Styled.Header>
                <img alt="blink" src={BlinkLogo} />
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

            <Styled.Info>
                {prevStep ? <Styled.Title>
                    <Link to={prevStep.url}><img alt="" src={ArrowBack} /></Link>
                    <h1>{steps[currentStep].label}</h1>
                </Styled.Title> : <div />}

                {company &&
                    <Box>
                        <Styled.CompanyInfo>
                            <div>Company <span>{company}</span></div>
                            <div>Country <span>{country}</span></div>
                        </Styled.CompanyInfo>
                    </Box>
                }
            </Styled.Info>
        </Styled.Main >
    );
};

export default withRouter(ScreeningStatus);

