const blinkMarkets = [
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany', },
    { code: 'FR', name: 'France', },
    { code: 'RO', name: 'Romania', },
    { code: 'IT', name: 'Italy', },
    { code: 'SE', name: 'Sweden', }
];

const blinkMarketList = blinkMarkets.map(market => market.code);

export { blinkMarkets, blinkMarketList };