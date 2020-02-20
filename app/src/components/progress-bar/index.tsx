import React, { useState, useEffect } from "react";
import classNames from 'classnames';

import * as Styled from './styles';

interface ProgressBarProps {
    large?: boolean;
    label?: string;
    value: number;
    total: number;
    icon?: string | JSX.Element;
    stacked?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ large = false, label, value, total, icon, stacked = false }) => {
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
            {icon && <Styled.Icon>{typeof icon === 'string' ? <img src={icon} /> : icon}</Styled.Icon>}

            <Styled.Stacker className={classNames({ stacked: stacked })}>
                <Styled.Label>{label}</Styled.Label>

                <Styled.Bar>
                    <Styled.Fill style={{ width: `${fillPercent}%` }} className={classNames({ warning: fillPercent < 50 })} />

                    {large && <Styled.Stat>{value}/{total} completed</Styled.Stat>}
                </Styled.Bar>
            </Styled.Stacker>

            {!large && <Styled.Stat>{value}/{total}</Styled.Stat>}
        </Styled.ProgressBar>
    );
};

export default ProgressBar;

