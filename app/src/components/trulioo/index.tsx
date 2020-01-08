

import React, { useState } from "react";
import { MainSt } from "../styles";
import { verifyDocument } from "../../utils/trulioo/request";

export default function Trulioo() {


    const [imageUrl, setImageUrl] = useState();

    const checkImageUrl = (e: any) => {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onloadend = function () {
            const result = reader.result;
            setImageUrl(result);
        }
        reader.readAsDataURL(file);
    }

    const verifyImage = (e: any) => {
        e.preventDefault();
        verifyDocument(imageUrl);
    }

    return <MainSt>
        <form onSubmit={verifyImage}>
            <label htmlFor="documentType">Document Type:</label>
            <select id="documentType">
                <option value="Passport">Passport</option>
            </select>

            <br /><br />

            <label htmlFor="documentImage">Document image</label>
            <input type="file" id="documentImage" onChange={checkImageUrl}></input>

            <br /><br />

            <input type="submit" />
        </form>
    </MainSt>

}