import styled from 'styled-components';
import { Button } from  '../../components/button/styles';

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
    bottom: 40px;
    right: 40px;
`


export const Actions = styled.div`
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 100%;
    text-align: center;
    ${Button} {
        margin: 10px auto;
    }
`