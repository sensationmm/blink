import styled from 'styled-components';
import Select from "react-select";

export const Tabs = styled.ul`
    padding: 0;
    margin: 50px auto;
    width: auto;
    display: flex;
    justify-content: center;

    li {

        margin: 0;
        // background-color: #999;
        list-style-type: none;
        float: left;
        text-align: center;

        a {
            color: #333;
            text-decoration: none;
            padding: 20px 50px;
            display: block;
            text-transform: capitalize;
            cursor: pointer;

            span {
                line-height: 18px;
            }
        }

        &.active {
            // background-color: #fff;
            border-bottom: 1px solid #999;

            a {
                color: #000;
                cursor: auto;
            }
        }
    }

`

export const MainSt = styled.main`
    padding: 0 30px 30px 30px;

    .pretty-json-container {
        margin-top: 20px;
    }

    dl.details {
        display: none;
    }
`

export const Content = styled.div`
    max-width: var(--max-content);
    margin: 0 auto;
`;

export const ContentNarrow = styled.div`
    max-width: var(--max-content-narrow);
    margin: 0 auto;
`;

export const InputSt = styled.input`
    padding: 0 0 10px 0;
    margin: 0;
    // width: 100%;
    border-width: 0 0 2px 0;
    background: none;
    border-color: var(--brand-secondary);
    width: 100%;
    font-size: inherit;
    outline: none;
    min-height: 30px;
`

export const ButtonSt = styled.button`
    padding: 10px;
`

export const Company = styled.div`
    margin: 20px 10px;
`

export const Errors = styled.ul`
    
`

export const Label = styled.label`
    display: block;
    margin: 0 0 5px;
`

export const FilterLabel = styled.label`
    width: 100%;
    float: left;
    z-index: 1;
    position: relative;
`

export const Cancel = styled.span`
    width: 30px;
    height: 30px;
    position: absolute;
    right: 0px;
    top: calc(50% - 16px);
    border: 1px solid var(--brand-secondary);
    color: var(--brand-secondary);
    border-radius: 50%;
    text-align: center;
    font-size: 22px;
    user-select: none;
    cursor: pointer;

    &.with-select {
        right: 450px;
    }
`

export const CountrySelector = styled(Select)`
    width: 100%;
    float: ${props => props.float || "right"};

    .react-select {

        &__value-container {
            padding: 0 0 10px 0;
        }

        &__control {
            background: none;
            border-radius: 0;
            border-width: 0 0 2px 0;
            border-color: var(--brand-secondary);

            &:hover {
                border-color: var(--brand-secondary);
            }
        }

        &__indicator-separator {
            display: none;
        }

        &__indicator {
            padding: 10px 0 10px 10px;

            svg {
                fill: var(--brand-secondary);
            }
        }
    }
    
`

export const InputWrapper = styled.div`
    width: 100%;
    position: relative;
    display: flex;

    > div {
        position: relative;
        width: 40%;

        &:first-child {
            margin-right: 20%;
        }
    }
`

export const TypeAhead = styled.div`
    position: relative;
    margin: 20px auto;
    max-width: 800px;

    ul {
        margin: 0 0 20px;
        padding: 0;
        position: absolute;
        width: 100%;
        background-color: none;
        z-index: 4;

        li {
            list-style-type: none;
            padding: 15px 20px;
            border: 1px solid var(--brand-secondary);
            border-bottom: none;
            width: calc(100% - 42px);
            cursor: pointer;

            &.Closed {
                text-decoration: line-through;
                color: #999;
            }

            span {
                font-size: 12px;
            }

            :first-child {
                border-top: none;
            }
            :last-child {
                border: 1px solid var(--brand-secondary);
            }

            :hover {
                background-color: #eee;
            }
        }
    }
`

export const Items = styled.ul`
    display: flex;
    list-style-type: none;
    // justify-content: space-evenly;

    > li {
        // border-bottom: 1px solid #ccc;
        padding: 0px;
        // max-width: 200px;
        margin: 0 10px;
        display: flex;
        // align-items: center;
        align-items: normal;
        text-align: center;
        flex-direction: column;

        ul {
            padding: 10px 0;
            // border: 1px solid #ccc;
            position: relative;
            border-top: 1px solid #ccc;

            &::before {
                content: "";
                height: 20px;
                width: 1px;
                background-color: #ccc;
                position: absolute;
                left: 50%;
                top: -20px;
            }
        }   

        span.title {
            display: block;
            padding: 10px;
            margin-bottom: 20px;
        }

        .react-json-view { 
            text-align: initial;
        }

        // > span {
        //     &::after {
        //         content: "";
        //         height: 1px;
        //         width: 20px;
        //         background-color: red;
        //         position: absolute;
        //         left: 50%;
        //      top: -20px;
        //     }
        // }

        > span {
            // white-space: nowrap;
        }

        &.corporate-entity-person-with-significant-control > span,
        &.company > span,
        &.limited-company > span,
        &.corporate-secretary > span {
            background-color: pink;
        }
        &.individual-person-with-significant-control > span,
        &.person > span,
        &.director > span {
            background-color: palegreen;
        }
        &.secretary > span {
            background-color: lightblue;
        }
        &.corporate-nominee-secretary > span {
            background-color: gold;
        }
        &.corporate-nominee-director > span {
            background-color: aliceblue
        }
        &.corporate-director > span {
            background-color: #ccc;
        }
        &.llp-member > span {
            background-color: #eee;
        }
        &.llp-designated-member  > span {
            background-color: #ddd;
        }
    }

`

export const SignificantPersonsSt = styled.div` 
    // background-color: magenta;
    padding: 10px 20px;
`

export const OfficersSt = styled.div` 
    // background-color: lime;
    padding: 10px 20px;
`

export const CountrySelect = styled.select`
    width: 140px;
    height: 72px;
    float: right;
`

export const Doc = styled.div`
    padding-left: 30%;
`;

export const DocNav = styled.div`
    width: 20%;
    padding: 30px;
    position: fixed;
    top: 0;
    left: 0;
    background: var(--basic-white);
    border-bottom: 1px solid var(--brand-primary);

    > div {
        cursor: pointer;
        text-align: center;
        width: 0;
        flex-grow: 1;
        font-family: 'Open Sans Light', sans-serif;
        font-size: 24px;
        letter-spacing: -2px;
        color: var(--brand-primary);

        &:hover {
            color: var(--brand-secondary);
        }
    }
`;
