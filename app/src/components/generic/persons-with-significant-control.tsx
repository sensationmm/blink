import React from 'react';

import PersonsWithSignificantControl from "./persons-with-significant-control";
import OrgChart from '../org-chart/index';

import { Items } from '../styles';

type Props = {
    companyStructure: any,
    showDirectors: boolean,
    shareholderRange: number
}

export default function SignificantPersons(props: Props) {

    const {
        showDirectors,
        companyStructure,
        shareholderRange,
    } = props;

    const filterList = (list: any) => {
        return list.filter((item: any) => !item.ceased_on).filter((item: any) => {
            if (!item.percentage) {
                return item
            } else if (item.percentage > shareholderRange) {
                return item
            }
        });
    }

    return <>
        <OrgChart companyName={companyStructure.name} shareholders={companyStructure.shareholders} filter={filterList} />
    </>
}