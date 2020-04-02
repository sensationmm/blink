import styled from 'styled-components';

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