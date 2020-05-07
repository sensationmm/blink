/// <reference path="./index.d.ts"/>
import React, { useState } from "react";
import Graph from "react-graph-vis";
// import { company } from "./leveris";
import { requestCompanyUBOStructure } from '../../utils/generic/request';
import { withRouter } from "react-router-dom";

const CompanyGraph = (props: any) => {

    const [company, setCompany] = useState();
    const { match: { params: { companyId, key = "shareholders" } } } = props;
    
    const go = async () => {
        const requestedCompany = await requestCompanyUBOStructure(companyId || "10103078");
        setCompany(requestedCompany);
    }
    if (!company) {
        go()
    }

    const nodes: any = [];
    const edges: any = [];

    const buildNodesAndEdges = (collection: any, key: string, parentDocId: any) => {
        collection.forEach((entity: any) => {

            if (!nodes.find((node: any) => node.id === entity.docId)) {
                nodes.push({
                    id: entity.docId,
                    label: entity.name ?.value || entity.fullName ?.value,
                    title: entity.percentage ?.value,
                    color: entity.shareholderType ?.value === "P" ? "#f8f7ff" : "#d9fff9"
                });
            }
            edges.push({
                to: entity.docId,
                from: parentDocId
            })
            if (collection[key]) {
                buildNodesAndEdges(collection[key], key, collection.docId);
            }
        });
    }

    if (company) {
        nodes.push({
            id: company.name ?.value,
            label: company.name ?.value,
        });
        if (company[key]) {
            buildNodesAndEdges(company[key], key, company.name ?.value);
        }
    }

    const graph = {
        nodes,
        edges,
    };

    const options = {
        edges: {
            color: "#000000"
        },
        height: "800px"
    };

    return (
        company ? <Graph
            graph={graph}
            options={options}
            events={{}}
        /> :
            <div></div>
    );
}

export default withRouter(CompanyGraph)