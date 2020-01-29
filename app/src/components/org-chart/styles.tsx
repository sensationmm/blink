import styled from 'styled-components';

export const OrgChart = styled.div`
    display: flex;
    position: relative;
    margin: 30px;
    text-align: center;
    box-shadow: 0 0 10px #ccc;
    border-radius: 10px;

    > div:first-of-type {
        width: 100% !important;

        > div:first-of-type {
            width: 100% !important;
        }
    }
`

export const OrgChartInner = styled.div`
    display: inline-block;
    position: relative;
    transform: rotate(180deg);
    cursor: move;
    padding: 20px;
`

export const Controls = styled.div`
    position: absolute;
    z-index: 2;
    top: 20px;
    left: 20px;

    img {
        margin-right: 10px;
        cursor: pointer;
    }
`

export const Detail = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 50%;
    top: 50%;
    width: 300px;
    height: 300px;
    border-radius: 5px;
    box-shadow: 0px 0px 10px #ccc;
    background: #fff;
    transform: scale(0) translateX(-50%) translateY(-50%);
    transform-origin: 0 0;
    transition: all 0.2s linear;
    z-index: 2;

    &.open {
        transform: scale(1) translateX(-50%) translateY(-50%);
    }
`
