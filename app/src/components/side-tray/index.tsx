import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { clearSideTray } from '../../redux/actions/side-tray';

import ArrowBack from '../../svg/arrow-back.svg';

import * as Styled from './styles';

interface SideTrayProps {
    open: boolean;
    Component: React.ComponentType | null;
    params: object;
    clearSideTray: () => void;
}

const SideTray: React.FC<SideTrayProps> = ({ open, Component, params, clearSideTray }) => {
    return (
        <Styled.Main className={classNames({ open: open })}>
            <Styled.Content>
                <Styled.Close onClick={clearSideTray}><img src={ArrowBack} /></Styled.Close>
                {Component !== null && <Component {...params} />}
            </Styled.Content>
        </Styled.Main>
    )
}

const mapStateToProps = (state: any) => ({
    open: state.sideTray.open,
    Component: state.sideTray.component,
    params: state.sideTray.params,
});

const actions = { clearSideTray };

export const RawComponent = SideTray;

export default connect(mapStateToProps, actions)(SideTray);
