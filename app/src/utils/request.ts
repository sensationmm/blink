const requestCompany = async (companyId: string) => {
    const response = await fetch(`http://localhost:3001/company/${companyId}`, { mode: 'cors' });
    const body = await response.json();
    return body;
}

export { requestCompany }