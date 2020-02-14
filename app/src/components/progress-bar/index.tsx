import React, { useState, useEffect } from "react";
import classNames from 'classnames';

import * as Styled from './styles';

interface ProgressBarProps {
    large?: boolean;
    label?: string;
    value: number;
    total: number;
}

const ProgressBar = (props: ProgressBarProps) => {
    const { large = false, label, value, total } = props;

    const fill = (value / total) * 100;

    const [fillPercent, setFillPercent] = useState(0);

    useEffect(() => {
        const fillAnim = setTimeout(() => setFillPercent(fill), (large ? 250 : 500));

        return () => {
            clearInterval(fillAnim);
        }
    }, [value]);

    return (
        <Styled.ProgressBar className={classNames({ large: large })}>
            <Styled.Label>{label}</Styled.Label>

            <Styled.Bar>
                <Styled.Fill style={{ width: `${fillPercent}%` }} />

                {large && <Styled.Stat>{value}/{total} completed</Styled.Stat>}
            </Styled.Bar>

            {!large && <Styled.Stat>{value}/{total}</Styled.Stat>}
        </Styled.ProgressBar>
    );
};

export default ProgressBar;

