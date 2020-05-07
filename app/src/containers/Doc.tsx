import React, { useState } from "react";

import * as Styled from "../components/styles";

const ContentValidators = require('../doc/validators/global.html');
const ContentWrappers = require('../doc/wrappers/global.html');
require('../components/styles.jsdoc.css')

const config = [
    { content: ContentWrappers, path: 'wrappers' },
    { content: ContentValidators, path: 'validators' },
];

const Doc = () => {
    const [src, setSrc] = useState(0);

    const configObject = config[src].content;
    const content = configObject
        .replace(/src="scripts/gi, `src="/doc/${config[src].path}`)
        .replace(/href="(global|index).html/gi, `href="/doc`)
        .replace(/href="styles/gi, `href="../doc/${config[src].path}/styles`);

    return (
        <Styled.Doc className="jsdoc" style={{ width: 'calc(100vw - 60px)', height: '100vh' }}>
            <Styled.DocNav>
                <div onClick={() => setSrc(0)}>Wrappers</div>
                <div onClick={() => setSrc(1)}>Validators</div>
            </Styled.DocNav>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </Styled.Doc>
    )
}

export default Doc;
