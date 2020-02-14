import React from "react";

import * as Styled from './styles';

interface ProgressBarProps {
    label: string;
    value: number;
    total: number;
}

const ProgressBar = (props: ProgressBarProps) => {
    const { label, value, total } = props;

    const fill = (value / total) * 100;

    return (
        <Styled.ProgressBar>
            <Styled.Label>{label}</Styled.Label>

            <Styled.Bar>
                <Styled.Fill style={{ width: `${fill}%` }} />
            </Styled.Bar>

            <Styled.Stat>{value}/{total}</Styled.Stat>
        </Styled.ProgressBar>
    );
};

export default ProgressBar;
