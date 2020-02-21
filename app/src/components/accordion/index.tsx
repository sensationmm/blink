import React, { useState } from 'react';
import classNames from 'classnames';
import { SlideDown } from 'react-slidedown';

import * as Styled from './styles';
import ArrowBack from '../../svg/arrow-back.svg';
import 'react-slidedown/lib/slidedown.css';

interface AccordionProps {
    header: JSX.Element;
    content: JSX.Element;
    opened?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ header, content, opened = false }) => {
    const [open, setOpen] = useState(opened);

    return (
        <Styled.Main>
            <Styled.Header onClick={() => setOpen(!open)}>{header}</Styled.Header>

            <Styled.Toggle><img src={ArrowBack} /></Styled.Toggle>

            <SlideDown style={{ transitionDuration: '0.2s' }}>
                {open ? <Styled.Content>{content}</Styled.Content> : null}
            </SlideDown>
        </Styled.Main>
    )
}

export default Accordion;
