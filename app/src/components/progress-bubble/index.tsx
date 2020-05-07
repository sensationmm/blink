import React from 'react';
import classNames from 'classnames';

import * as Styled from './styles';

interface ProgressBubbleProps {
    completed: number;
    total: number;
    type?: 'person' | 'company';
}

const ProgressBubble: React.FC<ProgressBubbleProps> = ({ completed, total, type = 'company' }) => {
    const circumference = 2 * Math.PI * 40;
    const fill = (completed / total) * circumference;

    return (
        <Styled.Main className={type}>
            <Styled.Content className={classNames({ complete: completed === total })}>
                {completed}/{total}
            </Styled.Content>

            <Styled.Inner />

            <Styled.Fill width="80" height="80">
                <circle r="40" cx="40" cy="40" style={{ strokeDasharray: `${fill} ${circumference}` }} />
            </Styled.Fill>
        </Styled.Main>
    )
}

export default ProgressBubble;
