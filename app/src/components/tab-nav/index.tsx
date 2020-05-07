import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import * as Styled from './styles';

interface TabNavItemProps {
    label: string;
    stat?: string;
    content: JSX.Element | string;
}

interface TabNavProps {
    items: TabNavItemProps[];
    onChange?: (activeTabName: string) => void;
    active?: string;
}

const TabNav: React.FC<TabNavProps> = ({ items, onChange, active }) => {
    let initTab = 0;
    items.forEach((obj, index) => {
        if (obj.label === active) {
            initTab = index;
        }
    });

    const [activeTab, setActiveTab] = useState(initTab);

    const prevActiveTabRef = useRef(0);
    useEffect(() => {
        prevActiveTabRef.current = activeTab;
    });
    const prevActiveTab = prevActiveTabRef.current;

    return (
        <Styled.Main>
            <Styled.Nav className={classNames({ hasStats: items.filter((item: any) => item.stat).length > 0 })}>
                {items.map((item: any, count: number) => {
                    return (
                        <Styled.NavItem
                            key={`tab-${count}`}
                            className={classNames({ active: count === activeTab })}
                            onClick={() => { setActiveTab(count); onChange && onChange(items[count].label); }}
                        >
                            {item.label}

                            {item.stat && <Styled.Stat>{item.stat}</Styled.Stat>}
                        </Styled.NavItem>
                    )
                })}
            </Styled.Nav>

            <Styled.Content>
                <Styled.ContentInner
                    style={{
                        width: `calc(${items.length} * 100%)`,
                        transform: `translateX(-${activeTab * (100 / items.length)}%)`,
                        transitionDuration: `${0.2 * Math.abs(activeTab - prevActiveTab)}s`
                    }}
                >
                    {items.map((item: any, count: number) => {
                        return <Styled.ContentItem key={`content-${count}`} style={{ width: `calc(100% / ${items.length})` }}>{item.content}</Styled.ContentItem>
                    })}
                </Styled.ContentInner>
            </Styled.Content>
        </Styled.Main>
    )
}

export default TabNav;
