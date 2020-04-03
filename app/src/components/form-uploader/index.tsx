import React, { useState } from 'react';
import Dropzone from 'react-dropzone'

import Box from '../../layout/box';
import IconAdd from '../../svg/icon-add.svg';

import * as Styled from './styles';

interface FormUploaderProps {
    id: string;
    onUpload: (src: string, base64File: any) => void;
    uploaded?: string;
    onClearUpload?: () => void;
}

const FormUploader: React.FC<FormUploaderProps> = ({ id, onUpload, uploaded, onClearUpload }) => {
    const [invalidFile, setInvalidFile] = useState(false);

    const getDataUrl = (files: any) => {
        if (files.length === 0) {
            setInvalidFile(true);
            return null;
        }

        const reader = new FileReader();
        reader.onerror = (error) => {
            // TODO: handle errors
            return error;
        };
        reader.readAsDataURL(files[0]);
        reader.onload = () => {
            onUpload(id, reader.result)
        };
    }

    return (
        <Styled.Main>
            <Box add centered padded={false}>
                {uploaded
                    ? <Styled.Preview>
                        <img src={uploaded} />
                        <Styled.Delete onClick={onClearUpload} src={IconAdd} alt={'Delete'} />
                    </Styled.Preview>
                    : <Dropzone
                        data-test="dropzone"
                        onDrop={getDataUrl}
                        multiple={false}
                        accept='image/jpeg, image/png, .pdf'
                    >
                        {({ getRootProps, getInputProps }) => {
                            return (
                                <section>
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        {!invalidFile
                                            ? <p>Drag and drop here or click to browse</p>
                                            : <p>INVALID FILE: JPG, JPEG and PNG only</p>
                                        }
                                    </div>
                                </section>
                            )
                        }}
                    </Dropzone>
                }
            </Box>
        </Styled.Main>
    )
}

export default FormUploader;
