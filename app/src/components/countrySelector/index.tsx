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

export default function CountrySelector({ isMulti, onChange, value }: Props) {

    const countries = [
        { value: "GB", label: "United Kingdom 🇬🇧" },
        { value: "IE", label: "Ireland 🇮🇪" },
        { value: "DE", label: "Germany 🇩🇪" },
        { value: "IT", label: "Italy 🇮🇹" },
        { value: "SE", label: "Sweden 🇸🇪" },
        { value: "FR", label: "France 🇫🇷" },
        { value: "RO", label: "Romania 🇷🇴" },
        { value: "KY", label: "Cayman Islands 🇰🇾" },
    ]
    

    return <CountrySelect options={countries} value={value} isMulti={isMulti} onChange={onChange} />
}