import FlagGB from '../../svg/flag-GB.svg';
import FlagDE from '../../svg/flag-DE.svg';
import FlagFR from '../../svg/flag-FR.svg';
import FlagRO from '../../svg/flag-RO.svg';
import FlagIT from '../../svg/flag-IT.svg';
import FlagSE from '../../svg/flag-SE.svg';
import FlagCH from '../../svg/flag-CH.svg';
import FlagHU from '../../svg/flag-HU.svg';
import FlagES from '../../svg/flag-ES.svg';
import FlagIE from '../../svg/flag-IE.svg';
import FlagFI from '../../svg/flag-FI.svg';
import FlagNO from '../../svg/flag-NO.svg';

export const blinkMarkets = [
    { code: 'GB', region: 'europe', name: 'United Kingdom', flag: FlagGB, currency: "GBP" },
    { code: 'DE', region: 'europe', name: 'Germany', flag: FlagDE },
    { code: 'FR', region: 'europe', name: 'France', flag: FlagFR },
    { code: 'RO', region: 'europe', name: 'Romania', flag: FlagRO },
    { code: 'IT', region: 'europe', name: 'Italy', flag: FlagIT },
    { code: 'SE', region: 'europe', name: 'Sweden', flag: FlagSE, currency: "SEK" },
    { code: 'CH', region: 'asia', name: 'Switzerland', flag: FlagCH, disabled: true },
    { code: 'HU', region: 'asia', name: 'Hungary', flag: FlagHU, disabled: true },
    { code: 'ES', region: 'asia', name: 'Spain', flag: FlagES, disabled: true },
    { code: 'IE', region: 'asia', name: 'Ireland', flag: FlagIE, disabled: true },
    { code: 'FI', region: 'asia', name: 'Finland', flag: FlagFI, disabled: true },
    { code: 'NO', region: 'asia', name: 'Norway', flag: FlagNO, disabled: true },
];

export const blinkMarketList = blinkMarkets.map(market => market.code);

export type marketType = 'Core' | 'GB' | 'DE' | 'FR' | 'RO' | 'IT' | 'SE';
