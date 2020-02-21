import React from 'react';

import * as Styled from './styles';

interface StatProps {
    icon: string;
    label: string;
    value: number;
    total: number;
}

interface StatsProps {
    list: Array<StatProps>;
}

const Stat: React.FC<StatProps> = ({ icon, label, value, total }) => {
    return (
        <Styled.Item>
            <Styled.Icon src={icon} alt={label} title={label} />

            <Styled.Value>{value}/{total}</Styled.Value>
        </Styled.Item>
    )
};

const Stats: React.FC<StatsProps> = ({ list }) => {
    return (
        <Styled.Main>
            {list.map((item, count) => <Stat key={`stat-${count}`} {...item} />)}
        </Styled.Main>
    )
};

export { Stat };
export default Stats;