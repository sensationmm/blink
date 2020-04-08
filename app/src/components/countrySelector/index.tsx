import React from "react";

import { CountrySelector as ReactCountrySelector } from "../styles";

type Props = {
    isMulti: any,
    onChange: any,
    value: any,
    showAny?: boolean,
    float?: string
}

export const countries: any = {
    "any": { label: "Any", icon: "" },
    "GB": { label: "United Kingdom", icon: "🇬🇧" },
    "IE": { label: "Ireland", icon: "🇮🇪" },
    "DE": { label: "Germany", icon: "🇩🇪" },
    "IT": { label: "Italy", icon: "🇮🇹" },
    "ES": { label: "Spain", icon: "🇪🇸" },
    // "SE": { label: "Sweden", icon: "🇸🇪" },
    // "FR": { label: "France", icon: "🇫🇷" },
    "RO": { label: "Romania", icon: "🇷🇴" },
}

export default function CountrySelector({ isMulti, onChange, value, showAny = false, float = "right" }: Props) {

    return (
        <ReactCountrySelector
            className="react-select"
            classNamePrefix="react-select"
            float={float}
            options={Object.keys(countries).filter((countryCode: string) => {
                if (countryCode === "any") {
                    if (showAny) {
                        return countryCode;
                    }
                } else {
                    return countryCode;
                }
            }).map((countryCode: string) => {
                return { label: `${countries[countryCode].label} ${countries[countryCode].icon}`, value: countryCode }
            })} value={value} isMulti={isMulti} onChange={onChange}
        />
    )
}