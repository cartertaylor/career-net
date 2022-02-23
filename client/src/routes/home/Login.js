import React, { useState } from 'react';


// import Bootstrap
// import './node_modules/react-bootstrap/'
import Container from 'react-bootstrap/Container';
import {Toast, Form, Button} from 'react-bootstrap/';
//import Jumbotron from 'react-bootstrap/Jumbotron';



// Import Router
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import axios from 'axios';

function Login () {

    let baseURL = "login"

    let [credentials, setLoginCredentials] = useState({userName:null, password:null})

    function handleLoginSubmit()
    {
        axios
            .post(baseURL, {
                loginCredentials: credentials,
            })
            .then((response) => {
                // setPost(response.data);
                console.log(response);

                // // Stop loading
                // setLoading(false);

                // // set banner
                // setBannerContent(
                //     <AlertDismissibleExample
                //         linkedinStatus={response.data.linkedinFetchStatus}
                //     />
                // );
            });
    }

    console.log(credentials)

    return (
        <Container className ="d-flex justify-content-center">
            <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail"  onChange={
                            (e) =>
                            {
                                setLoginCredentials((prevState) => {
                                    return { ...prevState, userName: e.target.value }
                                })
                            }
                        }>

                        <Form.Label>NAU ID</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                            Please provide your NAU email
                        </Form.Text>
                    </Form.Group>
                
                    <Form.Group className="mb-3" controlId="formBasicPassword" 
                        onChange={
                            (e) =>
                            {
                                setLoginCredentials((prevState) => {
                                    return { ...prevState, password: e.target.value }
                                })
                            }
                        }
                    >
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Remember me" />
                    </Form.Group>

                    <Button variant="primary" type="submit" onClick={(e) =>handleLoginSubmit(e)}>
                        Log in
                    </Button>
            </Form>

        </Container>
        
    );

}

export default Login;