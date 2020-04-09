import React, { useState, useEffect } from "react";
import classNames from 'classnames';

import * as Styled from './styles';

interface ProgressBarProps {
    large?: boolean;
    label?: string;
    labelSub?: string;
    value: number;
    total: number;
    icon?: string | JSX.Element;
    stacked?: boolean;
    controlled?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ large = false, label, labelSub, value, total, icon, stacked = false, controlled = false }) => {
    const fill = (value / total) * 100;

    const [fillPercent, setFillPercent] = useState(0);

    useEffect(() => {
        if (!controlled) {
            const fillAnim = setTimeout(() => setFillPercent(fill), (large ? 250 : 500));

            return () => {
                clearInterval(fillAnim);
            }
        }
    }, [value]);

    return (
        <Styled.ProgressBar className={classNames({ large: large })}>
            {icon && <Styled.Icon>{typeof icon === 'string' ? <img alt="" src={icon} /> : icon}</Styled.Icon>}

            <Styled.Stacker className={classNames({ stacked: stacked }, { controlled: controlled })}>
                {label &&
                    <Styled.Label>
                        {label}
                        {labelSub && <span>{labelSub}</span>}
                    </Styled.Label>
                }

                <Styled.Bar className={classNames({ hasLabel: label })}>
                    <Styled.Fill
                        style={{ width: `${!controlled ? fillPercent : fill}%` }}
                        className={classNames(
                            { warning: fillPercent < 50 },
                            { controlled: controlled }
                        )}
                    />

                    {(large && !controlled) && <Styled.Stat>{value}/{total} completed</Styled.Stat>}
                </Styled.Bar>
            </Styled.Stacker>

            {(!large && !controlled) && <Styled.Stat>{value}/{total}</Styled.Stat>}
        </Styled.ProgressBar>
    );
};

export default ProgressBar;

