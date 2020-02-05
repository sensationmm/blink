import styled from 'styled-components';

export const Shareholder = styled.div`
    position: relative;
    display: inline-block;
    width: 120px;
    padding: 15px 20px;
    transform: rotate(180deg);
    left: 3px;
    border-radius: 3px;
    box-shadow: 0px 0px 10px var(--basic-shadow);
    background: #fff;
    margin: 0 20px;
    z-index: 1;
    cursor: pointer;
    transition: background 0.1s linear;
    min-height: 166px;

    &.heading {
        box-shadow: none;
        padding: 0;
        width: auto;
        background: none;
        cursor: default;
    }

    &.isCompany:hover {
        background-color: var(--brand-primary-alt);
        transform: rotate(180deg) scale(1.1);
    }

    &.isPerson:hover {
        background-color: var(--brand-secondary-alt);
        transform: rotate(180deg) scale(1.1);
    }
`

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
    background-color: var(--brand-primary);
`

export const ImagePerson = styled(Image)`
    background-color: var(--brand-secondary);
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
    &.P {
        text-transform: capitalize;
    }
`

export const Shares = styled.div`
    padding-left: 10px;
    margin-bottom: 10px;
    font-weight: bold;
`
