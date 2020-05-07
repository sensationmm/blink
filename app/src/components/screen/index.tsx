import React, { useState } from 'react';

import * as Styled from './styles';

interface ScreenProps {
    steps: Array<string>;
}

const Screen: React.FC<ScreenProps> = ({ steps }) => {
    const [active, setActive] = useState(0);

    const nextStep = () => {
        if (active + 1 < steps.length) {
            setActive(active + 1);
        }
    }

    return (
        <Styled.Main>
            {steps.map((step: string, count: number) => {
                return <img style={{ display: (active === count ? 'block' : 'none') }} src={step} onClick={nextStep} />
            })}
        </Styled.Main>
    )
}

export default Screen;
