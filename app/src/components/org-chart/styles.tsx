import styled from 'styled-components';

export const OrgChart = styled.div`
    display: flex;
    position: relative;
    text-align: center;
    height: 70vh;
    background: var(--basic-white);

    > div:first-of-type {
        width: 100% !important;
        height: 100% !important;

        > div:first-of-type {
            width: 100% !important;
            height: 100% !important;
        }
    }

    &.fullscreen {
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0px;
        left: 0px;
        margin: 0;
        background: #fff;
        border-radius: 0;
        z-index: 100;
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
    display: flex;
    z-index: 2;
    top: 0;
    left: 0;
    background: rgba(255, 255, 255, 0.7);
    padding: 20px 0 20px 20px;

    img {
        max-width: 30px;
        margin-right: 15px;
        cursor: pointer;
    }
`

export const Detail = styled.div`
    position: absolute;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    left: 50%;
    top: 50%;
    width: 300px;
    border-radius: 5px;
    box-shadow: 0px 0px 10px var(--basic-shadow);
    background: #fff;
    transform: scale(0) translateX(-50%) translateY(-50%);
    transform-origin: 0 0;
    z-index: 3;
    transition: all 0.2s ease-out;

    &.open {
        transform: scale(1) translateX(-50%) translateY(-50%);
        transition: all 0.2s ease-out 0.1s;
    }
`

export const DetailMask = styled.div`
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.6);
    z-index: 10;
    transition: all 0.2s ease-out 0.2s;
    z-index: -1;
    opacity: 0;

    &.open {
        opacity: 1;
        z-index: 2;
        transition: opacity 0.2s ease-out;
    }
`
