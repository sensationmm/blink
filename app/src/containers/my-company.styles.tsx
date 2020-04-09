import styled from 'styled-components';

import { OrgChart, Controls as OrgChartControls } from '../components/org-chart/styles';

export const Progress = styled.div`
    width: 300px;
    margin: 0 auto;
`;

export const Mask = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
`;

export const ActionBar = styled.div`
    position: fixed;
    box-sizing: border-box;
    width: 100%;
    left: 0;
    bottom: 0;
    padding: 20px;
    background: var(--brand-tertiary);
    display: flex;
    justify-content: space-between;
    transition: 0.2s ease-out;

    > div {
        min-width: 150px;
    }

    &.hide {
        transform: translateY(100%);
    }
`;

export const MyCompanyStructure = styled.div`
    ${OrgChartControls} {
        right: 0;
        left: auto;
    }

    ${OrgChart} {
        position: absolute;
        width: 100vw;
        left: 50%;
        transform: translateX(-50%);
    }
`;