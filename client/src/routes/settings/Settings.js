import React, { Component, useState } from "react";
import axios from "axios";

// import Bootstrap
// import './node_modules/react-bootstrap/'
import Container from "react-bootstrap/Container";
import { Button, Spinner, Alert, Row, Col } from "react-bootstrap/";

import StudentSearchBar from "../seachStudents/SearchBarComponents/StudentSearcher";

function Settings() {
    const baseURL = "/users/get_linkedin_data";

    const [linkedinReturn, setPost] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [bannerContenet, setBannerContent] = useState(null);

    const [filteredMajors, setFilteredMajor] = useState(null)
    const [dateRanges, setDateRanges] = useState({startDate:undefined, endDate:undefined})


    function AlertDismissibleExample({ linkedinStatus }) {
        const [show, setShow] = useState(true);
        console.log(linkedinStatus);
        if (show) {
            if (linkedinStatus == 0) {
                return (
                    <Alert
                        variant="success"
                        onClose={() => setShow(false)}
                        dismissible
                    >
                        <Alert.Heading>
                            Student data has been updated with relevant Linkedin
                            milestones
                        </Alert.Heading>
                        <p>
                            Please search for a student in order to see updates
                        </p>
                    </Alert>
                );
            } else {
                return (
                    <Alert
                        variant="danger"
                        onClose={() => setShow(false)}
                        dismissible
                    >
                        <Alert.Heading>
                            There was an error retreiving Linkedin data
                        </Alert.Heading>
                        <p>
                            Please try again at a future time. If issues
                            persist, please contact a system administrator
                        </p>
                    </Alert>
                );
            }
        } else {
            return null;
        }
    }

    function fetchLinkedinStudentData() {
        // Set loading for data fetch
        setLoading(true);

        axios
            .post(baseURL, {
                title: "Sending request for Linkedin data",
            })
            .then((response) => {
                setPost(response.data);
                console.log(response);

                // Stop loading
                setLoading(false);

                // set banner
                setBannerContent(
                    <AlertDismissibleExample
                        linkedinStatus={response.data.linkedinFetchStatus}
                    />
                );
            });
    }

    // Grabs the selected year ranges from the filter menu 
  function handleDateRangeChange(ranges)
  {
    setDateRanges(prevState => {return {...prevState, dateRanges:ranges}})
  }

  // Grabs the selected majors to filter and returns them in an array of strings 
  function handleMajorFilterChange(arrayOfFilteredMajor)
  {
    setFilteredMajor(prevState => {return {...prevState, filteredMajors:arrayOfFilteredMajor}})
  }

    //   if (!post) return null;
    return (
        <div className = "App">
            <Container className="mt-4 ">
            <StudentSearchBar key = "searchFilter" grabDateRanges = {handleDateRangeChange} handleSearchFilterChange = {handleMajorFilterChange}/>

                <Row>
                    <h1 className="text-center mb-3">
                        Hi this is the Settings
                    </h1>
                </Row>

                <Row className="justify-content-md-center">
                    <Col xs lg="2">
                        <Button
                            className="mb-3"
                            onClick={fetchLinkedinStudentData}
                        >
                            Fetch Linkedin Data
                        </Button>
                    </Col>
                </Row>

                <div>
                    <Row className="justify-content-md-center">
                        {isLoading == true ? (
                            <Spinner animation="border" variant="primary" />
                        ) : (
                            // else
                            <div>{bannerContenet}</div>
                        )}
                    </Row>
                </div>
            </Container>
        </div>
    );
}

export default Settings;
