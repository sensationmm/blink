import React from 'react';

import * as Styled from './styles';

const Actions = (props: any) => {
    return (
        <Styled.Main>
            {props.children}
        </Styled.Main>
    );
}

export default Actions;
