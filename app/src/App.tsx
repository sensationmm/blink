import React, { useState } from 'react';
import { HeaderSt, MainSt, InputSt, ButtonSt, Company, Errors } from './styles';
import { requestCompany } from './utils/request';

function App() {

  const [companyId, setcompanyId] = useState("");
  const [company, setCompany] = useState();
  const [status, setStatus] = useState();
  const [errors, setErrors] = useState();


  const lookupCompany = async () => {
    console.log("requesting", companyId)
    setCompany(null);
    setErrors(null);
    setStatus("searching")
    const res = await requestCompany(companyId);


    if (res.errors) {
      setStatus(null);
      console.log(res.errors)
      setErrors(res.errors);
    } else {
      setCompany(res);
    }
  }


  return (
    <>
      <HeaderSt>
        Companies house lookup
      </HeaderSt>

      <MainSt>
        <label>Company Id:</label>
        <InputSt onChange={(event:any) => setcompanyId(event.target.value)} type="text" value={companyId} />
        <ButtonSt onClick={lookupCompany} type="button">Go!</ButtonSt>
        {company && <Company>
          {company.company_name}
        </Company>}
        {errors && <Errors>
          {errors.map((error:any) => <li key={error.type}>{error.error}</li>)}  
        </Errors>}
      </MainSt>

    </>
  );
}

export default App;
