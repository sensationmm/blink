import styled from 'styled-components';
import xeroIntegrationImage from "../../svg/xero-integration.png";
import xeroLogo from '../../svg/xero-logo.svg';
import { Button } from '../../components/button/styles';

export const Icon = styled.div`
margin-right: 30px;
img {
    width: 26px;
}
`;

export const AccountDetails = styled.div`
margin: 10px 30px 0 0;
position: relative;
`
export const AccountName = styled.div`
    margin: 20px 0 10px;
    transform: translateY(10px);
    display: block;
`
export const Item = styled.span`
    margin-right: 20px;
`

export const AccountBalance = styled.div`
    position: absolute; 
    right: -20px;
    font-size: 40px;
    top: calc(50% - 40px);
    transform: translateY(-50%);
`

export const TimeStamp = styled.div`
    position: absolute; 
    right: 20px;
    font-size: 12px;
    top: 20px;
    color: #ccc;
`
export const Refresh = styled.img`
    height: 20px;
    opacity: 0.5;
    margin: 0 10px -5px 10px;
    &:hover {
        opacity: 1;
    }
`

export const LinkAccount = styled.button`
    position: absolute;
    bottom: 50%;
    right: -80px;
    transform: translateY(50%);
    font-size: 24px;
    background: none;
    border: none;
    &:hover {
        text-decoration: underline;
    }
`


export const Actions = styled.div`
    margin: 50px;
    ${(props: any) => props.connect && `
    position: absolute;
    bottom: -10px;
    left: 20px;
    width: 100%;
    text-align: left;
    margin: 0;
    ${Button} {
        margin: 10px;
    }
    `}
`
export const Banner = styled.div`
    height: 500px;
    width: 650px;
    margin: auto;
    position: relative;
    line-height: 24px;

    ul {
        border: 1px solid #ddd;
        width: 300px;
        padding: 30px 40px 20px 40px;
        margin: 60px 0 0 0;
        position: relative;
        border-radius: 10px;

        li {
            margin: 20px 10px;
        }

        ::before {
            height: 70px;
            width: 70px;
            left: 20px;
            background: url(${xeroLogo});
            top: -40px;
        }

        ::after {
            height: 380px;
            width: 400px;
            background: url(${xeroIntegrationImage});
            top: -70px;
            right: calc(-100% + 50px);
        }

        ::before, ::after {
            content: "";
            position: absolute;
            background-repeat: no-repeat;
            background-position: 0;
            background-size: contain;
        }
    }

    h1 {
        margin-top: 50px;
    }
`