import React from 'react';

import PersonsWithSignificantControl from "./persons-with-significant-control";
import OrgChart from '../org-chart/index';

import { Items } from '../styles';

type Props = {
    companyStructure: any,
    showDirectors: boolean,
    showOnlyOrdinaryShareTypes: boolean,
    shareholderThreshold: number,
}

export default function SignificantPersons(props: Props) {

    const {
        showDirectors,
        companyStructure,
        shareholderThreshold,
        showOnlyOrdinaryShareTypes,
    } = props;

    const distinctShareholders = companyStructure.distinctShareholders;

    const filterList = (list: any) => {
        return list && list
            .map((item: any) => {
                const company = distinctShareholders.find((distinctShareholder: any) => distinctShareholder.docId === item.docId);
          
                return {
                    ...item, isWithinShareholderThreshold: company && company.totalShareholding >= shareholderThreshold
                }
            })
            .filter((item: any) => !item.ceased_on)
            .filter((item: any) => {
                if (showOnlyOrdinaryShareTypes) {
                    return item?.shareType?.toLowerCase().indexOf("ordinary") > -1
                }
                return item
            })
            // .filter((item: any) => {
            //     if (!item.percentage) {
            //         return item
            //     } else if (item.percentage > shareholderThreshold) {
            //         return item
            //     }
            // });
    }

    return <>
        <OrgChart
            shareholderThreshold={shareholderThreshold}
            companyName={companyStructure.name}
            officialStatus={companyStructure.officialStatus}
            companyId={companyStructure.companyId}
            shareholders={companyStructure.shareholders}
            filter={filterList}
        />
    </>
}