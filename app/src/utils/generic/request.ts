


import { searchCompany as dueDillSearchCompany } from "../duedill/request";

const stringSimilarity = require('string-similarity');

// const debounce = require('lodash.debounce');

const domain = window.location.href.indexOf("localhost") > -1 ? "http://localhost:5001/blink-3b651/us-central1" : "https://us-central1-blink-3b651.cloudfunctions.net";

const requestCompanyUBOStructure = async (companyId: string, countryISOCode: string = "GB") => {
    // const response = await fetch(`${domain}/requestCompanyUBOStructure/any/${companyNumber}/${countryISOCode}`, { mode: 'cors' });

    const data = {
        companyId,
        countryISOCode
    }

    const response =  await fetch(`${domain}/requestCompanyUBOStructure`, {
        method: 'post',
        body: JSON.stringify(data)
    })


    if (response.status === 404) {
        // console.log("response", response)
        return "not found"
    } else {
        const body = await response.json();
        return body;
    }
}

const getCompanyIdFromSearch = async (query: string, countryISOCode: string = "GB") => {
    const response = await dueDillSearchCompany(query, countryISOCode);
    let company;

    if (response && response.companies) {

        const companies = response.companies.map(((c: any) => c.name.toLowerCase()));

        const matches = stringSimilarity.findBestMatch(query.toLowerCase(), companies);
        const bestMatchIndex = matches && matches.bestMatchIndex;
        if (matches.bestMatch && matches.bestMatch.rating > 0.8) {
            company = response.companies[matches.bestMatchIndex];
            // console.log(query, matches, company);
        }

    }
    if (company && company.companyId) {
        // console.log("company", company.name, company.companyId)
        return company.companyId;
    } else {
        return "none";
    }
}

const saveCompanyStructure = async (companyStructure: any, ignoreDB: boolean) => {
    const data = {
        companyStructure,
        ignoreDB
    }

    return await fetch(`${domain}/saveCompanyUBOStructure`, {
        method: 'post',
        body: JSON.stringify(data)
    })
};


const requestSignIn = async (password: any) => {
    const data = {
        password
    }

    const response = await fetch(`${domain}/signIn`, {
        method: 'post',
        body: JSON.stringify(data)
    })

    return response.status === 200;
};


const toCamel = (obj: any) => {
    let newO: any, origKey, newKey, value
    if (obj instanceof Array) {
      return obj.map(function(value) {
          if (typeof value === "object") {
            value = toCamel(value)
          }
          return value
      })
    } else {
      newO = {}
      for (origKey in obj) {
        if (obj.hasOwnProperty(origKey)) {
          newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString()
          value = obj[origKey]
          if (value instanceof Array || (value !== null && value.constructor === Object)) {
            value = toCamel(value)
          }
          newO[newKey] = value
        }
      }
    }
    return newO
  }


const normalisePropertyNames = (obj: any) => {
    if (obj instanceof Array) {
        return obj.map(function(value) {
            if (typeof value === "object") {
                value = normalisePropertyNames(value)
            }
            return value
        })
    } else {
        if (obj["externalCode"]) {
            obj.companyId = obj["externalCode"];
            delete obj["externalCode"]
        }
        if (obj["companyID"]) {
            obj.companyId = obj["companyID"];
            delete obj["companyID"]
        }
        return obj;
    }
}

export { requestCompanyUBOStructure, getCompanyIdFromSearch, saveCompanyStructure, toCamel, normalisePropertyNames, requestSignIn }