import React, { Component, useState } from 'react';
import axios from "axios";



// import Bootstrap
// import './node_modules/react-bootstrap/'
import Container from 'react-bootstrap/Container';
import { Button, Spinner, Alert, Row, Col} from 'react-bootstrap/';

function Settings () {
    const baseURL = "/users/get_linkedin_data";
    
    const [linkedinReturn, setPost] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [bannerContenet, setBannerContent] = useState(null);



    function AlertDismissibleExample({linkedinStatus}) {
        const [show, setShow] = useState(true);
        console.log(linkedinStatus)
        if (show) {
            if (linkedinStatus == 0)
            {
                return (
                    <Alert variant="success" onClose={() => setShow(false)} dismissible>
                    <Alert.Heading>Student data has been updated with relevant Linkedin milestones</Alert.Heading>
                    <p>
                        Please search for a student in order to see updates
                    </p>
                    </Alert>
                 );
            }
            else
            {
                return (
                    <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                    <Alert.Heading>There was an error retreiving Linkedin data</Alert.Heading>
                    <p>
                        Please try again at a future time. If issues persist, please contact a system administrator
                    </p>
                    </Alert>
                 );
            }




        }
        else {
            return null
        }
        
      }
      


    function fetchLinkedinStudentData() {
        
        // Set loading for data fetch
        setLoading(true);
        
        axios
          .post(baseURL, {
            title: "Sending request for Linkedin data"
          })
          .then((response) => {
            setPost(response.data);
            console.log(response)

            // Stop loading
            setLoading(false)
            
            // set banner
            setBannerContent(<AlertDismissibleExample linkedinStatus = {response.data.linkedinFetchStatus}/>);

          });
      }
      
    //   if (!post) return null;
    return (
    <div>

        <Container className="mt-4 ">
        

            <Row >
                <h1 className = "text-center mb-3">Hi this is the Settings</h1>
            </Row>

            <Row className="justify-content-md-center">
                    <Col xs lg="2">
                        <Button className="mb-3" onClick={fetchLinkedinStudentData}>Fetch Linkedin Data</Button>
                    </Col>
                   
            </Row>

            <div>
                <Row className="justify-content-md-center">
                    {isLoading == true ? 
                            <Spinner animation="border" variant="primary" />
                            // else
                            : <div>{bannerContenet}</div>}
                </Row>
            </div>
            
          

      </Container>
    </div>
    );

}

export default Settings;