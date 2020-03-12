
const stringSimilarity = require('string-similarity');

const domain = window.location.href.indexOf("localhost") > -1 ? "http://localhost:5001/blink-staging-20006/us-central1" : "";

const searchCompany = async (query: string, countryISOCode: string = "GB", orderReference: string) => {
    const response = await fetch(`${domain}/kyckrSearchCompany/${query}/${countryISOCode}/${orderReference}`, { mode: 'cors' });
    const body = await response.json();
    return body;
}

// const FilingSearchResult = 
// {"FilingSearchResult":{"Products":{"ProductDTO":[{"Id":"EBRON_RUJSX0NvbXBhbnlQcm9maWxlXzE=_NDU3MDIxNA==__","PriceTag":"EBR_CP","Price":"£8.30","Currency":"£","ProductCode":"EBR_CompanyProfile_1","ProductFormat":"PDF","ProductTitle":"Company Profile"},{"Id":"ROWOFF_REVVX0VDUA==_QWt0dWVsbGVyIEFiZHJ1Y2svRXh0ZW5kZWQgUHJvZmlsZQ==_____S1lDT0ZG","PriceTag":"DEU_ECP","CountryISO":"DEU_1013","Price":"£17.99","Currency":"£","CompanyCode":"","ProductFormat":"PDF","ProductTitle":"Aktueller Abdruck/Extended Profile","DeliveryTimeMinutes":"15"},{"Id":"ROWOFF_REVVX0ZI_SGlzdG9yaXNjaGVyIEFiZHJ1Y2svRmlsaW5nIEhpc3Rvcnk=_____S1lDT0ZG","PriceTag":"DEU_FH","CountryISO":"DEU_1013","Price":"£17.99","Currency":"£","CompanyCode":"","ProductFormat":"PDF","ProductTitle":"Historischer Abdruck/Filing History","DeliveryTimeMinutes":"15"},{"Id":"ROWOFF_REVVX0NGQQ==_VmVyw7ZmZmVudGxpY2h1bmdlbiAvIFB1YmxpY2F0aW9ucw==_____S1lDT0ZG","PriceTag":"DEU_CFA","CountryISO":"DEU_1013","Price":"£13.84","Currency":"£","CompanyCode":"","ProductFormat":"PDF","ProductTitle":"Veröffentlichungen / Publications","DeliveryTimeMinutes":"15"},{"Id":"ROWOFF_REVVX0ZE_Q2hyb25vbG9naXNjaGVyIEFiZHJ1Y2sgLyBDaHJvbm9sb2dpY2FsIEV4dHJhY3Q=_____S1lDT0ZG","PriceTag":"DEU_FD","CountryISO":"DEU_1013","Price":"£17.99","Currency":"£","CompanyCode":"","ProductFormat":"PDF","ProductTitle":"Chronologischer Abdruck / Chronological Extract","DeliveryTimeMinutes":"15"},{"Id":"ROWOFF_REVVX0xT_R2VzZWxsc2NoYWZ0c3ZlcnRyYWcgLyBTYXR6dW5nIC8gTW9zdCByZWNlbnQgc3RhdHV0ZQ==_____S1lDT0ZG","PriceTag":"DEU_LS","CountryISO":"DEU_1013","Price":"£13.84","Currency":"£","CompanyCode":"","ProductFormat":"PDF","ProductTitle":"Gesellschaftsvertrag / Satzung / Most recent statute","DeliveryTimeMinutes":"15"},{"Id":"ROWOFF_REVVX0NIUw==_TGlzdGUgZGVyIEdlc2VsbHNjaGFmdGVyIC8gTGlzdCBvZiBBcHBvaW50bWVudHM=_____S1lDT0ZG","PriceTag":"DEU_CHS","CountryISO":"DEU_1013","Price":"£13.84","Currency":"£","CompanyCode":"","ProductFormat":"PDF","ProductTitle":"Liste der Gesellschafter / List of Appointments","DeliveryTimeMinutes":"15"},{"Id":"EBROFF_MjQwMTMwNzQ=_REVVX1JDQQ==_VmVyw6RuZGVydW5nZW4gKFJlZ2lzdHJ5IENvdXJ0cyBBbm5vdW5jZW1lbnRzKQ==_NDU3MDIxNA==","PriceTag":"DEU_RCA","Price":"£8.30","Currency":"£","ProductCode":"24013074","CompanyCode":"4570214","ProductDetails":{"ProductDetailDTO":[{"Key":"EFFECTIVE_DATE","Value":"2019-06-25","DocumentCount":0}]},"ProductFormat":"HTML","ProductTitle":"Veränderungen (Registry Courts Announcements)","DisplayDate":"2019-06-25","DeliveryTimeMinutes":"5"},{"Id":"EBROFF_MjM0MDQxNDA=_REVVX1JDQQ==_TmV1ZWludHJhZ3VuZ2VuIChSZWdpc3RyeSBDb3VydHMgQW5ub3VuY2VtZW50cyk=_NDU3MDIxNA==","PriceTag":"DEU_RCA","Price":"£8.30","Currency":"£","ProductCode":"23404140","CompanyCode":"4570214","ProductDetails":{"ProductDetailDTO":[{"Key":"EFFECTIVE_DATE","Value":"2019-02-27","DocumentCount":0}]},"ProductFormat":"HTML","ProductTitle":"Neueintragungen (Registry Courts Announcements)","DisplayDate":"2019-02-27","DeliveryTimeMinutes":"5"}]},"ResponseCode":100,"ContinuationKey":"","shouldPayVat":false,"TransactionId":"51427737"}}


const filingSearch = async (companyCode: string, registrationAuthorityCode: string, countryISOCode: string, orderReference?: string) => {
    orderReference = orderReference || `filling-search-${countryISOCode}-${registrationAuthorityCode}-${companyCode}`
    const response = await fetch(`${domain}/kyckrFilingSearch/${companyCode}/${registrationAuthorityCode}/${countryISOCode}/${orderReference}}`, { mode: 'cors' });
    const body = await response.json();
    // const body = FilingSearchResult;
    return body;
}

const productOrder = async (companyCode: string, registrationAuthorityCode: string, countryISOCode: string, productId: string, orderReference?: string) => {
    console.log(registrationAuthorityCode, companyCode)
    orderReference = orderReference || `11fs-product-${countryISOCode}-${registrationAuthorityCode ? registrationAuthorityCode + "-" : ""}${companyCode}-${productId.substring(productId.length - 30)}`
    console.log(orderReference)
    const response = await fetch(`${domain}/kyckrProductOrder/${companyCode}/${registrationAuthorityCode}/${countryISOCode}/${productId}/${orderReference}}`, { mode: 'cors' });
    const body = await response.json();
    // const body = FilingSearchResult;
    return body;
}

const productList = async (orderedWithin: string = "30") => {
    const response = await fetch(`${domain}/kyckrProductList/${orderedWithin}`, { mode: 'cors' });
    const body = await response.json();
    // const body = FilingSearchResult;
    return body;
}

const requestCompanyProfile = async (companyId: string, searchCode: string, countryISOCode: string = "GB", orderReference: string, ignoreDB: boolean = false, registrationAuthorityCode?: string) => {

    const data = {
        companyId,
        searchCode,
        countryISOCode,
        orderReference,
        ignoreDB,
        registrationAuthorityCode
    }

    const response = await fetch(`${domain}/kyckrCompanyProfile/${ignoreDB ? '?ignoreDB=true' : ''}`,  {
        method: 'post',
        body: JSON.stringify(data)
    });
    
    try {
        const body = await response.json();
        return body;
    }
    catch (e) {
        return null
    }
}

const getCompanyIdFromSearch = async (query: string, countryISOCode: string = "GB", orderReference: string) => {
    const response = await searchCompany(query, countryISOCode, orderReference);
    // console.log(query)
    let company;
    if (response && response.CompanySearchResult &&
        response.CompanySearchResult.Companies &&
        response.CompanySearchResult.Companies.CompanyDTO) {

        const CompanyDTO = response.CompanySearchResult &&
            response.CompanySearchResult.Companies &&
            response.CompanySearchResult.Companies.CompanyDTO;

        const companies = CompanyDTO.map(((c: any) => c.Name.toLowerCase()));

        const matches = stringSimilarity.findBestMatch(query.toLowerCase(), companies);
        const bestMatchIndex = matches && matches.bestMatchIndex;
        if (matches.bestMatch && matches.bestMatch.rating > 0.8) {
            company = CompanyDTO[matches.bestMatchIndex];
            // console.log(query, matches, company);
        }

    }
    if (company && company.CompanyID) {
        return company.CompanyID;
    } else {
        return "none";
    }
}

const requestCompanyOfficials = async (companyNumber: string, countryISOCode: string = "GB", orderReference: string) => {
    const response = await fetch(`${domain}/kyckrCompanyOfficials/${companyNumber}/${countryISOCode}/${orderReference}`, { mode: 'cors' });
    const body = await response.json();
    return body;
}

export { productList, filingSearch, searchCompany, requestCompanyProfile, requestCompanyOfficials, getCompanyIdFromSearch, productOrder }