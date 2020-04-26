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
    header?: JSX.Element;
    showHeader?: boolean;
}

const ActionBar: React.FC<ActionBarProps> = ({
    labelPrimary,
    labelSecondary,
    actionPrimary,
    actionSecondary,
    disabledPrimary = false,
    disabledSecondary = false,
    hidden = false,
    header,
    showHeader = false
}) => {
    return (
        <Styled.Main className={classNames({ hide: hidden })}>
            {header && showHeader && <Styled.Header>{header}</Styled.Header>}

            <Styled.Buttons>
                <div />

                <Button small onClick={actionPrimary} label={labelPrimary} disabled={disabledPrimary} />

                {labelSecondary && actionSecondary
                    ? <Button small type={'secondary'} onClick={actionSecondary} label={labelSecondary} disabled={disabledSecondary} />
                    : <div />
                }
            </Styled.Buttons>
        </Styled.Main>
    )
}

export default ActionBar;
