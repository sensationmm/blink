import React from 'react';
import classNames from 'classnames';

import Button from '../../components/button';

import * as Styled from './styles';

interface ActionBarProps {
    labelPrimary: string;
    labelSecondary?: string;
    actionPrimary: () => void;
    actionSecondary?: () => void;
    disabledPrimary?: boolean;
    disabledSecondary?: boolean;
    hidden?: boolean;
}

const ActionBar: React.FC<ActionBarProps> = ({
    labelPrimary,
    labelSecondary,
    actionPrimary,
    actionSecondary,
    disabledPrimary = false,
    disabledSecondary = false,
    hidden = false
}) => {
    return (
        <Styled.Main className={classNames({ hide: hidden })}>
            <div />

            <Button small onClick={actionPrimary} label={labelPrimary} disabled={disabledPrimary} />

            {labelSecondary && actionSecondary
                ? <Button small type={'secondary'} onClick={actionSecondary} label={labelSecondary} disabled={disabledSecondary} />
                : <div />
            }
        </Styled.Main>
    )
}

export default ActionBar;
