/// <reference path="./index.d.ts"/>
import React, { useState } from "react";
import Graph from "react-graph-vis";
// import { company } from "./leveris";
import { requestCompanyUBOStructure } from '../../utils/generic/request';
import { withRouter } from "react-router-dom";

const CompanyGraph = (props: any) => {
 
    const [company, setCompany] = useState();

    const go = async () => {
        const { match: { params: { companyId, countryCode } } } = props;
        const requestedCompany = await requestCompanyUBOStructure(companyId || "10103078", countryCode);
        setCompany(requestedCompany);
    }
    if (!company) {
        go()
    }

    const nodes: any = [];
    const edges: any = [];

    const buildNodesAndEdges = (shareholders: any, parentDocId: any) => {
        shareholders.forEach((shareholder: any) => {

            if (!nodes.find((node: any) => node.id === shareholder.docId)) {
                nodes.push({
                    id: shareholder.docId,
                    label: shareholder.name || shareholder.fullName,
                    title: shareholder.percentage,
                    color: shareholder.shareholderType === "P" ? "#f8f7ff" : "#d9fff9"
                });
            }
            edges.push({
                to: shareholder.docId,
                from: parentDocId
            })
            if (shareholder.shareholders) {
                buildNodesAndEdges(shareholder.shareholders, shareholder.docId);
            }
        });
    }

    if (company) {
        nodes.push({
            id: company.name,
            label: company.name,
        });
        if (company.shareholders) {

            buildNodesAndEdges(company.shareholders, company.name);
        }
    }

    const graph = {
        nodes,
        edges,
    };

    const options = {
        // layout: {
        //     hierarchical: true
        // },
        edges: {
            color: "#000000"
        },
        height: "800px"
    };

    const events = {
        // select: function (event) {
        //     var { nodes, edges } = event;
        // }
    };
    console.log("company", company)
    return (
        company ? <Graph
            graph={graph}
            options={options}
            events={events}
        // getNetwork={network => {
        //     //  if you want access to vis.js network api you can set the state in a parent component using this property
        // }}
        /> : 
        <div></div>
    );
}

export default withRouter(CompanyGraph)