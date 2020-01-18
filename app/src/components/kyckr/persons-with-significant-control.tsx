import React from 'react';
import { Items } from '../styles';
import PersonsWithSignificantControl from "./persons-with-significant-control";

type Props = {
    companyStructure: any,
    showDirectors: boolean
}

export default function SignificantPersons(props: Props) {

    const {
        showDirectors,
        companyStructure
    } = props;

    return <>

        {(companyStructure.officers || companyStructure.shareholders) && <Items>
            {
                companyStructure.shareholders &&
                companyStructure.shareholders
                    .filter((item: any) => !item.ceased_on)
                    .map((item: any) => {
                        let title = item.title;
                        if (item.name) {
                            title = `${item.title} ${(item.name.toLowerCase().includes("ltd") || item.name.toLowerCase().includes("limited") || item.shareholderType === "C" ? "limited-company" : "")} ${item.shareholderType === "P" ? "person" : ""}`;
                        }

                        return <li className={title} key={`${item.name}-${item.birthdate}-${Math.random()}`}>
                            <span title={title} className="title">{item.name}
                                {item.CompanyID && <span style={{ fontSize: 10 }}> ({item.CompanyID}) </span>}
                                {item.percentage && <><br /><span style={{ fontSize: 10 }}> {`${item.percentage}%`} </span></>}
                            </span>

                            {
                                item.CompanyID &&
                                (item.shareholders)
                                && <PersonsWithSignificantControl
                                    showDirectors={showDirectors}
                                    companyStructure={item}
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
                        if (item.name) {
                            title = `${item.title} ${(item.name.toLowerCase().includes("ltd") || item.name.toLowerCase().includes("limited") || item.shareholderType === "P" ? "person" : "")}`;
                        }

                        return <li className={title} key={`${item.name}-${item.birthdate}-${Math.random()}`}>
                            <span title={title} className="title">{item.name}
                                {item.CompanyID && <span style={{ fontSize: 10 }}> ({item.CompanyID})</span>}
                            </span>
                        </li>
                    })}


        </Items>}
    </>
}