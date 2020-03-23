import React from 'react';

import OrgChart from '../org-chart/index';
import getValue from '../../utils/functions/getValue';

type Props = {
    companyStructure: any,
    showOnlyOrdinaryShareTypes: boolean,
    shareholderThreshold: number,
    onClick?: (shareholder: any, shares: any) => void
}

export default function SignificantPersons(props: Props) {

    const {
        companyStructure,
        shareholderThreshold,
        showOnlyOrdinaryShareTypes,
        onClick
    } = props;

    const distinctShareholders = companyStructure.distinctShareholders;

    const filterList = (list: any) => {
        return list && list
            .map((item: any) => {
                const company = distinctShareholders.find((distinctShareholder: any) => distinctShareholder.docId === item.docId);
                const isWithinShareholderThreshold = company && company.totalShareholding >= shareholderThreshold;

                return {
                    ...item, isWithinShareholderThreshold
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
            companyName={getValue(companyStructure.name)}
            officialStatus={getValue(companyStructure.officialStatus)}
            companyId={getValue(companyStructure.companyId)}
            shareholders={companyStructure.shareholders}
            filter={filterList}
            onClick={onClick}
        />
    </>
}