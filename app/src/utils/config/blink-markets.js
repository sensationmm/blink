import FlagGB from '../../svg/flag-GB.svg';
import FlagDE from '../../svg/flag-DE.svg';
import FlagFR from '../../svg/flag-FR.svg';
import FlagRO from '../../svg/flag-RO.svg';
import FlagIT from '../../svg/flag-IT.svg';
import FlagSE from '../../svg/flag-SE.svg';

const blinkMarkets = [
    { code: 'GB', name: 'United Kingdom', flag: FlagGB },
    { code: 'DE', name: 'Germany', flag: FlagDE },
    { code: 'FR', name: 'France', flag: FlagFR },
    { code: 'RO', name: 'Romania', flag: FlagRO },
    { code: 'IT', name: 'Italy', flag: FlagIT },
    { code: 'SE', name: 'Sweden', flag: FlagSE }
];

const blinkMarketList = blinkMarkets.map(market => market.code);

export { blinkMarkets, blinkMarketList };