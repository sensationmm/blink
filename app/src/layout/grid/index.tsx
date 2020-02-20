import React from 'react';

import FlexRow from '../flex-row';
import Blocks from '../blocks';
import Checkbox from '../../components/form-checkbox';

import * as Styled from './styles';

interface GridRowProps {
    label: string;
    icon?: string | JSX.Element;
    values: Array<any>;
}

interface GridProps {
    labels: Array<string>;
    content: Array<GridRowProps>;
    rowHeaderWidth?: number;
}

const Grid: React.FC<GridProps> = ({ labels, content, rowHeaderWidth }) => {
    let layout: Array<number> | undefined = [];
    if (rowHeaderWidth) {
        layout.push(rowHeaderWidth);

        const numCols = content[0].values.length;
        const colWidth = (100 - rowHeaderWidth) / numCols;

        for (let i = 0; i < numCols; i++) {
            layout.push(colWidth);
        }
    } else {
        layout = undefined;
    }

    const spreadChildren = (first: JSX.Element, rest: Array<JSX.Element>) => {
        const hold = rest.slice();
        hold.unshift(first);
        return hold;
    }

    return (
        <Styled.Main>
            <Blocks>
                <FlexRow layout={layout}>
                    {spreadChildren(<div />, labels.map((label, count) => <Styled.Header>{label}</Styled.Header>))}
                </FlexRow>

                {content.map((item, count) => {
                    return (
                        <FlexRow key={`row-${count}`} layout={layout}>
                            {spreadChildren(
                                <Styled.RowHeader>
                                    {item.icon && <div>{typeof item.icon === 'string' ? <img src={item.icon} /> : item.icon}</div>}
                                    {item.label}
                                </Styled.RowHeader>,
                                item.values.map((value, iter) => {
                                    return <div><Checkbox key={`row-${count}-val-${iter}`} checked={value} /></div>;
                                })
                            )}
                        </FlexRow>
                    )
                })}
            </Blocks>
        </Styled.Main>
    )
};

export default Grid;