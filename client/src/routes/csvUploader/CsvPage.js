import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import "../../css/main.css";
import { Container, Button, Row, Col } from "react-bootstrap";
import TableMaker from "../../components/TableMaker";
import axios from "axios";

export default function CsvPage() {

    // State containing CSV data
    const [parsedCsvData, setParsedCsvData] = useState([null]);

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

    const routeURL = "/csvUpload";

    const parseFile = (file) => {
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                setParsedCsvData(results.data);
            },
        });
    };

    const uploadCsvToDatabase = () => {
        // send grabbed CSV data to backend
        axios
            .post(routeURL, {
                data:parsedCsvData,
            })
            .then((response) => {

                console.log(response);

                // TODO: Create front end reaction based on response from server (success / failure)
            });
    }

    return (
        <div className="App">
            <Container className="d-flex justify-content-center" >
                <div
                    {...getRootProps({
                        className: `dropzone
                    ${isDragAccept && "dropzoneAccept"}
            ${isDragReject && "dropzoneReject"}`,
                    })}
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <h5>Drop the files here ...</h5>
                    ) : (
                        <h5>
                            Drag CSV file here
                        </h5>
                    )}
                </div>
            </Container>

            {console.log(parsedCsvData)}

            <Container className ="mt-2">
                {parsedCsvData[0] != null ? (
                    <TableMaker givenJsonData={parsedCsvData} />
                ) : (
                    <p></p>
                )}
            </Container>
            <Container className="mb-4 mt-3">
                <Row>
                    <Col>
                        <Button variant="danger" onClick = {() => setParsedCsvData([null])}>Delete</Button>
                    </Col>
                    <Col>
                        <Button onClick = {() => uploadCsvToDatabase()}>Upload</Button>
                    </Col>
                </Row>
                
            
            </Container>
        </div>
    );
}
