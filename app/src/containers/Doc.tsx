import React from "react";

import * as Styled from "../components/styles";

const Content = require('../doc/global.html');
require('../doc/styles/jsdoc-default.css')

const Doc = () => {
    const content = Content.replace(/src="scripts/gi, 'src="/doc').replace(/href="(global|index).html/gi, 'href="/doc').replace(/href="styles/gi, 'href="../doc/styles');

    return (
        <Styled.MainSt style={{ width: 'calc(100vw - 60px)', height: '100vh' }} dangerouslySetInnerHTML={{ __html: content }} />
    )
}

export default Doc;
