import styled from 'styled-components';

export const Shareholder = styled.div`
    position: relative;
    display: inline-block;
    width: 120px;
    padding: 15px 20px;
    transform: rotate(180deg);
    left: 3px;
    border-radius: 3px;
    border: 2px solid transparent;
    box-shadow: 0px 0px 10px var(--basic-shadow);
    background: #fff;
    margin: 0 20px;
    z-index: 1;
    transition: background 0.1s linear;
    min-height: 166px;
    font-weight: bold;

    &.heading {
        box-shadow: none;
        padding: 0;
        width: auto;
        background: none;
        cursor: default;
    }

    // &.isCompany:hover {
    //     background-color: var(--brand-primary-alt);
    //     transform: rotate(180deg) scale(1.1);
    // }

    // &.isPerson:hover {
    //     background-color: var(--brand-secondary-alt);
    //     transform: rotate(180deg) scale(1.1);
    // }

    &.isWithinShareholderThreshold {
        box-shadow: 0px 0px 10px var(--highlight);
        border: 2px solid var(--highlight);
    }
`

export const ShareholderList = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--basic-shadow);
    margin-bottom: 20px;

    &:last-of-type {
        border: 0;
        padding-bottom: 0;
    }

    > div {
        margin: 0 !important;
    }
`;

export const Image = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 26px;
    border: 2px solid #000;
    position: relative;
    margin: 0 auto 10px auto;
    background: center top 10px no-repeat;
    background-size: contain;

    &.large {
        width: 100px;
        height: 100px;
        border-radius: 50px;
    }
`

export const ImageCompany = styled(Image)`
    background-color: var(--brand-company);
`

export const ImagePerson = styled(Image)`
    background-color: var(--brand-person);
`

export const Heading = styled.div`
    font-weight: bold;
    font-size: 2em;
    margin-bottom: 20px;
`

export const Label = styled.div`
    position: relative;
    border-radius: 20px;
    
    &.P {
        text-transform: capitalize;
    }
`

export const Shares = styled.div`
    padding-left: 10px;
    margin-bottom: 10px;

    > span {
        font-weight: bold;
        font-size: 1.4em;
        margin-right: 5px;
    }
`
