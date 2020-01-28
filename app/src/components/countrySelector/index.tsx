import React from "react";
import Select from "react-select";
import styled from "styled-components";

const CountrySelect = styled(Select)`
    width: 250px;
    // height: 72px;
    float: right;
`

type Props = {
    isMulti: any,
    onChange: any,
    value: any
}

export const countries: any = {
    "GB": { label: "United Kingdom", icon: "🇬🇧" },
    "IE": { label: "Ireland", icon: "🇮🇪" },
    "DE": { label: "Germany", icon: "🇩🇪" },
    "IT": { label: "Italy", icon: "🇮🇹" },
    "SE": { label: "Sweden", icon: "🇸🇪" },
    "FR": { label: "France", icon: "🇫🇷" },
    "RO": { label: "Romania", icon: "🇷🇴" }
}

export default function CountrySelector({ isMulti, onChange, value }: Props) {




    return <CountrySelect options={Object.keys(countries).map((countryCode: string) => { return { label: `${countries[countryCode].label} ${countries[countryCode].icon}`, value: countryCode } })} value={value} isMulti={isMulti} onChange={onChange} />
}