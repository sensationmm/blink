import React from "react";
import styled from 'styled-components';

import Button from '../components/button';
import FormInput from '../components/form-input';

import Marketing1 from '../images/marketing-1.jpg';
import Marketing2 from '../images/marketing-2.jpg';
import Marketing3 from '../images/marketing-3.jpg';
import Marketing4 from '../images/marketing-4.jpg';
import Marketing5 from '../images/marketing-5.jpg';
import Marketing6 from '../images/marketing-6.jpg';
import Marketing7 from '../images/marketing-7.jpg';

import { Label } from '../components/form-label/styles';

import * as Styled from "../components/styles";

const HoldingImg = styled.img`
    position: relative;
    display: block;
    z-index: 1;
`;

const HoldingButton = styled.div`
    position: absolute;
    display: block;
    z-index: 2;
    left: 40px;
`;

const Section = styled.div`
    position: relative;
`;

const Verify = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    > div:first-child {
        margin-right: 20px;
    }

    ${Label} {
        font-size: 0.8em;
        text-transform: uppercase;
        font-weight: bold;
    }
`;

const Landing = (props: any) => {

    const {
        onClick,
        onType,
        mobileNo,
        error = false
    } = props;

    const button = <Verify>
        <FormInput
            stateKey={'mobileVerify'}
            label={'Enter mobile for verification'}
            value={mobileNo}
            onChange={onType}
            hasError={error}
            isEdit
        />
        <Button type={'landing'} onClick={onClick} label={'Start for free'} />
    </Verify>;

    return (
        <Styled.MainSt>
            <Styled.Content>
                <Section>
                    <HoldingImg src={Marketing1} />
                    <HoldingButton style={{ top: '530px' }}>{button}</HoldingButton>
                </Section>

                <Section><HoldingImg src={Marketing2} /></Section>

                <Section>
                    <HoldingImg src={Marketing3} />
                    <HoldingButton style={{ top: '590px' }}>{button}</HoldingButton>
                </Section>

                <Section>
                    <HoldingImg src={Marketing4} />
                    <HoldingButton style={{ left: '720px', top: '570px' }}>{button}</HoldingButton>
                </Section>

                <Section>
                    <HoldingImg src={Marketing5} />
                    <HoldingButton style={{ top: '530px' }}>{button}</HoldingButton>
                </Section>

                <Section>
                    <HoldingImg src={Marketing6} />
                    <HoldingButton style={{ left: '700px', top: '520px' }}>{button}</HoldingButton>
                </Section>

                <Section><HoldingImg src={Marketing7} /></Section>
            </Styled.Content>
        </Styled.MainSt>
    )
}

export default Landing;
