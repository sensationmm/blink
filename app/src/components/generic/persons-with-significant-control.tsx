import React from 'react';
import { Items } from '../styles';
import PersonsWithSignificantControl from "./persons-with-significant-control";

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

    // console.log("shareholderRange", typeof shareholderRange)

    return <>

        {(companyStructure.officers || companyStructure.shareholders) && <Items>
            {
                companyStructure.shareholders &&
                companyStructure.shareholders
                    .filter((item: any) => !item.ceased_on)
                    .filter((item: any) => {
                        if (!item.percentage) {
                            return item
                        } else if (item.percentage > shareholderRange) {
                            return item
                        }
                    })
                    .map((item: any) => {
                        let title = item.title;
                        const { name, shareholderType, CompanyID, percentage, birthdate, shareholders } = item;


                        if (name) {
                            title = `${title} ${(name.toLowerCase().includes("ltd") || name.toLowerCase().includes("limited") || shareholderType === "C" ? "limited-company" : "")} ${shareholderType === "P" ? "person" : ""}`;
                        }

                        return <li className={title} key={`${name}-${birthdate}-${Math.random()}`}>
                            <span title={title} className="title">{name}
                                {CompanyID && <span style={{ fontSize: 10 }}> ({CompanyID}) </span>}
                                {percentage && <><br /><span style={{ fontSize: 10 }}> {`${percentage}%`} </span></>}
                            </span>

                            {
                                CompanyID &&
                                shareholders
                                && <PersonsWithSignificantControl
                                    showDirectors={showDirectors}
                                    companyStructure={item}
                                    shareholderRange={shareholderRange}
                                />
                            }
                        </li>
                    })}

            {

                showDirectors && companyStructure.officers &&
                companyStructure.officers
                    .filter((item: any) => !item.ceased_on)
                    // .filter((item: any) => !item.birthdate)
                    .map((item: any) => {
                        let title = item.title;

                        const { CompanyID, shareholderType, birthdate, name } = item;


                        if (name) {
                            title = `${title} ${(name.toLowerCase().includes("ltd") || name.toLowerCase().includes("limited") || shareholderType === "P" ? "person" : "")}`;
                        }

                        return <li className={title} key={`${name}-${birthdate}-${Math.random()}`}>
                            <span title={title} className="title">{name}
                                {CompanyID && <span style={{ fontSize: 10 }}> ({CompanyID})</span>}
                            </span>
                        </li>
                    })}


        </Items>}
    </>
}