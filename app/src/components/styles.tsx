import styled from 'styled-components';

export const Tabs = styled.ul`

    padding: 0;
    margin: 0;
    width: 100%;
    background-color: #999;
    overflow: hidden;

    li {

        margin: 0;
        border: 1px solid #666;
        border-top: none;
        background-color: #999;
        float: left;
        list-style-type: none;

        a {
            color: #333;
            text-decoration: none;
            padding: 20px;
            display: block;
        }

        &.active {
            background-color: #fff;
            border-bottom: 1px solid #fff;

            a {
                color: #000;
            }
        }
    }

`

export const MainSt = styled.main`
    padding: 10px;

    .pretty-json-container {
        margin-top: 20px;
    }
`

export const InputSt = styled.input`
    padding: 10px;
    margin: 0;
    // width: 100%;
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

export const Cancel = styled.span`
    width: 30px;
    height: 30px;
    position: absolute;
    right: -5px;
    top: calc(50% - 15px);
    border: 1px solid #999;
    color: #999;
    border-radius: 50%;
    text-align: center;
    font-size: 22px;
    user-select: none;
    cursor: pointer;

    &.with-select {
        right: 155px;
    }
`

export const InputWrapper = styled.div`
    width: 100%;
    position: relative;
`

export const TypeAhead = styled.div`

    position: relative;
    margin: 20px auto;
    max-width: 800px;

    input {
        width: calc(100% - 22px);
        padding: 20px;
        font-size: 24px;
        outline: none;

        &.with-select {
            width: calc(100% - 184px);
        }
    }

    ul {
        margin: 0 0 20px;
        padding: 0;
        position: absolute;
        width: 100%;
        background-color: #fff;
        z-index: 1;

        li {
            list-style-type: none;
            padding: 15px 20px;
            border: 1px solid #ddd;
            border-bottom: none;
            width: calc(100% - 20px);
            cursor: pointer;

            span {
                font-size: 12px;
            }

            :first-child {
                border-top: none;
            }
            :last-child {
                border: 1px solid #ddd;
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
        // border: 1px solid #ccc;
        padding: 0px;
        // max-width: 200px;
        margin: 0 20px 0 0;
        display: flex;
        align-items: center;
        text-align: center;
        flex-direction: column

        span.title {
            display: block;
            padding: 10px;
        }

        .react-json-view { 
            text-align: initial;
        }

        &.corporate-entity-person-with-significant-control > span,
        &.corporate-secretary > span {
            background-color: pink;
        }
        &.individual-person-with-significant-control > span,
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
    }

`

export const CountrySelect = styled.select`
    width: 140px;
    height: 72px;
    float: right;
`