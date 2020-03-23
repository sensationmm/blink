import styled from 'styled-components';

export const Main = styled.div`
    max-width: 300px;
    margin: 0 auto;
`;

export const Card = styled.div`
    position: relative;
    text-align: left;
    border: 1px solid var(--basic-shadow);
    border-radius: 5px;
    box-shadow: 0px 0px 10px var(--basic-shadow);
    padding: 20px;
    z-index: 2;
    background: var(--basic-white);
`;

export const Add = styled.div`
    display: flex;
    position: relative;
    border: 1px solid var(--brand-secondary);
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 50px;
    font-size: 0.8em;
    z-index: 1;

    img {
        width: 10px;
        margin-right: 15px;
        color: red;
    }

    &:after {
        position: absolute;
        left: 50%;
        top: 100%;
        content: '';
        width: 1px;
        height: 100px;
        background: var(--basic-text);
    }
`;

export const Delete = styled.div`
    display: inline-block;
    color: var(--brand-secondary);
    padding: 10px;
    cursor: pointer;

    &:hover {
        color: var(--brand-primary);
    }
`;

export const Image = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 26px;
    border: 2px solid #000;
    position: relative;
    margin-bottom: 10px;
    background: center top 10px no-repeat;
    background-size: contain;
`;

export const ImageCompany = styled(Image)`
    background-color: var(--brand-company);
`;

export const ImagePerson = styled(Image)`
    background-color: var(--brand-person);
`;
