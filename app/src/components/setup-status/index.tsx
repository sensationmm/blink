import React from "react";
import classNames from 'classnames';
import { Link, withRouter } from 'react-router-dom';
import { RouteComponentProps } from "react-router";

import getByValue from '../../utils/functions/getByValue';
import ArrowBack from '../../svg/arrow-back.svg';
import BlinkLogo from '../../svg/blink-logo.svg';

import User from '../../containers/User';

import { blinkMarkets } from '../../utils/config/blink-markets';

import * as Styled from './styles';

interface SetupStatusProps extends RouteComponentProps {
    company?: string;
    markets?: string[];
}

export const steps = [
    { label: 'Select country to open account in', url: '/onboarding/select-markets' },
    { label: 'Confirm company structure', url: '/onboarding/my-company' },
    { label: 'Data & documents completed', url: '/onboarding/my-documents' },
    { label: 'Accounts opened', url: '/onboarding/my-accounts' },
];

const SetupStatus: React.FC<SetupStatusProps> = ({ company, markets, location }) => {
    let path: any = location.pathname;
    path = path.split('/');
    path = path.splice(0, 3);
    path = path.join('/');
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

                            {step.url === '/onboarding/my-accounts' && markets &&
                                <Styled.Flags>
                                    {markets.map((market: any, count: number) => {
                                        const flag = getByValue(blinkMarkets, 'code', market).flag;
                                        return <img key={`market-${count}`} src={flag} alt={market.name} />
                                    })}
                                </Styled.Flags>
                            }
                        </Styled.NavItem>
                    )
                })
                }
            </Styled.Nav>

            {prevStep && <Styled.Back><Link to={prevStep.url}><img alt="Previous" src={ArrowBack} /></Link></Styled.Back>}
        </Styled.Main >
    );
};

export default withRouter(SetupStatus);

