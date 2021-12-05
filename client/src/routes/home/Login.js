import React, { Component } from 'react';


// import Bootstrap
// import './node_modules/react-bootstrap/'
import Container from 'react-bootstrap/Container';
import {Toast, Form, Button, Nav} from 'react-bootstrap/';
//import Jumbotron from 'react-bootstrap/Jumbotron';

// Import Router
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

function Login () {

    return (
        <Container className ="d-flex justify-content-center">
            <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>NAU ID</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                    <Form.Text className="text-muted">
                        Please provide your NAU email
                    </Form.Text>
                    </Form.Group>
                
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                    </Form.Group>
                    <Button variant="primary" type="submit" href="/search_students">
                    Log in
                    </Button>
            </Form>

        </Container>
        
    );

}

export default Login;