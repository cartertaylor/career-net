import React, { Component, useState } from "react";
import axios from "axios";

// import Bootstrap
// import './node_modules/react-bootstrap/'
import Container from "react-bootstrap/Container";
import { Button, Spinner, Alert, Row, Col, Card, ListGroup} from "react-bootstrap/";

import StudentSearchBar from "../seachStudents/SearchBarComponents/StudentSearcher";
import FilterSelectors from "./components/FilterSelectors";

import CalendarFilterMenu from "../../components/CalendarFilterMenu";

// Redux Store acccess
import {useSelector, useDispatch} from "react-redux" // Allows access to store
import {bindActionCreators} from "redux"
import {actionCreators} from "../../state/index"


function Settings() {
    const baseURL = "/students/get_linkedin_data";

    // Accessing store data.
    const state = useSelector((state) => state);
    const stateAccount = useSelector((state) => state.bank);

    const dispatch = useDispatch();

    const { depositMoney, withdrawMoney, addUser, addLinkedinFilter } =
        bindActionCreators(actionCreators, dispatch);

    console.log(depositMoney);

    console.log(state);
    console.log(stateAccount);
    console.log(state.linkedinFilters.selectedFilters)

    const [linkedinReturn, setPost] = useState(null);

    const [isLoading, setLoading] = useState(false);
    const [bannerContenet, setBannerContent] = useState(null);

    const [selectedFilters, setSelectedFilters] = useState(state.linkedinFilters.selectedFilters);

    console.log(selectedFilters)

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

    // Grabs the selected majors to filter and returns them in an array of strings
    function handleMajorFilterChange(arrayOfFilteredMajor) {
        console.log(arrayOfFilteredMajor == false)

        if (arrayOfFilteredMajor != false)
        {
            setSelectedFilters((prevState) => {
                return { ...prevState, filteredMajors: arrayOfFilteredMajor };
            });
            addLinkedinFilter(selectedFilters);
            console.log(state.linkedinFilters);
        }
    }

    // Grabs the selected year ranges from the filter menu ()
    function handleDateRangeChange(ranges) {
        setSelectedFilters((prevState) => {
            return { ...prevState, dateRanges: ranges };
        });
    }

    // Handle change to filter for when the student profile was last changed
    function handleLastTimeUpdatedRange(ranges) {
        setSelectedFilters((prevState) => {
            return { ...prevState, lastTimeUpdatedRange: ranges };
        });
    }

    console.log(selectedFilters);

    return (
        <div className="App">
            {/* <DateFilterMenu/> */}
            <Container className="mt-4">
                <h2 className="text-center mb-3">Linkedin Fetching</h2>
                <h6 className="mb-4">
                    You can you use the filters on the left to filter which
                    student data you would like to retreive for Linkedin. The
                    button on the right will fetch the linkedin data. Please
                    allow a few minutes for this process to complete.
                </h6>

                <div>
                    {isLoading == true ? (
                        <Spinner animation="border" variant="primary" />
                    ) : (
                        // else
                        <div>{bannerContenet}</div>
                    )}
                </div>
            </Container>
            <Container className="">
                <Row>
                    <Col>
                        <FilterSelectors
                            handleMajorFilterChange={handleMajorFilterChange}
                            handleLastTimeUpdatedRange={
                                handleLastTimeUpdatedRange
                            }
                            handleDateRangeChange={handleDateRangeChange}
                            parentState={selectedFilters}
                        ></FilterSelectors>
                    </Col>
                    <Col>
                        {" "}
                        <Button
                            className="mb-3"
                            onClick={fetchLinkedinStudentData}
                            size="lg"
                        >
                            Fetch Linkedin Data
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Settings;
