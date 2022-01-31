import React from 'react';

import {Tab, Row, Col, ListGroup, Container, Nav, Tabs} from "react-bootstrap" 

import LinkedinPage from "../linkedinFetch/LinkedinPage"
import CsvPage from '../csvUploader/CsvPage';


function UploadPage () {
    return (
        <div className="">
            <h1 className = "mb-4">Data Upload Section</h1>
            <Tabs
                defaultActiveKey="home"
                transition={true}
                id="data-tab"
                className="mb-3"
                variant="tabs"
            >
                <Tab eventKey="home" title="CSV Upload">
                    <CsvPage />
                </Tab>
                <Tab eventKey="Linkedin" title="Fetch Student Linkedin Data">
                    <LinkedinPage />
                </Tab>
            </Tabs>
        </div>
    );
}

export default UploadPage;