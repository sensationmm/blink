import FlagGB from '../../svg/flag-GB.svg';
import FlagDE from '../../svg/flag-DE.svg';
import FlagFR from '../../svg/flag-FR.svg';
import FlagRO from '../../svg/flag-RO.svg';
import FlagIT from '../../svg/flag-IT.svg';
import FlagSE from '../../svg/flag-SE.svg';

export const blinkMarkets = [
    { code: 'GB', name: 'United Kingdom', flag: FlagGB, currency: "GBP"},
    { code: 'DE', name: 'Germany', flag: FlagDE },
    { code: 'FR', name: 'France', flag: FlagFR },
    { code: 'RO', name: 'Romania', flag: FlagRO },
    { code: 'IT', name: 'Italy', flag: FlagIT },
    { code: 'SE', name: 'Sweden', flag: FlagSE, currency: "SEK" }
];

export const blinkMarketList = blinkMarkets.map(market => market.code);

export type marketType = 'Core' | 'GB' | 'DE' | 'FR' | 'RO' | 'IT' | 'SE';
