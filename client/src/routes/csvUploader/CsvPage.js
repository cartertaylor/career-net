import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import "../../css/main.css";
import { Container, Tab } from "react-bootstrap";
import TableMaker from "../../components/TableMaker";

export default function CsvPage() {
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length) {
            console.log(acceptedFiles);
            parseFile(acceptedFiles[0]);
        }
    }, []);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        onDrop,
        accept: "text/csv",
    });

    const [parsedCsvData, setParsedCsvData] = useState([null]);

    const parseFile = (file) => {
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                setParsedCsvData(results.data);
            },
        });
    };

    return (
        <div className="App">
            <Container className="center">
                <div
                    {...getRootProps({
                        className: `dropzone
                    ${isDragAccept && "dropzoneAccept"}
            ${isDragReject && "dropzoneReject"}`,
                    })}
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop the files here ...</p>
                    ) : (
                        <p>
                            Drag 'n' drop some files here, or click to select
                            files
                        </p>
                    )}
                </div>
            </Container>
            <button>Import</button>
            {console.log(parsedCsvData)}


            {parsedCsvData[0] != null ? (
                <TableMaker givenJsonData={parsedCsvData} />
            ) : (
                <p></p>
            )}
        </div>
    );
}
