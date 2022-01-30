import React from 'react';

import {Tab, Row, Col, ListGroup, Container} from "react-bootstrap" 

import LinkedinPage from "../linkedinFetch/LinkedinPage"
import CsvPage from '../csvUploader/CsvPage';


function UploadPage () {
    return (
        <div className="">
            <Tab.Container
            
                id="list-group-tabs-example"
                defaultActiveKey="#link1"
                
            >
                <Row >
                    
                    <Col md={3} className="App" >
                        <h1>Data Section</h1>
                        <p>
                            Toggle between uploading new student data with a CSV, or
                            grabbing new data from Linkedin using the existing data
                            already uploaded
                        </p>
                    
                        <ListGroup
                        
                            className="align-items-center"
                            horizontal={""}                       >
                            <ListGroup.Item
                                action
                                href="#link1"
                                style={{ width: "20em" }}
                                variant=""
                            >
                                CSV Upload
                            </ListGroup.Item>
                            <ListGroup.Item
                                action
                                href="#link2"
                                style={{ width: "20em" }}
                                variant=""
                            >
                                Linkedin Data Fetch
                            </ListGroup.Item>
                        </ListGroup>
                        <hr className="" style = {{width:"100%"}}/>
                    </Col>

                    <Col md={1}>
                        
                    </Col>
                    
                    <Col md={8} >
                        <Tab.Content>
                            <Tab.Pane eventKey="#link1">
                                <CsvPage/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="#link2">
                                <LinkedinPage></LinkedinPage>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                    
                </Row>
                    
                
            </Tab.Container>
        </div>
    );
}

export default UploadPage;