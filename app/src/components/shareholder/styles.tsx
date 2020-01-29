import styled from 'styled-components';

export const Shareholder = styled.div`
    position: relative;
    display: inline-block;
    width: 120px;
    padding: 15px 20px;
    transform: rotate(180deg);
    left: 3px;
    border-radius: 3px;
    box-shadow: 0px 0px 10px #ccc;
    background: #fff;
    margin: 0 20px;
    z-index: 1;
    cursor: pointer;

    &.heading {
        box-shadow: none;
        padding: 0;
        width: auto;
        background: none;
    }
`

export const Image = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 26px;
    border: 2px solid #000;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 10px;
    background: center top 10px no-repeat;
    background-size: contain;
`

export const ImageRoot = styled(Image)`
    width: 100px;
    height: 100px;
    border-radius: 50px;
    background-color: #D9FFF9;
`

export const ImageCompany = styled(Image)`
    background-color: #D9FFF9;
`

export const ImagePerson = styled(Image)`
    background-color: #EEEAFF;
`

export const Heading = styled.div`
    font-weight: bold;
    font-size: 2em;
    margin-bottom: 20px;
`

export const Label = styled.div`
    position: relative;
    align-self: center;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    border-radius: 20px;
    font-size: 14px;
    font-weight: bold;
`

export const Shares = styled.div`
    padding-left: 10px;
    margin-bottom: 10px;
    font-weight: bold;
`
